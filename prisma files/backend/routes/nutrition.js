import { FastifyPlugin } from 'fastify-plugin';
import { z } from 'zod';
import { isAuthenticated } from '../middlewares/auth.js';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// Validation schemas
const createNutritionLogSchema = z.object({
  date: z.string().datetime(),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  name: z.string().min(1),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbohydrates: z.number().optional(),
  fat: z.number().optional(),
  fiber: z.number().optional(),
  sugar: z.number().optional(),
  sodium: z.number().optional(),
  notes: z.string().optional(),
  mood: z.string().optional(),
  hunger: z.number().int().min(1).max(10).optional(),
  location: z.string().optional(),
  foodItems: z.array(z.object({
    name: z.string(),
    brand: z.string().optional(),
    servingSize: z.number(),
    servingUnit: z.string(),
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbohydrates: z.number().optional(),
    fat: z.number().optional(),
    barcode: z.string().optional(),
    foodDatabaseId: z.string().optional(),
  })).optional(),
  foodImage: z.string().optional()
});

const generateNutritionPlanSchema = z.object({
  duration: z.number().int().min(1).max(30).optional(),
  dietType: z.string().optional(),
  goalType: z.string().optional(),
  activityLevel: z.string().optional(),
  mealsPerDay: z.number().int().min(3).max(7).optional(),
  additionalRequirements: z.string().optional()
});

const searchFoodSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(50).optional().default(10)
});

const analyzeImageSchema = z.object({
  imageUrl: z.string().url()
});

