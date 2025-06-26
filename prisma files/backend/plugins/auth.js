import fp from 'fastify-plugin';
import { SignJWT, jwtVerify } from 'jose';
import { randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// Secret keys should be loaded from environment variables
const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default_jwt_secret_change_this');
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_this');

export const auth = fp(async function (fastify) {
  // Register decorator to access authentication utilities
  fastify.decorate('auth', {
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken,
    hashPassword,
    comparePassword,
  });

  // Add hook to parse authorization header
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      
      if (!authHeader) {
        request.user = null;
        return;
      }
      
      const token = authHeader.replace('Bearer ', '');
      
      try {
        // Verify and decode JWT token
        const { payload } = await jwtVerify(token, ACCESS_SECRET);
        request.user = { id: payload.sub, role: payload.role };
      } catch (tokenError) {
        request.user = null;
      }
    } catch (error) {
      logger.error(error, 'Error in auth hook');
      request.user = null;
    }
  });
});

// Middleware to check if user is authenticated
export function isAuthenticated(request, reply, done) {
  if (!request.user) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  done();
}

// Middleware to check if user has required role
export function hasRole(role) {
  return function (request, reply, done) {
    if (!request.user) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    
    if (request.user.role !== role && request.user.role !== 'ADMIN') {
      return reply.code(403).send({ error: 'Forbidden' });
    }
    
    done();
  };
}

/**
 * Generate access and refresh tokens for a user
 */
async function generateTokens(user) {
  try {
    // Generate access token
    const accessToken = await new SignJWT({ role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || '1h')
      .sign(ACCESS_SECRET);
    
    // Generate refresh token
    const refreshTokenValue = randomBytes(64).toString('hex');
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + (parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS) || 30));
    
    // Store refresh token in database
    const refreshToken = await prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: refreshExpiry,
      },
    });
    
    return {
      accessToken,
      refreshToken: refreshToken.token,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      refreshExpiresAt: refreshToken.expiresAt,
    };
  } catch (error) {
    logger.error(error, 'Error generating tokens');
    throw new Error('Failed to generate authentication tokens');
  }
}

/**
 * Verify an access token
 */
async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return { id: payload.sub, role: payload.role };
  } catch (error) {
    logger.error(error, 'Error verifying access token');
    throw new Error('Invalid access token');
  }
}

/**
 * Verify a refresh token and issue new tokens
 */
async function verifyRefreshToken(refreshToken) {
  try {
    // Find the refresh token in the database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    
    if (!tokenRecord) {
      throw new Error('Invalid refresh token');
    }
    
    if (tokenRecord.expiresAt < new Date()) {
      // Delete expired token
      await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      throw new Error('Refresh token expired');
    }
    
    // Delete the used refresh token (one-time use)
    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    
    // Generate new tokens
    return generateTokens(tokenRecord.user);
  } catch (error) {
    logger.error(error, 'Error verifying refresh token');
    throw new Error('Invalid refresh token');
  }
}

/**
 * Hash a password using bcrypt
 */
async function hashPassword(password) {
  const bcrypt = await import('bcrypt');
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a password with a hashed password
 */
async function comparePassword(password, hashedPassword) {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(password, hashedPassword);
} 