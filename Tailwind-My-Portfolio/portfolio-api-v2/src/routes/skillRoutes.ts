import express from 'express';
import { getSkills, getSkill, createSkill, updateSkill, deleteSkill } from '../controllers/skillController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateSkill = [
  body('name').notEmpty().withMessage('Name is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Frontend', 'Backend', 'Database', 'DevOps', 'Other'])
    .withMessage('Category must be one of: Frontend, Backend, Database, DevOps, Other'),
  body('proficiency')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Proficiency must be between 1 and 5'),
  validate
];

// Public routes
router.get('/', getSkills);
router.get('/:id', getSkill);

// Protected routes
router.post('/', protect, validateSkill, createSkill);
router.put('/:id', protect, validateSkill, updateSkill);
router.delete('/:id', protect, deleteSkill);

export default router; 