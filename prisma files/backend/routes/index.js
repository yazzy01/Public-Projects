import nutritionRoutes from './nutrition.js';
import fitnessRoutes from './fitness.js';
import userRoutes from './user.js';
import authRoutes from './auth.js';
import videoRoutes from './videos.js';
import locationRoutes from './locations.js';
import paymentRoutes from './payments.js';

/**
 * Register all API routes with the Fastify instance
 */
export async function registerRoutes(fastify) {
  // Register routes with path prefixes
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(nutritionRoutes, { prefix: '/nutrition' });
  fastify.register(fitnessRoutes, { prefix: '/fitness' });
  fastify.register(userRoutes, { prefix: '/user' });
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
        nutrition: [
          { method: 'GET', path: '/nutrition/logs', description: 'Get user\'s nutrition logs' },
          { method: 'POST', path: '/nutrition/logs', description: 'Create a nutrition log' },
          { method: 'GET', path: '/nutrition/logs/:id', description: 'Get a specific nutrition log' },
          { method: 'PUT', path: '/nutrition/logs/:id', description: 'Update a nutrition log' },
          { method: 'DELETE', path: '/nutrition/logs/:id', description: 'Delete a nutrition log' },
          { method: 'GET', path: '/nutrition/stats', description: 'Get nutrition statistics' },
          { method: 'POST', path: '/nutrition/plans/generate', description: 'Generate AI nutrition plan' },
          { method: 'GET', path: '/nutrition/plans', description: 'Get user\'s nutrition plans' },
          { method: 'GET', path: '/nutrition/plans/:id', description: 'Get a specific nutrition plan' },
          { method: 'DELETE', path: '/nutrition/plans/:id', description: 'Delete a nutrition plan' },
          { method: 'GET', path: '/nutrition/foods/search', description: 'Search food database' },
          { method: 'POST', path: '/nutrition/analyze/image', description: 'Analyze food image' },
          { method: 'GET', path: '/nutrition/insights/realtime', description: 'WebSocket for real-time insights' }
        ],
        fitness: [
          { method: 'GET', path: '/fitness/logs', description: 'Get user\'s workout logs' },
          { method: 'POST', path: '/fitness/logs', description: 'Create a workout log' },
          { method: 'GET', path: '/fitness/logs/:id', description: 'Get a specific workout log' },
          { method: 'PUT', path: '/fitness/logs/:id', description: 'Update a workout log' },
          { method: 'DELETE', path: '/fitness/logs/:id', description: 'Delete a workout log' },
          { method: 'GET', path: '/fitness/stats', description: 'Get fitness statistics' },
          { method: 'POST', path: '/fitness/plans/generate', description: 'Generate AI workout plan' },
          { method: 'GET', path: '/fitness/plans', description: 'Get user\'s workout plans' },
          { method: 'GET', path: '/fitness/plans/:id', description: 'Get a specific workout plan' },
          { method: 'DELETE', path: '/fitness/plans/:id', description: 'Delete a workout plan' },
          { method: 'GET', path: '/fitness/videos', description: 'Get workout videos' },
          { method: 'GET', path: '/fitness/videos/:id', description: 'Get workout video details' },
          { method: 'POST', path: '/fitness/videos/:id/save', description: 'Save workout video' },
          { method: 'DELETE', path: '/fitness/videos/:id/save', description: 'Unsave workout video' },
          { method: 'GET', path: '/fitness/me/saved-videos', description: 'Get user\'s saved videos' },
          { method: 'POST', path: '/fitness/videos/:id/reviews', description: 'Review a workout video' }
        ],
        user: [
          { method: 'GET', path: '/user/profile', description: 'Get user profile' },
          { method: 'PUT', path: '/user/profile', description: 'Update user profile' },
          { method: 'GET', path: '/user/goals', description: 'Get user goals' },
          { method: 'POST', path: '/user/goals', description: 'Create a goal' },
          { method: 'PUT', path: '/user/goals/:id', description: 'Update a goal' },
          { method: 'DELETE', path: '/user/goals/:id', description: 'Delete a goal' },
          { method: 'GET', path: '/user/measurements', description: 'Get body measurements' },
          { method: 'POST', path: '/user/measurements', description: 'Add body measurement' },
          { method: 'GET', path: '/user/devices', description: 'Get connected devices' },
          { method: 'POST', path: '/user/devices', description: 'Connect a new device' },
          { method: 'DELETE', path: '/user/devices/:id', description: 'Disconnect a device' }
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