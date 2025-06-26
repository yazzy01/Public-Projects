import { Request, Response } from 'express';
import Skill from '../models/Skill';
import { asyncHandler } from '../utils/errorHandler';

// Get all skills
export const getSkills = asyncHandler(async (req: Request, res: Response) => {
  // Handle query parameters
  const { category, sort = 'category' } = req.query;
  
  // Build query
  const queryObj: any = {};
  
  // Filter by category
  if (category) {
    queryObj.category = category;
  }
  
  // Execute query
  const skills = await Skill.find(queryObj).sort(sort as string);
  
  res.status(200).json(skills);
});

// Get single skill
export const getSkill = asyncHandler(async (req: Request, res: Response) => {
  const skill = await Skill.findById(req.params.id);
  
  if (!skill) {
    return res.status(404).json({ message: 'Skill not found' });
  }
  
  res.status(200).json(skill);
});

// Create skill
export const createSkill = asyncHandler(async (req: Request, res: Response) => {
  const skill = await Skill.create(req.body);
  res.status(201).json(skill);
});

// Update skill
export const updateSkill = asyncHandler(async (req: Request, res: Response) => {
  let skill = await Skill.findById(req.params.id);
  
  if (!skill) {
    return res.status(404).json({ message: 'Skill not found' });
  }
  
  skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json(skill);
});

// Delete skill
export const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
  const skill = await Skill.findById(req.params.id);
  
  if (!skill) {
    return res.status(404).json({ message: 'Skill not found' });
  }
  
  await skill.deleteOne();
  
  res.status(200).json({ message: 'Skill deleted' });
}); 