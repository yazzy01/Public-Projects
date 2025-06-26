import videoRoutes from './videos.js';
import locationRoutes from './locations.js';
import paymentRoutes from './payments.js';
import authRoutes from './auth.js';

/**
 * Register all API routes with the Fastify instance
 */
export async function registerRoutes(fastify) {
  // Register routes with path prefixes
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(videoRoutes, { prefix: '/fitness' });
  fastify.register(locationRoutes, { prefix: '/locations' });
  fastify.register(paymentRoutes, { prefix: '/payments' });
  
  // API documentation route
  fastify.get('/docs', async (request, reply) => {
    return reply.send({
      version: '1.0.0',
      description: 'NutriStepPro API - Advanced nutrition and fitness tracking',
      endpoints: {
        auth: [
          { method: 'POST', path: '/auth/register', description: 'Register a new user' },
          { method: 'POST', path: '/auth/login', description: 'User login' },
          { method: 'POST', path: '/auth/refresh', description: 'Refresh access token' },
          { method: 'POST', path: '/auth/logout', description: 'User logout' }
        ],
        fitness: [
          { method: 'GET', path: '/fitness/videos', description: 'Get workout videos' },
          { method: 'GET', path: '/fitness/videos/:id', description: 'Get workout video details' },
          { method: 'POST', path: '/fitness/videos/:id/save', description: 'Save workout video' },
          { method: 'DELETE', path: '/fitness/videos/:id/save', description: 'Unsave workout video' },
          { method: 'GET', path: '/fitness/me/saved-videos', description: 'Get user\'s saved videos' },
          { method: 'POST', path: '/fitness/videos/:id/reviews', description: 'Review a workout video' }
        ],
        locations: [
          { method: 'GET', path: '/locations/gyms', description: 'Get list of gyms' },
          { method: 'GET', path: '/locations/gyms/nearby', description: 'Find gyms nearby' },
          { method: 'GET', path: '/locations/gyms/:id', description: 'Get gym details' },
          { method: 'PUT', path: '/locations/me/location', description: 'Update user location' },
          { method: 'GET', path: '/locations/me/location', description: 'Get user location' },
          { method: 'GET', path: '/locations/me/gyms/nearby', description: 'Find gyms near user location' },
          { method: 'POST', path: '/locations/gyms/:id/reviews', description: 'Review a gym' }
        ],
        payments: [
          { method: 'GET', path: '/payments/payment-methods', description: 'Get user payment methods' },
          { method: 'POST', path: '/payments/payment-methods', description: 'Add payment method' },
          { method: 'PUT', path: '/payments/payment-methods/:id/default', description: 'Set default payment method' },
          { method: 'DELETE', path: '/payments/payment-methods/:id', description: 'Delete payment method' },
          { method: 'POST', path: '/payments/process', description: 'Process a payment' },
          { method: 'GET', path: '/payments/transactions', description: 'Get payment transaction history' },
          { method: 'GET', path: '/payments/transactions/:id', description: 'Get transaction details' },
          { method: 'POST', path: '/payments/payment-methods/:id/verify', description: 'Verify payment method' }
        ]
      }
    });
  });
  
  // Default route
  fastify.get('/', async (request, reply) => {
    return reply.send({
      name: 'NutriStepPro API',
      version: '1.0.0',
      description: 'Advanced nutrition and fitness tracking API',
      documentation: '/docs'
    });
  });
} 