import { z } from 'zod';
import { isAuthenticated } from '../middlewares/auth.js';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// Validation schemas
const createWorkoutLogSchema = z.object({
  date: z.string().datetime(),
  duration: z.number().int().min(1),
  workoutType: z.enum(['STRENGTH', 'CARDIO', 'FLEXIBILITY', 'HIIT', 'YOGA', 'PILATES', 'SPORTS', 'OTHER']),
  caloriesBurned: z.number().optional(),
  avgHeartRate: z.number().int().optional(),
  maxHeartRate: z.number().int().optional(),
  heartRateZones: z.any().optional(),
  trainingLoad: z.number().optional(),
  recoveryScore: z.number().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  mood: z.string().optional(),
  energyLevel: z.number().int().min(1).max(10).optional(),
  sourceDevice: z.string().optional(),
  sourceApp: z.string().optional(),
  exercises: z.array(z.object({
    name: z.string(),
    exerciseType: z.enum(['STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BALANCE']),
    sets: z.number().int().optional(),
    reps: z.number().int().optional(),
    weight: z.number().optional(),
    distance: z.number().optional(),
    duration: z.number().int().optional(),
    pace: z.number().optional(),
    caloriesBurned: z.number().optional(),
    notes: z.string().optional()
  })).optional()
});

const generateWorkoutPlanSchema = z.object({
  duration: z.number().int().min(1).max(12).optional(),
  experienceLevel: z.string().optional(),
  goalType: z.string().optional(),
  availableEquipment: z.array(z.string()).optional(),
  daysPerWeek: z.number().int().min(1).max(7).optional(),
  limitations: z.array(z.string()).optional(),
  additionalRequirements: z.string().optional()
});

