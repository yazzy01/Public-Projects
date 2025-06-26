import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.string().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
  preferredUnits: z.enum(['METRIC', 'IMPERIAL']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export default async function authRoutes(fastify) {
  // Register a new user
  fastify.post('/register', async (request, reply) => {
    try {
      // Validate request data
      const userData = registerSchema.parse(request.body);
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      
      if (existingUser) {
        return reply.code(409).send({ error: 'User with this email already exists' });
      }

      // Check if username is taken (if provided)
      if (userData.username) {
        const existingUsername = await prisma.user.findUnique({
          where: { username: userData.username },
        });
        
        if (existingUsername) {
          return reply.code(409).send({ error: 'Username is already taken' });
        }
      }
      
      // Hash password
      const hashedPassword = await fastify.auth.hashPassword(userData.password);
      
      // Create the user
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          // Convert string date to Date object if provided
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined,
          // Default arrays to empty if not provided
          dietaryPreferences: userData.dietaryPreferences || [],
          allergies: userData.allergies || [],
          medicalConditions: userData.medicalConditions || [],
        },
      });
      
      // Generate authentication tokens
      const tokens = await fastify.auth.generateTokens(user);
      
      // Update last login time
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoggedIn: new Date(),
          loginCount: 1,
        },
      });
      
      // Return user data and tokens
      return reply.code(201).send({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          preferredUnits: user.preferredUnits,
        },
        ...tokens,
      });
      
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.format() });
      }
      
      logger.error(error, 'Error registering user');
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  // Login
  fastify.post('/login', async (request, reply) => {
    try {
      // Validate request data
      const loginData = loginSchema.parse(request.body);
      
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: loginData.email },
      });
      
      if (!user) {
        return reply.code(401).send({ error: 'Invalid email or password' });
      }
      
      // Verify password
      const passwordValid = await fastify.auth.comparePassword(loginData.password, user.password);
      
      if (!passwordValid) {
        return reply.code(401).send({ error: 'Invalid email or password' });
      }
      
      // Generate authentication tokens
      const tokens = await fastify.auth.generateTokens(user);
      
      // Update login statistics
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoggedIn: new Date(),
          loginCount: { increment: 1 },
        },
      });
      
      // Return user data and tokens
      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          preferredUnits: user.preferredUnits,
        },
        ...tokens,
      });
      
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.format() });
      }
      
      logger.error(error, 'Error logging in user');
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  // Refresh token
  fastify.post('/refresh', async (request, reply) => {
    try {
      // Validate request data
      const { refreshToken } = refreshTokenSchema.parse(request.body);
      
      // Verify and get new tokens
      const tokens = await fastify.auth.verifyRefreshToken(refreshToken);
      
      return reply.send(tokens);
      
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.format() });
      }
      
      logger.error(error, 'Error refreshing token');
      return reply.code(401).send({ error: 'Invalid refresh token' });
    }
  });
  
  // Logout
  fastify.post('/logout', async (request, reply) => {
    try {
      const { refreshToken } = refreshTokenSchema.parse(request.body);
      
      // Delete the refresh token
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
      
      return reply.send({ success: true, message: 'Logged out successfully' });
      
    } catch (error) {
      // For logout, we'll return success even if there was an error
      // This ensures the client still considers the user logged out
      return reply.send({ success: true, message: 'Logged out successfully' });
    }
  });
  
  // Get current user (requires authentication)
  fastify.get('/me', { onRequest: [fastify.auth.isAuthenticated] }, async (request, reply) => {
    try {
      const userId = request.user.id;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          profileImage: true,
          height: true,
          weight: true,
          role: true,
          preferredUnits: true,
          dietaryPreferences: true,
          allergies: true,
          medicalConditions: true,
          createdAt: true
        }
      });
      
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      
      return reply.send({ user });
      
    } catch (error) {
      logger.error(error, 'Error getting current user');
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  // Change password
  fastify.post('/change-password', { onRequest: [fastify.auth.isAuthenticated] }, async (request, reply) => {
    try {
      const userId = request.user.id;
      
      const schema = z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8),
      });
      
      const { currentPassword, newPassword } = schema.parse(request.body);
      
      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      
      // Verify current password
      const passwordValid = await fastify.auth.comparePassword(currentPassword, user.password);
      
      if (!passwordValid) {
        return reply.code(401).send({ error: 'Current password is incorrect' });
      }
      
      // Hash new password
      const hashedPassword = await fastify.auth.hashPassword(newPassword);
      
      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      
      // Invalidate all refresh tokens
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
      
      return reply.send({ success: true, message: 'Password changed successfully' });
      
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.format() });
      }
      
      logger.error(error, 'Error changing password');
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
} 