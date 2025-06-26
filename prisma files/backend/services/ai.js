import Anthropic from '@anthropic/sdk';
import { OpenAI } from 'openai';
import { PromptTemplate } from 'langchain/prompts';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { loadNutritionData } from '../data/nutrition-database.js';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Initialize all AI services
 */
export async function initializeAI() {
  logger.info('Initializing AI services');
  
  // Load nutrition data for context enhancement
  const nutritionData = await loadNutritionData();
  
  return {
    generateNutritionPlan,
    generateWorkoutPlan,
    analyzeNutritionImage,
    provideFeedback,
    getPersonalizedInsights,
    generateMealSuggestions,
    analyzeHealthTrends,
    scanBarcode,
    chatWithNutritionistAI,
  };
}

/**
 * Generate a personalized nutrition plan based on user data and goals
 */
async function generateNutritionPlan(userId, options = {}) {
  try {
    logger.info({ userId, options }, 'Generating personalized nutrition plan');
    
    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        goals: true,
        nutritionLogs: {
          take: 20,
          orderBy: { date: 'desc' },
        },
        bodyMeasurements: {
          take: 1,
          orderBy: { date: 'desc' },
        },
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Calculate BMR using Mifflin-St Jeor formula
    const age = user.dateOfBirth ? Math.floor((new Date() - new Date(user.dateOfBirth)) / 31557600000) : 30;
    const weight = user.weight || (user.bodyMeasurements[0]?.weight || 70);
    const height = user.height || 170;
    const gender = user.gender || 'unknown';
    
    let bmr = 0;
    if (gender.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multiplier
    const activityLevels = {
      sedentary: 1.2,
      lightlyActive: 1.375,
      moderatelyActive: 1.55,
      veryActive: 1.725,
      extraActive: 1.9,
    };
    
    const activityLevel = options.activityLevel || 'moderatelyActive';
    const tdee = Math.round(bmr * activityLevels[activityLevel]);
    
    // Determine diet type
    const dietType = options.dietType || user.dietaryPreferences?.includes('vegan') 
      ? 'vegan' 
      : user.dietaryPreferences?.includes('vegetarian') 
        ? 'vegetarian' 
        : 'standard';
    
    // Generate macronutrient split based on goal
    const goalType = options.goalType || user.goals[0]?.type || 'MAINTAIN';
    let calorieAdjustment = 0;
    let proteinFactor = 0;
    let carbFactor = 0;
    let fatFactor = 0;
    
    switch(goalType) {
      case 'WEIGHT_LOSS':
        calorieAdjustment = -500;
        proteinFactor = 2.2; // g/kg
        carbFactor = 2.0; // g/kg
        fatFactor = 0.8; // g/kg
        break;
      case 'MUSCLE_GAIN':
        calorieAdjustment = 300;
        proteinFactor = 2.4; // g/kg
        carbFactor = 4.0; // g/kg
        fatFactor = 1.0; // g/kg
        break;
      default: // MAINTAIN
        calorieAdjustment = 0;
        proteinFactor = 1.8; // g/kg
        carbFactor = 3.0; // g/kg
        fatFactor = 0.8; // g/kg
    }
    
    const targetCalories = tdee + calorieAdjustment;
    const targetProtein = Math.round(weight * proteinFactor);
    const targetCarbs = Math.round(weight * carbFactor);
    const targetFat = Math.round(weight * fatFactor);
    
    // Calculate meals per day
    const mealsPerDay = options.mealsPerDay || 4;
    
    // Get user preferences and restrictions
    const allergies = user.allergies || [];
    const preferences = user.dietaryPreferences || [];
    
    // Generate prompt for AI
    const prompt = PromptTemplate.fromTemplate(`
    Generate a ${options.duration || 7}-day personalized nutrition plan for a ${age}-year-old ${gender} with the following characteristics:
    
    - Weight: ${weight} kg
    - Height: ${height} cm
    - Diet type: ${dietType}
    - Goal: ${goalType}
    - Activity level: ${activityLevel}
    - Allergies/Restrictions: ${allergies.join(', ')}
    - Preferences: ${preferences.join(', ')}
    
    Daily targets:
    - Calories: ${targetCalories} kcal
    - Protein: ${targetProtein}g
    - Carbohydrates: ${targetCarbs}g
    - Fat: ${targetFat}g
    - Meals per day: ${mealsPerDay}
    
    For each day and meal, include:
    1. Meal name
    2. Ingredient list with quantities
    3. Nutrition information (calories, protein, carbs, fat)
    4. Brief preparation instructions
    
    Additional requirements:
    - Ensure variety across days
    - Include practical, easy-to-prepare meals
    - Use seasonal and accessible ingredients
    - Balance macronutrients appropriately across meals
    - ${options.additionalRequirements || ''}
    
    Format the response as a valid JSON object that can be directly parsed, with this structure:
    {
      "plan": {
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "type": "BREAKFAST",
                "name": "meal name",
                "ingredients": [{"name": "ingredient 1", "amount": "100g"}, ...],
                "nutrition": {"calories": 350, "protein": 30, "carbs": 40, "fat": 10},
                "instructions": "Brief preparation steps"
              },
              ...
            ],
            "totalNutrition": {"calories": 2000, "protein": 150, "carbs": 200, "fat": 60}
          },
          ...
        ]
      }
    }
    `);
    
    // Generate plan using Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      system: "You are a certified nutritionist and dietitian specializing in personalized meal planning. Your expertise lies in creating nutrition plans tailored to individual needs, goals, and preferences. Provide evidence-based recommendations with precise measurements and nutrition values.",
      messages: [
        {
          role: 'user',
          content: await prompt.format({})
        }
      ]
    });
    
    // Parse the response
    const responseContent = message.content[0].text;
    const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || 
                      responseContent.match(/{[\s\S]*?}/);
                      
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const planData = JSON.parse(jsonMatch[0].replace(/```json\n|```/g, ''));
    
    // Save the plan to the database
    const nutritionPlan = await prisma.aiNutritionPlan.create({
      data: {
        userId,
        name: `${goalType} Nutrition Plan`,
        description: `${options.duration || 7}-day personalized nutrition plan`,
        startDate: new Date(),
        endDate: new Date(Date.now() + (options.duration || A7) * 86400000),
        calorieTarget: targetCalories,
        proteinTarget: targetProtein,
        carbTarget: targetCarbs,
        fatTarget: targetFat,
        mealPlan: planData,
        aiModel: 'claude-3-opus-20240229',
        aiPrompt: await prompt.format({}),
      }
    });
    
    return {
      id: nutritionPlan.id,
      plan: planData
    };
    
  } catch (error) {
    logger.error({ error, userId }, 'Error generating nutrition plan');
    throw error;
  }
}

