import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { isAuthenticated } from '../plugins/auth.js';

const prisma = new PrismaClient();

// Validation schemas
const createVideoSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  duration: z.number().int().positive(), // in seconds
  category: z.enum([
    'STRENGTH_TRAINING', 'CARDIO', 'HIIT', 'YOGA', 'PILATES', 'ZUMBA',
    'BELLY_DANCE', 'ORIENTAL_DANCE', 'COMBAT', 'HYBRID', 'WEIGHT_LOSS',
    'MUSCLE_BUILDING', 'FLEXIBILITY', 'OTHER'
  ]),
  workoutType: z.enum([
    'STRENGTH', 'CARDIO', 'FLEXIBILITY', 'HIIT', 'YOGA', 'PILATES', 'SPORTS', 'OTHER'
  ]),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']),
  instructor: z.string(),
  targetGender: z.enum(['MALE', 'FEMALE', 'ALL']).optional(),
  equipment: z.array(z.string()).optional(),
  caloriesBurn: z.number().int().positive().optional(),
  muscleGroups: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
});

const reviewVideoSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

export default async function videoRoutes(fastify) {
  // Get all workout videos with filtering
  fastify.get('/videos', async (request, reply) => {
    try {
      const {
        category,
        workoutType,
        difficulty,
        duration,
        targetGender,
        equipment,
        search,
        limit = 20,
        offset = 0,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = request.query;
      
      // Build filter
      const filter = {};
      
      if (category) {
        filter.category = category;
      }
      
      if (workoutType) {
        filter.workoutType = workoutType;
      }
      
      if (difficulty) {
        filter.difficulty = difficulty;
      }
      
      if (targetGender) {
        filter.targetGender = targetGender;
      }
      
      if (duration) {
        const [minDuration, maxDuration] = duration.split('-').map(Number);
        filter.duration = {
          gte: minDuration || 0,
          lte: maxDuration || 9999
        };
      }
      
      if (equipment) {
        filter.equipment = { has: equipment };
      }
      
      if (search) {
        filter.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } }
        ];
      }
      
      // Query videos with pagination
      const [videos, total] = await Promise.all([
        prisma.workoutVideo.findMany({
          where: filter,
          orderBy: { [sortBy]: sortOrder },
          skip: parseInt(offset),
          take: parseInt(limit),
          include: {
            reviews: {
              take: 3,
              orderBy: { createdAt: 'desc' },
              include: { user: { select: { username: true, profileImage: true } } }
            }
          }
        }),
        prisma.workoutVideo.count({ where: filter })
      ]);
      
      return reply.send({
        data: videos,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + videos.length < total
        }
      });
      
    } catch (error) {
      logger.error(error, 'Error retrieving workout videos');
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  // Get video by ID
  fastify.get('/videos/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const video = await prisma.workoutVideo.findUnique({
        where: { id },
        include: {
          reviews: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { username: true, profileImage: true } } }
          }
        }
      });
      
      if (!video) {
        return reply.code(404).send({ error: 'Video not found' });
      }
      
      // Increment view count
      await prisma.workoutVideo.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      });
      
      return reply.send(video);
      
    } catch (error) {
      logger.error(error, 'Error retrieving workout video');
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  // Admin routes
  fastify.register(async (instance) => {
    // Apply authentication middleware
    instance.addHook('onRequest', isAuthenticated);
    instance.addHook('onRequest', (request, reply, done) => {
      if (request.user.role !== 'ADMIN') {
        return reply.code(403).send({ error: 'Forbidden' });
      }
      done();
    });
    
    // Create workout video (admin only)
    instance.post('/videos', async (request, reply) => {
      try {
        // Validate request body
        const videoData = createVideoSchema.parse(request.body);
        
        // Create video
        const video = await prisma.workoutVideo.create({
          data: videoData
        });
        
        return reply.code(201).send(video);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error creating workout video');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Update workout video (admin only)
    instance.put('/videos/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        
        // Validate request body
        const videoData = createVideoSchema.parse(request.body);
        
        // Update video
        const video = await prisma.workoutVideo.update({
          where: { id },
          data: videoData
        });
        
        return reply.send(video);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error updating workout video');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Delete workout video (admin only)
    instance.delete('/videos/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        
        await prisma.workoutVideo.delete({
          where: { id }
        });
        
        return reply.send({ success: true });
        
      } catch (error) {
        logger.error(error, 'Error deleting workout video');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
  });
  
  // User actions for videos (requires authentication)
  fastify.register(async (instance) => {
    // Apply authentication middleware
    instance.addHook('onRequest', isAuthenticated);
    
    // Save video to user's library
    instance.post('/videos/:id/save', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Check if video exists
        const video = await prisma.workoutVideo.findUnique({
          where: { id }
        });
        
        if (!video) {
          return reply.code(404).send({ error: 'Video not found' });
        }
        
        // Check if already saved
        const existingSave = await prisma.savedWorkoutVideo.findFirst({
          where: {
            userId,
            videoId: id
          }
        });
        
        if (existingSave) {
          return reply.code(400).send({ error: 'Video already saved' });
        }
        
        // Save video
        await prisma.savedWorkoutVideo.create({
          data: {
            userId,
            videoId: id
          }
        });
        
        return reply.code(201).send({ success: true });
        
      } catch (error) {
        logger.error(error, 'Error saving workout video');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Unsave video
    instance.delete('/videos/:id/save', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Find the saved video record
        const savedVideo = await prisma.savedWorkoutVideo.findFirst({
          where: {
            userId,
            videoId: id
          }
        });
        
        if (!savedVideo) {
          return reply.code(404).send({ error: 'Saved video not found' });
        }
        
        // Delete the saved video record
        await prisma.savedWorkoutVideo.delete({
          where: { id: savedVideo.id }
        });
        
        return reply.send({ success: true });
        
      } catch (error) {
        logger.error(error, 'Error unsaving workout video');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get user's saved videos
    instance.get('/me/saved-videos', async (request, reply) => {
      try {
        const userId = request.user.id;
        const { limit = 20, offset = 0 } = request.query;
        
        const [savedVideos, total] = await Promise.all([
          prisma.savedWorkoutVideo.findMany({
            where: { userId },
            orderBy: { savedAt: 'desc' },
            skip: parseInt(offset),
            take: parseInt(limit),
            include: { video: true }
          }),
          prisma.savedWorkoutVideo.count({ where: { userId } })
        ]);
        
        return reply.send({
          data: savedVideos.map(sv => ({
            ...sv.video,
            savedAt: sv.savedAt
          })),
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + savedVideos.length < total
          }
        });
        
      } catch (error) {
        logger.error(error, 'Error retrieving saved videos');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Review a video
    instance.post('/videos/:id/reviews', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Validate request body
        const reviewData = reviewVideoSchema.parse(request.body);
        
        // Check if video exists
        const video = await prisma.workoutVideo.findUnique({
          where: { id }
        });
        
        if (!video) {
          return reply.code(404).send({ error: 'Video not found' });
        }
        
        // Check if user already reviewed this video
        const existingReview = await prisma.review.findFirst({
          where: {
            userId,
            workoutVideoId: id
          }
        });
        
        if (existingReview) {
          // Update existing review
          const updatedReview = await prisma.review.update({
            where: { id: existingReview.id },
            data: reviewData,
            include: { user: { select: { username: true, profileImage: true } } }
          });
          
          // Update video rating
          await updateVideoRating(id);
          
          return reply.send(updatedReview);
        }
        
        // Create new review
        const review = await prisma.review.create({
          data: {
            ...reviewData,
            userId,
            workoutVideoId: id
          },
          include: { user: { select: { username: true, profileImage: true } } }
        });
        
        // Update video rating
        await updateVideoRating(id);
        
        return reply.code(201).send(review);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error reviewing workout video');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Delete a review
    instance.delete('/videos/:videoId/reviews/:reviewId', async (request, reply) => {
      try {
        const { videoId, reviewId } = request.params;
        const userId = request.user.id;
        
        // Find the review
        const review = await prisma.review.findUnique({
          where: { id: reviewId }
        });
        
        if (!review || review.workoutVideoId !== videoId) {
          return reply.code(404).send({ error: 'Review not found' });
        }
        
        // Check if the review belongs to the user or user is admin
        if (review.userId !== userId && request.user.role !== 'ADMIN') {
          return reply.code(403).send({ error: 'Forbidden' });
        }
        
        // Delete the review
        await prisma.review.delete({
          where: { id: reviewId }
        });
        
        // Update video rating
        await updateVideoRating(videoId);
        
        return reply.send({ success: true });
        
      } catch (error) {
        logger.error(error, 'Error deleting review');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
  });
  
  // Helper function to update video rating
  async function updateVideoRating(videoId) {
    const reviews = await prisma.review.findMany({
      where: { workoutVideoId: videoId }
    });
    
    if (reviews.length === 0) {
      await prisma.workoutVideo.update({
        where: { id: videoId },
        data: { rating: 0 }
      });
      return;
    }
    
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await prisma.workoutVideo.update({
      where: { id: videoId },
      data: { rating: avgRating }
    });
  }
} 