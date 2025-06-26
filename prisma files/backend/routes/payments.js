import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { isAuthenticated } from '../plugins/auth.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Validation schemas
const addPaymentMethodSchema = z.object({
  type: z.enum(['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'APPLE_PAY', 'GOOGLE_PAY', 'CRYPTO']),
  
  // Credit card details (required for credit cards)
  cardNumber: z.string().min(13).max(19).optional(),
  cardholderName: z.string().optional(),
  expiryMonth: z.number().int().min(1).max(12).optional(),
  expiryYear: z.number().int().min(new Date().getFullYear() % 100).optional(),
  cvv: z.string().min(3).max(4).optional(),
  
  // PayPal details
  accountEmail: z.string().email().optional(),
  
  // External token from payment provider
  providerToken: z.string().optional(),
  
  // Set as default payment method
  isDefault: z.boolean().optional()
});

const processPaymentSchema = z.object({
  paymentMethodId: z.string(),
  amount: z.number().min(0.01),
  currency: z.string().default('USD'),
  description: z.string().optional(),
  type: z.enum(['ONE_TIME', 'SUBSCRIPTION']),
  
  // Subscription details (if applicable)
  subscriptionPeriod: z.string().optional(),
  subscriptionId: z.string().optional()
});

export default async function paymentRoutes(fastify) {
  // Apply authentication middleware to all routes
  fastify.register(async (instance) => {
    instance.addHook('onRequest', isAuthenticated);
    
    // Get user's payment methods
    instance.get('/payment-methods', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        const paymentMethods = await prisma.paymentMethod.findMany({
          where: { userId },
          orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'desc' }
          ]
        });
        
        return reply.send({
          data: paymentMethods.map(method => ({
            id: method.id,
            type: method.type,
            cardLast4: method.cardLast4,
            cardBrand: method.cardBrand,
            expiryMonth: method.expiryMonth,
            expiryYear: method.expiryYear,
            accountEmail: method.accountEmail,
            isDefault: method.isDefault,
            isVerified: method.isVerified,
            createdAt: method.createdAt
          }))
        });
        
      } catch (error) {
        logger.error(error, 'Error retrieving payment methods');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Add a new payment method
    instance.post('/payment-methods', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        // Validate request body
        const paymentData = addPaymentMethodSchema.parse(request.body);
        
        // Process based on payment method type
        const paymentMethodData = {
          userId,
          type: paymentData.type,
          isDefault: paymentData.isDefault || false,
          isVerified: false,
          providerToken: paymentData.providerToken
        };
        
        // Handle credit card data
        if (paymentData.type === 'CREDIT_CARD') {
          // Validate credit card fields
          if (!paymentData.cardNumber || !paymentData.expiryMonth || !paymentData.expiryYear || !paymentData.cvv) {
            return reply.code(400).send({ error: 'Card details are required for credit card payment method' });
          }
          
          // Extract and store only the last 4 digits
          paymentMethodData.cardLast4 = paymentData.cardNumber.slice(-4);
          
          // Determine card brand (simplified version)
          const firstDigit = paymentData.cardNumber.charAt(0);
          const firstTwoDigits = parseInt(paymentData.cardNumber.substring(0, 2));
          
          if (firstDigit === '4') {
            paymentMethodData.cardBrand = 'Visa';
          } else if (firstTwoDigits >= 51 && firstTwoDigits <= 55) {
            paymentMethodData.cardBrand = 'Mastercard';
          } else if (firstTwoDigits === 34 || firstTwoDigits === 37) {
            paymentMethodData.cardBrand = 'American Express';
          } else if (firstTwoDigits === 62) {
            paymentMethodData.cardBrand = 'UnionPay';
          } else {
            paymentMethodData.cardBrand = 'Other';
          }
          
          paymentMethodData.expiryMonth = paymentData.expiryMonth;
          paymentMethodData.expiryYear = paymentData.expiryYear;
        }
        
        // Handle PayPal
        if (paymentData.type === 'PAYPAL') {
          if (!paymentData.accountEmail) {
            return reply.code(400).send({ error: 'Account email is required for PayPal payment method' });
          }
          
          paymentMethodData.accountEmail = paymentData.accountEmail;
        }
        
        // If this is the first payment method or setting as default
        if (paymentData.isDefault) {
          // Reset any existing default payment methods
          await prisma.paymentMethod.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false }
          });
        } else {
          // Check if this is the first payment method
          const count = await prisma.paymentMethod.count({ where: { userId } });
          if (count === 0) {
            paymentMethodData.isDefault = true;
          }
        }
        
        // Create payment method
        const paymentMethod = await prisma.paymentMethod.create({
          data: paymentMethodData
        });
        
        // Remove sensitive data before returning
        const { providerToken, ...result } = paymentMethod;
        
        return reply.code(201).send(result);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error adding payment method');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Set payment method as default
    instance.put('/payment-methods/:id/default', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Check if payment method exists and belongs to user
        const paymentMethod = await prisma.paymentMethod.findFirst({
          where: { id, userId }
        });
        
        if (!paymentMethod) {
          return reply.code(404).send({ error: 'Payment method not found' });
        }
        
        // Already default
        if (paymentMethod.isDefault) {
          return reply.send(paymentMethod);
        }
        
        // Reset any existing default payment methods
        await prisma.paymentMethod.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false }
        });
        
        // Set the new default
        const updated = await prisma.paymentMethod.update({
          where: { id },
          data: { isDefault: true }
        });
        
        return reply.send(updated);
        
      } catch (error) {
        logger.error(error, 'Error setting default payment method');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Delete payment method
    instance.delete('/payment-methods/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Check if payment method exists and belongs to user
        const paymentMethod = await prisma.paymentMethod.findFirst({
          where: { id, userId }
        });
        
        if (!paymentMethod) {
          return reply.code(404).send({ error: 'Payment method not found' });
        }
        
        // Delete the payment method
        await prisma.paymentMethod.delete({
          where: { id }
        });
        
        // If it was the default, set a new default if available
        if (paymentMethod.isDefault) {
          const nextPaymentMethod = await prisma.paymentMethod.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' }
          });
          
          if (nextPaymentMethod) {
            await prisma.paymentMethod.update({
              where: { id: nextPaymentMethod.id },
              data: { isDefault: true }
            });
          }
        }
        
        return reply.send({ success: true });
        
      } catch (error) {
        logger.error(error, 'Error deleting payment method');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Process a payment
    instance.post('/process', async (request, reply) => {
      try {
        const userId = request.user.id;
        
        // Validate request body
        const paymentData = processPaymentSchema.parse(request.body);
        
        // Check if payment method exists and belongs to user
        const paymentMethod = await prisma.paymentMethod.findFirst({
          where: { 
            id: paymentData.paymentMethodId,
            userId
          }
        });
        
        if (!paymentMethod) {
          return reply.code(404).send({ error: 'Payment method not found' });
        }
        
        // Check if payment method is verified
        if (!paymentMethod.isVerified) {
          return reply.code(400).send({ error: 'Payment method is not verified' });
        }
        
        // In a real implementation, this would integrate with a payment gateway
        // For demonstration, we'll simulate payment processing
        
        // Generate a unique external ID
        const externalId = `tx_${crypto.randomBytes(8).toString('hex')}`;
        
        // Create payment transaction
        const transaction = await prisma.paymentTransaction.create({
          data: {
            userId,
            paymentMethodId: paymentMethod.id,
            amount: paymentData.amount,
            currency: paymentData.currency,
            status: 'COMPLETED', // In real implementation this would initially be PENDING
            description: paymentData.description,
            type: paymentData.type,
            externalId,
            providerName: 'MockPaymentProvider',
            subscriptionId: paymentData.subscriptionId,
            subscriptionPeriod: paymentData.subscriptionPeriod
          }
        });
        
        return reply.code(201).send({
          ...transaction,
          message: 'Payment processed successfully'
        });
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Validation error', details: error.format() });
        }
        
        logger.error(error, 'Error processing payment');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get payment transaction history
    instance.get('/transactions', async (request, reply) => {
      try {
        const userId = request.user.id;
        const { limit = 20, offset = 0, status, type } = request.query;
        
        // Build filter
        const filter = { userId };
        
        if (status) {
          filter.status = status;
        }
        
        if (type) {
          filter.type = type;
        }
        
        // Query transactions with pagination
        const [transactions, total] = await Promise.all([
          prisma.paymentTransaction.findMany({
            where: filter,
            orderBy: { createdAt: 'desc' },
            skip: parseInt(offset),
            take: parseInt(limit),
            include: {
              paymentMethod: {
                select: {
                  type: true,
                  cardLast4: true,
                  cardBrand: true,
                  accountEmail: true
                }
              }
            }
          }),
          prisma.paymentTransaction.count({ where: filter })
        ]);
        
        return reply.send({
          data: transactions,
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + transactions.length < total
          }
        });
        
      } catch (error) {
        logger.error(error, 'Error retrieving transactions');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Get transaction details
    instance.get('/transactions/:id', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        const transaction = await prisma.paymentTransaction.findFirst({
          where: { id, userId },
          include: {
            paymentMethod: {
              select: {
                type: true,
                cardLast4: true,
                cardBrand: true,
                accountEmail: true
              }
            }
          }
        });
        
        if (!transaction) {
          return reply.code(404).send({ error: 'Transaction not found' });
        }
        
        return reply.send(transaction);
        
      } catch (error) {
        logger.error(error, 'Error retrieving transaction');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
    
    // Verify a payment method (simulated in this implementation)
    instance.post('/payment-methods/:id/verify', async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;
        
        // Check if payment method exists and belongs to user
        const paymentMethod = await prisma.paymentMethod.findFirst({
          where: { id, userId }
        });
        
        if (!paymentMethod) {
          return reply.code(404).send({ error: 'Payment method not found' });
        }
        
        // In a real implementation, this would verify card with a small charge
        // or other verification method depending on the payment type
        
        // Update payment method to verified
        const updated = await prisma.paymentMethod.update({
          where: { id },
          data: { isVerified: true }
        });
        
        return reply.send({
          ...updated,
          message: 'Payment method successfully verified'
        });
        
      } catch (error) {
        logger.error(error, 'Error verifying payment method');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });
  });
} 