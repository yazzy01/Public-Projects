import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { isAuthenticated } from '../plugins/auth.js';

const prisma = new PrismaClient();

// Validation schemas
const createGymSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string(),
  city: z.string(),
  state: z.string().optional(),
  country: z.string(),
  zipCode: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  classes: z.array(z.string()).optional(),
  operatingHours: z.any().optional(),
  membershipOptions: z.any().optional(),
  photos: z.array(z.string()).optional(),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional()
});

const updateUserLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional()
});

const reviewGymSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

export default async function locationRoutes(fastify) {
  // Get all gyms with filtering
  fastify.get('/gyms', async (request, reply) => {
    try {
      const {
        city,
        amenities,
        classes,
        search,
        limit = 20,
        offset = 0,
        sortBy = 'name',
        sortOrder = 'asc'
      } = request.query;
      
      // Build filter
      const filter = {};
      
      if (city) {
        filter.city = { equals: city, mode: 'insensitive' };
      }
      
      if (amenities) {
        filter.amenities = { has: amenities };
      }
      
      if (classes) {
        filter.classes = { has: classes };
      }
      
      if (search) {
        filter.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      // Query gyms with pagination
      const [gyms, total] = await Promise.all([
        prisma.gymLocation.findMany({
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
        prisma.gymLocation.count({ where: filter })
      ]);
      
      return reply.send({
        data: gyms,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + gyms.length < total
        }
      });
      
    } catch (error) {
      logger.error(error, 'Error retrieving gyms');
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  // Find gyms nearby
  fastify.get('/gyms/nearby', async (request, reply) => {
    try {
      const {
        latitude,
        longitude,
        radius = 10, // default 10km
        limit = 20
      } = request.query;
      
      // Validate input
      if (!latitude || !longitude) {
        return reply.code(400).send({ error: 'Latitude and longitude are required' });
      }
      
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const rad = parseFloat(radius);
      
      // Get all gyms (for small datasets this is fine, for larger we'd use geospatial queries)
      const allGyms = await prisma.gymLocation.findMany({
        include: {
          reviews: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { username: true, profileImage: true } } }
          }
        }
      });
      
      // Calculate distances and filter by radius
      const nearbyGyms = allGyms
        .map(gym => ({
          ...gym,
          distance: calculateDistance(lat, lng, gym.latitude, gym.longitude)
        }))
        .filter(gym => gym.distance <= rad)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, parseInt(limit));
      
      return reply.send({
        data: nearbyGyms,
        count: nearbyGyms.length
      });
      
    } catch (error) {
      logger.error(error, 'Error finding nearby gyms');
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  // Get gym by ID
  fastify.get('/gyms/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const gym = await prisma.gymLocation.findUnique({
        where: { id },
        include: {
          reviews: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { username: true, profileImage: true } } }
          }
        }
      });
      
      if (!gym) {
        return reply.code(404).send({ error: 'Gym not found' });
      }
      
      return reply.send(gym);
      
    } catch (error) {
      logger.error(error, 'Error retrieving gym');
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
    
    // Create gym (admin only)
    instance.post('/gyms', async (request, reply) => {
      try {
        // Validate request body
        const gymData = createGymSchema.parse(request.body);
        
        // Create gym
        const gym = await prisma.gymLocation.create({
          data: gymData
        });
        
        return reply.code(201).send(gym);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error creating gym');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Update gym (admin only)
    instance.put('/gyms/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        
        // Validate request body
        const gymData = createGymSchema.parse(request.body);
        
        // Update gym
        const gym = await prisma.gymLocation.update({
          where: { id },
          data: gymData
        });
        
        return reply.send(gym);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error updating gym');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Delete gym (admin only)
    instance.delete('/gyms/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        
        await prisma.gymLocation.delete({
          where: { id }
        });
        
        return reply.send({ success: true });
        
      } catch (error) {
        logger.error(error, 'Error deleting gym');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
  });
  
  // User authenticated routes
  fastify.register(async (instance) => {
    // Apply authentication middleware
    instance.addHook('onRequest', isAuthenticated);
    
    // Update user location
    instance.put('/me/location', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        // Validate request body
        const locationData = updateUserLocationSchema.parse(request.body);
        
        // Check if user already has a location
        const existingLocation = await prisma.location.findUnique({
          where: { userId }
        });
        
        let location;
        
        if (existingLocation) {
          // Update existing location
          location = await prisma.location.update({
            where: { userId },
            data: locationData
          });
        } else {
          // Create new location
          location = await prisma.location.create({
            data: {
              ...locationData,
              userId
            }
          });
        }
        
        return reply.send(location);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error updating user location');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get user location
    instance.get('/me/location', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        const location = await prisma.location.findUnique({
          where: { userId }
        });
        
        if (!location) {
          return reply.code(404).send({ error: 'Location not found' });
        }
        
        return reply.send(location);
        
      } catch (error) {
        logger.error(error, 'Error retrieving user location');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Find gyms near user's saved location
    instance.get('/me/gyms/nearby', async (request, reply) => {
      try {
        const userId = request.user.id;
        const { radius = 10, limit = 20 } = request.query;
        
        // Get user's location
        const location = await prisma.location.findUnique({
          where: { userId }
        });
        
        if (!location) {
          return reply.code(404).send({ error: 'User location not found. Please set your location first.' });
        }
        
        // Get all gyms
        const allGyms = await prisma.gymLocation.findMany({
          include: {
            reviews: {
              take: 3,
              orderBy: { createdAt: 'desc' },
              include: { user: { select: { username: true, profileImage: true } } }
            }
          }
        });
        
        // Calculate distances and filter by radius
        const nearbyGyms = allGyms
          .map(gym => ({
            ...gym,
            distance: calculateDistance(location.latitude, location.longitude, gym.latitude, gym.longitude)
          }))
          .filter(gym => gym.distance <= parseFloat(radius))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, parseInt(limit));
        
        return reply.send({
          data: nearbyGyms,
          count: nearbyGyms.length
        });
        
      } catch (error) {
        logger.error(error, 'Error finding nearby gyms for user');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Review a gym
    instance.post('/gyms/:id/reviews', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Validate request body
        const reviewData = reviewGymSchema.parse(request.body);
        
        // Check if gym exists
        const gym = await prisma.gymLocation.findUnique({
          where: { id }
        });
        
        if (!gym) {
          return reply.code(404).send({ error: 'Gym not found' });
        }
        
        // Check if user already reviewed this gym
        const existingReview = await prisma.review.findFirst({
          where: {
            userId,
            gymLocationId: id
          }
        });
        
        if (existingReview) {
          // Update existing review
          const updatedReview = await prisma.review.update({
            where: { id: existingReview.id },
            data: reviewData,
            include: { user: { select: { username: true, profileImage: true } } }
          });
          
          return reply.send(updatedReview);
        }
        
        // Create new review
        const review = await prisma.review.create({
          data: {
            ...reviewData,
            userId,
            gymLocationId: id
          },
          include: { user: { select: { username: true, profileImage: true } } }
        });
        
        return reply.code(201).send(review);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error reviewing gym');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Delete a review
    instance.delete('/gyms/:gymId/reviews/:reviewId', async (request, reply) => {
      try {
        const { gymId, reviewId } = request.params;
        const userId = request.user.id;
        
        // Find the review
        const review = await prisma.review.findUnique({
          where: { id: reviewId }
        });
        
        if (!review || review.gymLocationId !== gymId) {
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
        
        return reply.send({ success: true });
        
      } catch (error) {
        logger.error(error, 'Error deleting review');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
  });
}

// Helper function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
} 