/**
 * Generate a personalized workout plan based on user data and goals
 */
async function generateWorkoutPlan(userId, options = {}) {
  try {
    logger.info({ userId, options }, 'Generating personalized workout plan');
    
    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        goals: true,
        workoutLogs: {
          take: 10,
          orderBy: { date: 'desc' },
          include: {
            exercises: true,
          },
        },
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Determine experience level
    const experienceLevel = options.experienceLevel || 'intermediate';
    
    // Determine goal type
    const goalType = options.goalType || user.goals.find(g => 
      g.type === 'MUSCLE_GAIN' || g.type === 'WEIGHT_LOSS' || g.type === 'ENDURANCE'
    )?.type || 'GENERAL_FITNESS';
    
    // Get equipment availability
    const availableEquipment = options.availableEquipment || ['bodyweight', 'dumbbells'];
    
    // Determine training frequency
    const daysPerWeek = options.daysPerWeek || 4;
    
    // Check for limitations/injuries
    const limitations = options.limitations || [];
    
    // Generate prompt for workout plan
    const prompt = PromptTemplate.fromTemplate(`
    Create a ${options.duration || 4}-week progressive workout plan for a ${user.gender || 'person'} with the following parameters:
    
    - Experience level: ${experienceLevel}
    - Primary goal: ${goalType}
    - Available equipment: ${availableEquipment.join(', ')}
    - Training frequency: ${daysPerWeek} days per week
    - Limitations/injuries: ${limitations.join(', ') || 'None'}
    
    The plan should include:
    1. A weekly schedule with specific workouts for each training day
    2. For each workout:
       - Warm-up routine
       - Main exercises with sets, reps, and rest periods
       - Cool-down/stretching
    3. Progressive overload strategy over the weeks
    4. Recommendations for cardio and recovery
    
    Additional requirements:
    - Include exercise alternatives for each main movement
    - Provide form cues for complex exercises
    - Balance pushing and pulling movements
    - Include mobility work
    - ${options.additionalRequirements || ''}
    
    Format the response as a valid JSON object that can be directly parsed, with this structure:
    {
      "plan": {
        "level": "intermediate",
        "goal": "MUSCLE_GAIN",
        "weeks": [
          {
            "week": 1,
            "days": [
              {
                "day": 1,
                "focus": "Upper Body",
                "warmup": ["Exercise 1", "Exercise 2"],
                "exercises": [
                  {
                    "name": "Bench Press",
                    "sets": 4,
                    "reps": "8-10",
                    "rest": "90 sec",
                    "notes": "Form cues or alternatives"
                  },
                  ...
                ],
                "cooldown": ["Stretch 1", "Stretch 2"]
              },
              ...
            ]
          },
          ...
        ]
      }
    }
    `);
    
    // Generate plan using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-05-13',
      messages: [
        {
          role: 'system',
          content: "You are a certified personal trainer and exercise physiologist specializing in designing comprehensive workout programs. Create evidence-based, progressive training plans tailored to individual goals, experience levels, and limitations. Include detailed workout structures, exercise selection, and programming variables."
        },
        {
          role: 'user',
          content: await prompt.format({})
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });
    
    // Parse the response
    const planData = JSON.parse(completion.choices[0].message.content);
    
    // Save the plan to the database
    const workoutPlan = await prisma.aiWorkoutPlan.create({
      data: {
        userId,
        name: `${goalType} Workout Plan`,
        description: `${options.duration || 4}-week personalized workout plan`,
        startDate: new Date(),
        endDate: new Date(Date.now() + (options.duration || 4) * 7 * 86400000),
        level: experienceLevel,
        workoutPlan: planData,
        aiModel: 'gpt-4o-2024-05-13',
        aiPrompt: await prompt.format({}),
      }
    });
    
    return {
      id: workoutPlan.id,
      plan: planData
    };
    
  } catch (error) {
    logger.error({ error, userId }, 'Error generating workout plan');
    throw error;
  }
}

