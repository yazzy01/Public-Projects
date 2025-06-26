import express from 'express';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateProject = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('technologies').isArray().withMessage('Technologies must be an array'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  validate
];

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes
router.post('/', protect, validateProject, createProject);
router.put('/:id', protect, validateProject, updateProject);
router.delete('/:id', protect, deleteProject);

export default router; 