export default async function nutritionRoutes(fastify) {
  // Register authentication middleware
  fastify.register(async (instance) => {
    // Apply authentication middleware to all routes in this plugin
    instance.addHook('onRequest', isAuthenticated);
    
    // Get nutrition logs
    instance.get('/logs', async (request, reply) => {
      try {
        const { startDate, endDate, mealType, limit = 20, offset = 0 } = request.query;
        const userId = request.user.id;
        
        // Build filter
        const filter = { userId };
        
        if (startDate && endDate) {
          filter.date = {
            gte: new Date(startDate),
            lte: new Date(endDate)
          };
        }
        
        if (mealType) {
          filter.mealType = mealType;
        }
        
        // Query logs with pagination
        const [logs, total] = await Promise.all([
          prisma.nutritionLog.findMany({
            where: filter,
            include: { foodItems: true },
            orderBy: { date: 'desc' },
            skip: parseInt(offset),
            take: parseInt(limit)
          }),
          prisma.nutritionLog.count({ where: filter })
        ]);
        
        // Calculate nutritional totals by day
        const dailyTotals = await calculateDailyTotals(userId, startDate, endDate);
        
        return reply.send({
          data: logs,
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + logs.length < total
          },
          dailyTotals
        });
        
      } catch (error) {
        logger.error(error, 'Error retrieving nutrition logs');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Create nutrition log
    instance.post('/logs', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        // Validate request body
        const validatedData = createNutritionLogSchema.parse(request.body);
        
        // Prepare data for insertion
        const { foodItems, ...logData } = validatedData;
        
        // Create transaction to insert log and food items
        const result = await prisma.$transaction(async (tx) => {
          // Create nutrition log
          const nutritionLog = await tx.nutritionLog.create({
            data: {
              ...logData,
              date: new Date(logData.date),
              userId,
              aiAnalyzed: !!logData.foodImage, // Flag for image analysis
            }
          });
          
          // Create food items if provided
          if (foodItems && foodItems.length > 0) {
            await tx.foodItem.createMany({
              data: foodItems.map(item => ({
                ...item,
                nutritionLogId: nutritionLog.id
              }))
            });
          }
          
          // If food image is provided, trigger AI analysis in background
          if (logData.foodImage) {
            // Queue for background processing
            fastify.queue.addJobToQueue('analyzeNutritionImage', {
              userId,
              nutritionLogId: nutritionLog.id,
              imageUrl: logData.foodImage
            });
          }
          
          // Return created log with food items
          return tx.nutritionLog.findUnique({
            where: { id: nutritionLog.id },
            include: { foodItems: true }
          });
        });
        
        // Update user's nutritional insights cache
        fastify.redis.del(`user:${userId}:nutrition:insights`);
        
        return reply.code(201).send(result);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error creating nutrition log');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get nutrition log by ID
    instance.get('/logs/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        const nutritionLog = await prisma.nutritionLog.findUnique({
          where: { id, userId },
          include: { foodItems: true }
        });
        
        if (!nutritionLog) {
          return reply.code(404).send({ error: 'Nutrition log not found' });
        }
        
        return reply.send(nutritionLog);
        
      } catch (error) {
        logger.error(error, 'Error retrieving nutrition log');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Update nutrition log
    instance.put('/logs/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Validate request body
        const validatedData = createNutritionLogSchema.parse(request.body);
        
        // Check if log exists and belongs to user
        const existingLog = await prisma.nutritionLog.findUnique({
          where: { id, userId }
        });
        
        if (!existingLog) {
          return reply.code(404).send({ error: 'Nutrition log not found' });
        }
        
        // Prepare data for update
        const { foodItems, ...logData } = validatedData;
        
        // Update transaction
        const result = await prisma.$transaction(async (tx) => {
          // Update nutrition log
          const updatedLog = await tx.nutritionLog.update({
            where: { id },
            data: {
              ...logData,
              date: new Date(logData.date)
            }
          });
          
          // Delete existing food items
          await tx.foodItem.deleteMany({
            where: { nutritionLogId: id }
          });
          
          // Create new food items if provided
          if (foodItems && foodItems.length > 0) {
            await tx.foodItem.createMany({
              data: foodItems.map(item => ({
                ...item,
                nutritionLogId: id
              }))
            });
          }
          
          // Return updated log with food items
          return tx.nutritionLog.findUnique({
            where: { id },
            include: { foodItems: true }
          });
        });
        
        // Update user's nutritional insights cache
        fastify.redis.del(`user:${userId}:nutrition:insights`);
        
        return reply.send(result);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error updating nutrition log');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Delete nutrition log
    instance.delete('/logs/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Check if log exists and belongs to user
        const existingLog = await prisma.nutritionLog.findUnique({
          where: { id, userId }
        });
        
        if (!existingLog) {
          return reply.code(404).send({ error: 'Nutrition log not found' });
        }
        
        // Delete transaction (will cascade to food items due to relation)
        await prisma.nutritionLog.delete({
          where: { id }
        });
        
        // Update user's nutritional insights cache
        fastify.redis.del(`user:${userId}:nutrition:insights`);
        
        return reply.code(204).send();
        
      } catch (error) {
        logger.error(error, 'Error deleting nutrition log');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get nutrition statistics
    instance.get('/stats', async (request, reply) => {
      try {
        const userId = request.user.id;
        const { period = 'week' } = request.query;
        
        let startDate;
        const endDate = new Date();
        
        // Determine time period
        switch (period) {
          case 'week':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'month':
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case 'year':
            startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
          default:
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        }
        
        // Check if stats are in cache
        const cacheKey = `user:${userId}:nutrition:stats:${period}`;
        const cachedStats = await fastify.redis.get(cacheKey);
        
        if (cachedStats) {
          return reply.send(JSON.parse(cachedStats));
        }
        
        // Calculate statistics
        const stats = await calculateNutritionStats(userId, startDate, endDate);
        
        // Cache results for 1 hour
        await fastify.redis.set(cacheKey, JSON.stringify(stats), 'EX', 3600);
        
        return reply.send(stats);
        
      } catch (error) {
        logger.error(error, 'Error retrieving nutrition statistics');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Generate AI nutrition plan
    instance.post('/plans/generate', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        // Validate request body
        const validatedData = generateNutritionPlanSchema.parse(request.body);
        
        // Generate plan
        const plan = await fastify.ai.generateNutritionPlan(userId, validatedData);
        
        return reply.send(plan);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error generating nutrition plan');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get user's nutrition plans
    instance.get('/plans', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        const plans = await prisma.aiNutritionPlan.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });
        
        return reply.send(plans);
        
      } catch (error) {
        logger.error(error, 'Error retrieving nutrition plans');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get nutrition plan by ID
    instance.get('/plans/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        const plan = await prisma.aiNutritionPlan.findUnique({
          where: { id, userId }
        });
        
        if (!plan) {
          return reply.code(404).send({ error: 'Nutrition plan not found' });
        }
        
        return reply.send(plan);
        
      } catch (error) {
        logger.error(error, 'Error retrieving nutrition plan');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Delete nutrition plan
    instance.delete('/plans/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        const plan = await prisma.aiNutritionPlan.findUnique({
          where: { id, userId }
        });
        
        if (!plan) {
          return reply.code(404).send({ error: 'Nutrition plan not found' });
        }
        
        await prisma.aiNutritionPlan.delete({
          where: { id }
        });
        
        return reply.code(204).send();
        
      } catch (error) {
        logger.error(error, 'Error deleting nutrition plan');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Search food database
    instance.get('/foods/search', async (request, reply) => {
      try {
        // Validate query params
        const { query, limit } = searchFoodSchema.parse(request.query);
        
        // Search vector store for semantic food search
        const results = await fastify.vectorStore.similaritySearch(query, limit);
        
        // Transform results
        const foods = results.map(item => ({
          name: item.pageContent.name,
          brand: item.pageContent.brand,
          servingSize: item.pageContent.servingSize,
          servingUnit: item.pageContent.servingUnit,
          calories: item.pageContent.calories,
          protein: item.pageContent.protein,
          carbohydrates: item.pageContent.carbohydrates,
          fat: item.pageContent.fat,
          foodDatabaseId: item.metadata.id,
          similarity: item.score
        }));
        
        return reply.send({ foods });
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error searching food database');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Analyze food image
    instance.post('/analyze/image', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        // Validate request body
        const { imageUrl } = analyzeImageSchema.parse(request.body);
        
        // Call AI service to analyze image
        const analysis = await fastify.ai.analyzeNutritionImage(imageUrl, userId);
        
        return reply.send(analysis);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error analyzing food image');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Real-time nutritional insights via WebSocket
    instance.get('/insights/realtime', { websocket: true }, (connection, req) => {
      const userId = req.user.id;
      
      logger.info({ userId }, 'User connected to real-time nutrition insights');
      
      // Subscribe to user-specific Redis channel for updates
      const subscriber = new fastify.redis.duplicate();
      const channel = `user:${userId}:nutrition:updates`;
      
      subscriber.subscribe(channel, (err) => {
        if (err) {
          logger.error({ err, userId }, 'Error subscribing to Redis channel');
          connection.socket.close();
          return;
        }
        
        // Send initial insights
        fastify.ai.getPersonalizedInsights(userId)
          .then(insights => {
            connection.socket.send(JSON.stringify({
              type: 'insights',
              data: insights
            }));
          })
          .catch(err => {
            logger.error({ err, userId }, 'Error getting initial insights');
          });
        
        // Listen for Redis messages and forward to client
        subscriber.on('message', (channel, message) => {
          connection.socket.send(message);
        });
        
        // Clean up on disconnect
        connection.socket.on('close', () => {
          subscriber.unsubscribe(channel);
          subscriber.quit();
          logger.info({ userId }, 'User disconnected from real-time nutrition insights');
        });
      });
    });
  });
}

// Helper functions
async function calculateDailyTotals(userId, startDate, endDate) {
  const dateFilter = {};
  
  if (startDate && endDate) {
    dateFilter.gte = new Date(startDate);
    dateFilter.lte = new Date(endDate);
  } else {
    // Default to last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    dateFilter.gte = sevenDaysAgo;
    dateFilter.lte = new Date();
  }
  
  // Aggregate nutrition logs by day
  const logs = await prisma.nutritionLog.findMany({
    where: {
      userId,
      date: dateFilter
    },
    orderBy: { date: 'asc' }
  });
  
  // Group by day and calculate totals
  const dailyTotals = {};
  
  logs.forEach(log => {
    const dateKey = log.date.toISOString().split('T')[0];
    
    if (!dailyTotals[dateKey]) {
      dailyTotals[dateKey] = {
        date: dateKey,
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0
      };
    }
    
    dailyTotals[dateKey].calories += log.calories || 0;
    dailyTotals[dateKey].protein += log.protein || 0;
    dailyTotals[dateKey].carbohydrates += log.carbohydrates || 0;
    dailyTotals[dateKey].fat += log.fat || 0;
  });
  
  return Object.values(dailyTotals);
}

async function calculateNutritionStats(userId, startDate, endDate) {
  // Get nutrition logs in date range
  const logs = await prisma.nutritionLog.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: { foodItems: true }
  });
  
  // Initialize stats object
  const stats = {
    totalDays: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)),
    loggedDays: new Set(),
    averages: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0
    },
    mealDistribution: {
      BREAKFAST: 0,
      LUNCH: 0,
      DINNER: 0,
      SNACK: 0
    },
    topFoods: {},
    macroPercentages: {
      protein: 0,
      carbohydrates: 0,
      fat: 0
    },
    trends: {
      calories: [],
      protein: [],
      carbohydrates: [],
      fat: []
    }
  };
  
  // Process logs
  if (logs.length === 0) {
    return stats;
  }
  
  // Group logs by day
  const logsByDay = {};
  
  logs.forEach(log => {
    const dateKey = log.date.toISOString().split('T')[0];
    
    if (!logsByDay[dateKey]) {
      logsByDay[dateKey] = [];
      stats.loggedDays.add(dateKey);
    }
    
    logsByDay[dateKey].push(log);
    
    // Count meal types
    stats.mealDistribution[log.mealType]++;
    
    // Track food items
    log.foodItems.forEach(item => {
      if (!stats.topFoods[item.name]) {
        stats.topFoods[item.name] = 0;
      }
      stats.topFoods[item.name]++;
    });
  });
  
  // Calculate daily averages and trends
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  
  Object.entries(logsByDay).forEach(([date, dayLogs]) => {
    let dayCalories = 0;
    let dayProtein = 0;
    let dayCarbs = 0;
    let dayFat = 0;
    
    dayLogs.forEach(log => {
      dayCalories += log.calories || 0;
      dayProtein += log.protein || 0;
      dayCarbs += log.carbohydrates || 0;
      dayFat += log.fat || 0;
    });
    
    totalCalories += dayCalories;
    totalProtein += dayProtein;
    totalCarbs += dayCarbs;
    totalFat += dayFat;
    
    // Add to trends
    stats.trends.calories.push({ date, value: dayCalories });
    stats.trends.protein.push({ date, value: dayProtein });
    stats.trends.carbohydrates.push({ date, value: dayCarbs });
    stats.trends.fat.push({ date, value: dayFat });
  });
  
  // Calculate averages
  const loggedDaysCount = stats.loggedDays.size;
  
  if (loggedDaysCount > 0) {
    stats.averages.calories = Math.round(totalCalories / loggedDaysCount);
    stats.averages.protein = Math.round(totalProtein / loggedDaysCount);
    stats.averages.carbohydrates = Math.round(totalCarbs / loggedDaysCount);
    stats.averages.fat = Math.round(totalFat / loggedDaysCount);
    
    // Calculate macro percentages
    const totalMacros = (stats.averages.protein * 4) + (stats.averages.carbohydrates * 4) + (stats.averages.fat * 9);
    
    if (totalMacros > 0) {
      stats.macroPercentages.protein = Math.round((stats.averages.protein * 4 / totalMacros) * 100);
      stats.macroPercentages.carbohydrates = Math.round((stats.averages.carbohydrates * 4 / totalMacros) * 100);
      stats.macroPercentages.fat = Math.round((stats.averages.fat * 9 / totalMacros) * 100);
    }
  }
  
  // Convert top foods object to sorted array
  stats.topFoods = Object.entries(stats.topFoods)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Sort trends by date
  stats.trends.calories.sort((a, b) => new Date(a.date) - new Date(b.date));
  stats.trends.protein.sort((a, b) => new Date(a.date) - new Date(b.date));
  stats.trends.carbohydrates.sort((a, b) => new Date(a.date) - new Date(b.date));
  stats.trends.fat.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Convert loggedDays set to array length
  stats.loggedDays = stats.loggedDays.size;
  
  return stats;
} 