/**
 * Analyze food images for nutritional content
 */
async function analyzeNutritionImage(imageUrl, userId) {
  try {
    logger.info({ userId, imageUrl }, 'Analyzing food image');
    
    // Send image to OpenAI Vision model for analysis
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-05-13',
      messages: [
        {
          role: 'system',
          content: 'You are a nutrition expert that analyzes food images. Identify all food items visible, estimate portion sizes, and provide detailed nutritional information. Be precise with your estimates and provide confidence levels.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this food image and provide detailed nutritional information.' },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });
    
    // Extract text response
    const analysisText = response.choices[0].message.content;
    
    // Run structured analysis to extract food items
    const structuredAnalysis = await openai.chat.completions.create({
      model: 'gpt-4o-2024-05-13',
      messages: [
        {
          role: 'system',
          content: 'Extract structured nutritional data from the previous analysis. Return a valid JSON object.'
        },
        {
          role: 'user',
          content: `Convert this food analysis into a structured JSON format with food items, portion sizes, and nutritional values:\n\n${analysisText}`
        }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });
    
    const structuredData = JSON.parse(structuredAnalysis.choices[0].message.content);
    
    // Save analysis to database if userId is provided
    if (userId) {
      // Handle database operations here
    }
    
    return {
      analysis: analysisText,
      structuredData
    };
    
  } catch (error) {
    logger.error({ error, imageUrl }, 'Error analyzing food image');
    throw error;
  }
}