export default async function fitnessRoutes(fastify) {
  // Register authentication middleware
  fastify.register(async (instance) => {
    // Apply authentication middleware to all routes in this plugin
    instance.addHook('onRequest', isAuthenticated);
    
    // Get workout logs
    instance.get('/logs', async (request, reply) => {
      try {
        const { startDate, endDate, workoutType, limit = 20, offset = 0 } = request.query;
        const userId = request.user.id;
        
        // Build filter
        const filter = { userId };
        
        if (startDate && endDate) {
          filter.date = {
            gte: new Date(startDate),
            lte: new Date(endDate)
          };
        }
        
        if (workoutType) {
          filter.workoutType = workoutType;
        }
        
        // Query logs with pagination
        const [logs, total] = await Promise.all([
          prisma.workoutLog.findMany({
            where: filter,
            include: { exercises: true },
            orderBy: { date: 'desc' },
            skip: parseInt(offset),
            take: parseInt(limit)
          }),
          prisma.workoutLog.count({ where: filter })
        ]);
        
        return reply.send({
          data: logs,
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + logs.length < total
          }
        });
        
      } catch (error) {
        logger.error(error, 'Error retrieving workout logs');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Create workout log
    instance.post('/logs', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        // Validate request body
        const validatedData = createWorkoutLogSchema.parse(request.body);
        
        // Prepare data for insertion
        const { exercises, ...logData } = validatedData;
        
        // Create transaction to insert log and exercises
        const result = await prisma.$transaction(async (tx) => {
          // Create workout log
          const workoutLog = await tx.workoutLog.create({
            data: {
              ...logData,
              date: new Date(logData.date),
              userId
            }
          });
          
          // Create exercises if provided
          if (exercises && exercises.length > 0) {
            await tx.exercise.createMany({
              data: exercises.map(exercise => ({
                ...exercise,
                workoutLogId: workoutLog.id
              }))
            });
          }
          
          // Return created log with exercises
          return tx.workoutLog.findUnique({
            where: { id: workoutLog.id },
            include: { exercises: true }
          });
        });
        
        // Update user's fitness insights cache
        fastify.redis.del(`user:${userId}:fitness:insights`);
        
        return reply.code(201).send(result);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error creating workout log');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get workout log by ID
    instance.get('/logs/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        const workoutLog = await prisma.workoutLog.findUnique({
          where: { id, userId },
          include: { exercises: true }
        });
        
        if (!workoutLog) {
          return reply.code(404).send({ error: 'Workout log not found' });
        }
        
        return reply.send(workoutLog);
        
      } catch (error) {
        logger.error(error, 'Error retrieving workout log');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Update workout log
    instance.put('/logs/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Validate request body
        const validatedData = createWorkoutLogSchema.parse(request.body);
        
        // Check if log exists and belongs to user
        const existingLog = await prisma.workoutLog.findUnique({
          where: { id, userId }
        });
        
        if (!existingLog) {
          return reply.code(404).send({ error: 'Workout log not found' });
        }
        
        // Prepare data for update
        const { exercises, ...logData } = validatedData;
        
        // Update transaction
        const result = await prisma.$transaction(async (tx) => {
          // Update workout log
          const updatedLog = await tx.workoutLog.update({
            where: { id },
            data: {
              ...logData,
              date: new Date(logData.date)
            }
          });
          
          // Delete existing exercises
          await tx.exercise.deleteMany({
            where: { workoutLogId: id }
          });
          
          // Create new exercises if provided
          if (exercises && exercises.length > 0) {
            await tx.exercise.createMany({
              data: exercises.map(exercise => ({
                ...exercise,
                workoutLogId: id
              }))
            });
          }
          
          // Return updated log with exercises
          return tx.workoutLog.findUnique({
            where: { id },
            include: { exercises: true }
          });
        });
        
        // Update user's fitness insights cache
        fastify.redis.del(`user:${userId}:fitness:insights`);
        
        return reply.send(result);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error updating workout log');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Delete workout log
    instance.delete('/logs/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Check if log exists and belongs to user
        const existingLog = await prisma.workoutLog.findUnique({
          where: { id, userId }
        });
        
        if (!existingLog) {
          return reply.code(404).send({ error: 'Workout log not found' });
        }
        
        // Delete transaction (will cascade to exercises due to relation)
        await prisma.workoutLog.delete({
          where: { id }
        });
        
        // Update user's fitness insights cache
        fastify.redis.del(`user:${userId}:fitness:insights`);
        
        return reply.code(204).send();
        
      } catch (error) {
        logger.error(error, 'Error deleting workout log');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get fitness statistics
    instance.get('/stats', async (request, reply) => {
      try {
        const userId = request.user.id;
        const { period = 'month' } = request.query;
        
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
            startDate.setMonth(startDate.getMonth() - 1);
        }
        
        // Check if stats are in cache
        const cacheKey = `user:${userId}:fitness:stats:${period}`;
        const cachedStats = await fastify.redis.get(cacheKey);
        
        if (cachedStats) {
          return reply.send(JSON.parse(cachedStats));
        }
        
        // Calculate statistics
        const stats = await calculateFitnessStats(userId, startDate, endDate);
        
        // Cache results for 1 hour
        await fastify.redis.set(cacheKey, JSON.stringify(stats), 'EX', 3600);
        
        return reply.send(stats);
        
      } catch (error) {
        logger.error(error, 'Error retrieving fitness statistics');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Generate AI workout plan
    instance.post('/plans/generate', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        // Validate request body
        const validatedData = generateWorkoutPlanSchema.parse(request.body);
        
        // Generate plan
        const plan = await fastify.ai.generateWorkoutPlan(userId, validatedData);
        
        return reply.send(plan);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error generating workout plan');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get user's workout plans
    instance.get('/plans', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        const plans = await prisma.aiWorkoutPlan.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });
        
        return reply.send(plans);
        
      } catch (error) {
        logger.error(error, 'Error retrieving workout plans');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get workout plan by ID
    instance.get('/plans/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        const plan = await prisma.aiWorkoutPlan.findUnique({
          where: { id, userId }
        });
        
        if (!plan) {
          return reply.code(404).send({ error: 'Workout plan not found' });
        }
        
        return reply.send(plan);
        
      } catch (error) {
        logger.error(error, 'Error retrieving workout plan');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Delete workout plan
    instance.delete('/plans/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        const plan = await prisma.aiWorkoutPlan.findUnique({
          where: { id, userId }
        });
        
        if (!plan) {
          return reply.code(404).send({ error: 'Workout plan not found' });
        }
        
        await prisma.aiWorkoutPlan.delete({
          where: { id }
        });
        
        return reply.code(204).send();
        
      } catch (error) {
        logger.error(error, 'Error deleting workout plan');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
  });
}

// Helper function to calculate fitness statistics
async function calculateFitnessStats(userId, startDate, endDate) {
  // Get workout logs in date range
  const logs = await prisma.workoutLog.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: { exercises: true },
    orderBy: { date: 'asc' }
  });
  
  // Initialize stats object
  const stats = {
    totalWorkouts: logs.length,
    totalDuration: 0,
    totalCaloriesBurned: 0,
    workoutsByType: {},
    exerciseFrequency: {},
    durationTrend: [],
    caloriesTrend: [],
    heartRateTrend: [],
    workoutFrequency: {
      mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0
    }
  };
  
  // Calculate stats
  logs.forEach(log => {
    // Total duration
    stats.totalDuration += log.duration || 0;
    
    // Total calories
    stats.totalCaloriesBurned += log.caloriesBurned || 0;
    
    // Workouts by type
    if (!stats.workoutsByType[log.workoutType]) {
      stats.workoutsByType[log.workoutType] = 0;
    }
    stats.workoutsByType[log.workoutType]++;
    
    // Exercise frequency
    log.exercises.forEach(exercise => {
      if (!stats.exerciseFrequency[exercise.name]) {
        stats.exerciseFrequency[exercise.name] = 0;
      }
      stats.exerciseFrequency[exercise.name]++;
    });
    
    // Trends
    const dateStr = log.date.toISOString().split('T')[0];
    stats.durationTrend.push({ date: dateStr, value: log.duration });
    stats.caloriesTrend.push({ date: dateStr, value: log.caloriesBurned || 0 });
    
    if (log.avgHeartRate) {
      stats.heartRateTrend.push({ date: dateStr, value: log.avgHeartRate });
    }
    
    // Workout frequency by day of week
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][log.date.getDay()];
    stats.workoutFrequency[dayOfWeek]++;
  });
  
  // Convert exercise frequency to sorted array
  stats.exerciseFrequency = Object.entries(stats.exerciseFrequency)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Convert workouts by type to array
  stats.workoutsByType = Object.entries(stats.workoutsByType)
    .map(([type, count]) => ({ type, count }));
  
  // Calculate averages
  stats.avgWorkoutDuration = stats.totalWorkouts > 0 
    ? Math.round(stats.totalDuration / stats.totalWorkouts) 
    : 0;
  
  stats.avgCaloriesBurned = stats.totalWorkouts > 0 
    ? Math.round(stats.totalCaloriesBurned / stats.totalWorkouts) 
    : 0;
  
  // Calculate workouts per week
  const totalWeeks = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7)));
  stats.workoutsPerWeek = parseFloat((stats.totalWorkouts / totalWeeks).toFixed(1));
  
  return stats;
} 