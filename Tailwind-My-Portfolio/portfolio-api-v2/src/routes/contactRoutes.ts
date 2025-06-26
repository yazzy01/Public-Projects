import express from 'express';
import { getContacts, getContact, createContact, markAsRead, deleteContact } from '../controllers/contactController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateContact = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  validate
];

// Public routes
router.post('/', validateContact, createContact);

// Protected routes
router.get('/', protect, getContacts);
router.get('/:id', protect, getContact);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteContact);

export default router; 