/**
 * Provide personalized feedback based on user's nutrition and fitness data
 */
async function provideFeedback(userId) {
  try {
    // Fetch user data with recent logs
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        goals: true,
        nutritionLogs: {
          take: 21, // Last 3 weeks
          orderBy: { date: 'desc' },
        },
        workoutLogs: {
          take: 10,
          orderBy: { date: 'desc' },
        },
        bodyMeasurements: {
          take: 4,
          orderBy: { date: 'desc' },
        },
        sleepLogs: {
          take: 7,
          orderBy: { date: 'desc' },
        },
        waterLogs: {
          take: 7,
          orderBy: { date: 'desc' },
        },
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Process and analyze user data
    const aggregatedData = {
      nutritionAvgs: calculateNutritionAverages(user.nutritionLogs),
      workoutFrequency: user.workoutLogs.length / 2, // per week approximately
      sleepQuality: calculateSleepQuality(user.sleepLogs),
      waterIntake: calculateAverageWaterIntake(user.waterLogs),
      weightTrend: calculateWeightTrend(user.bodyMeasurements),
    };
    
    // Generate insights
    const prompt = `
    Analyze this user's health data and provide personalized feedback:
    
    User Goals: ${JSON.stringify(user.goals)}
    
    Nutrition (weekly averages):
    - Calories: ${aggregatedData.nutritionAvgs.calories} kcal/day
    - Protein: ${aggregatedData.nutritionAvgs.protein}g/day
    - Carbs: ${aggregatedData.nutritionAvgs.carbs}g/day
    - Fat: ${aggregatedData.nutritionAvgs.fat}g/day
    
    Fitness:
    - Workout frequency: ${aggregatedData.workoutFrequency} workouts/week
    - Recent activities: ${user.workoutLogs.map(w => w.workoutType).join(', ')}
    
    Sleep:
    - Average duration: ${aggregatedData.sleepQuality.avgDuration} hours
    - Average quality: ${aggregatedData.sleepQuality.avgQuality}/10
    
    Hydration:
    - Average water intake: ${aggregatedData.waterIntake} ml/day
    
    Body measurements:
    - Weight trend: ${aggregatedData.weightTrend.description}
    - Weight change: ${aggregatedData.weightTrend.change} kg in ${aggregatedData.weightTrend.days} days
    
    Provide actionable feedback in these areas:
    1. Nutrition adjustments
    2. Workout optimization
    3. Recovery strategies
    4. Progress toward goals
    5. Areas for improvement
    
    Format as JSON with the following structure:
    {
      "insights": {
        "nutrition": { "strengths": [], "areas_to_improve": [], "recommendations": [] },
        "fitness": { "strengths": [], "areas_to_improve": [], "recommendations": [] },
        "recovery": { "strengths": [], "areas_to_improve": [], "recommendations": [] },
        "progress": { "status": "", "next_milestone": "", "estimated_timeline": "" }
      },
      "summary": ""
    }
    `;
    
    // Generate feedback using Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      temperature: 0.5,
      system: "You are a certified health coach with expertise in nutrition, fitness, and behavior change. Analyze user data to provide personalized, actionable insights based on their goals and habits. Be encouraging but honest, focusing on sustainable changes.",
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    // Parse the response
    const responseContent = message.content[0].text;
    const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || 
                      responseContent.match(/{[\s\S]*?}/);
                      
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const feedbackData = JSON.parse(jsonMatch[0].replace(/```json\n|```/g, ''));
    
    // Save feedback to notification system
    await prisma.notification.create({
      data: {
        userId,
        title: 'Your Weekly Health Insights',
        message: feedbackData.summary,
        type: 'AI_INSIGHT',
      }
    });
    
    return feedbackData;
    
  } catch (error) {
    logger.error({ error, userId }, 'Error providing feedback');
    throw error;
  }
}

