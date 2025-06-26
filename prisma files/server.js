import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import rateLimit from '@fastify/rate-limit';
import { Redis } from 'ioredis';
import { auth } from './plugins/auth.js';
import { logger } from './utils/logger.js';
import { registerRoutes } from './routes/index.js';

// Create Fastify instance with custom logging
const fastify = Fastify({
  logger,
  trustProxy: true,
  disableRequestLogging: process.env.NODE_ENV === 'production'
});

// Register plugins
async function setupServer() {
  try {
    // Initialize Redis for caching and session management
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      enableAutoPipelining: true
    });
    fastify.decorate('redis', redis);
    
    // Register security and utility plugins
    await fastify.register(cors, {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') 
        : true,
      credentials: true
    });
    
    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute',
      redis: redis,
      keyGenerator: (request) => {
        return request.headers['x-forwarded-for'] || request.ip;
      }
    });
    
    await fastify.register(websocket, {
      options: { maxPayload: 1048576 }
    });
    
    // Authentication plugin
    await fastify.register(auth);
    
    // Register all route handlers
    await registerRoutes(fastify);

    // Health check route
    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });
    
    // Start the server
    await fastify.listen({ 
      port: process.env.PORT || 3000, 
      host: process.env.HOST || '0.0.0.0' 
    });
    
    console.log(`🚀 Server ready at http://${process.env.HOST || '0.0.0.0'}:${process.env.PORT || 3000}`);
    
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

// Handle graceful shutdown
const shutdownGracefully = async () => {
  console.log('Shutting down gracefully...');
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', shutdownGracefully);
process.on('SIGTERM', shutdownGracefully);

// Start server
setupServer(); 