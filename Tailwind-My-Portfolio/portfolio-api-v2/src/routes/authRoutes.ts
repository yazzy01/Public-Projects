import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const validateRegister = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate
];

// Register admin (only used once)
router.post('/register', validateRegister, register);

// Login admin
router.post('/login', validateLogin, login);

// Logout admin
router.post('/logout', logout);

// Get current admin
router.get('/me', protect, getMe);

export default router; 