/**
 * Generate personalized insights based on health data
 */
async function getPersonalizedInsights(userId) {
  // Implementation similar to provideFeedback but with deeper analysis
  // Would include trend analysis and predictive elements
}

/**
 * Generate meal suggestions based on available ingredients
 */
async function generateMealSuggestions(ingredients, preferences, userId) {
  // Generate recipes from ingredients list
  // Consider user dietary preferences and restrictions
}

/**
 * Analyze long-term health trends
 */
async function analyzeHealthTrends(userId, dateRange) {
  // Analyze data over longer periods
  // Look for patterns and correlations in health data
}

/**
 * Scan food barcodes for nutritional information
 */
async function scanBarcode(barcodeData) {
  // Query nutrition database for barcode
  // Return structured nutrition information
}

/**
 * AI-powered nutrition chat interface
 */
async function chatWithNutritionistAI(userId, message, conversationHistory = []) {
  // Implementation of conversational AI for nutrition questions
}

// Helper functions for data analysis
function calculateNutritionAverages(nutritionLogs) {
  // Calculate average nutrient intake
  if (!nutritionLogs.length) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }
  
  const totals = nutritionLogs.reduce((acc, log) => {
    return {
      calories: acc.calories + (log.calories || 0),
      protein: acc.protein + (log.protein || 0),
      carbs: acc.carbs + (log.carbohydrates || 0),
      fat: acc.fat + (log.fat || 0),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  return {
    calories: Math.round(totals.calories / nutritionLogs.length),
    protein: Math.round(totals.protein / nutritionLogs.length),
    carbs: Math.round(totals.carbs / nutritionLogs.length),
    fat: Math.round(totals.fat / nutritionLogs.length),
  };
}

function calculateSleepQuality(sleepLogs) {
  if (!sleepLogs.length) {
    return { avgDuration: 0, avgQuality: 0 };
  }
  
  const totals = sleepLogs.reduce((acc, log) => {
    const durationHours = log.totalSleepTime / 60;
    return {
      duration: acc.duration + durationHours,
      quality: acc.quality + (log.sleepQuality || 5),
    };
  }, { duration: 0, quality: 0 });
  
  return {
    avgDuration: (totals.duration / sleepLogs.length).toFixed(1),
    avgQuality: (totals.quality / sleepLogs.length).toFixed(1),
  };
}

function calculateAverageWaterIntake(waterLogs) {
  if (!waterLogs.length) {
    return 0;
  }
  
  const totalAmount = waterLogs.reduce((acc, log) => acc + log.amount, 0);
  return Math.round(totalAmount / waterLogs.length);
}

function calculateWeightTrend(measurements) {
  if (measurements.length < 2) {
    return { description: 'insufficient data', change: 0, days: 0 };
  }
  
  const newest = measurements[0];
  const oldest = measurements[measurements.length - 1];
  
  if (!newest.weight || !oldest.weight) {
    return { description: 'incomplete data', change: 0, days: 0 };
  }
  
  const weightChange = newest.weight - oldest.weight;
  const daysDiff = Math.round((newest.date - oldest.date) / (1000 * 60 * 60 * 24));
  
  let description = 'maintaining';
  if (weightChange > 0.5) description = 'gaining';
  if (weightChange < -0.5) description = 'losing';
  
  return {
    description,
    change: weightChange.toFixed(1),
    days: daysDiff,
  };
} 