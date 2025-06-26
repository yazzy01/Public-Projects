import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('about').notEmpty().withMessage('About is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  validate
];

// Public routes
router.get('/', getUsers);
router.get('/:id', getUser);

// Protected routes
router.post('/', protect, validateUser, createUser);
router.put('/:id', protect, validateUser, updateUser);
router.delete('/:id', protect, deleteUser);

export default router; 