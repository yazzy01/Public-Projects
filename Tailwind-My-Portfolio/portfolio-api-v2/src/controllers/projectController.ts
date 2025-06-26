import { Request, Response } from 'express';
import Project from '../models/Project';
import { asyncHandler } from '../utils/errorHandler';

// Get all projects
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  // Handle query parameters
  const { featured, limit = '10', sort = '-createdAt' } = req.query;
  
  // Build query
  const queryObj: any = {};
  
  // Filter for featured projects
  if (featured === 'true') {
    queryObj.featured = true;
  }
  
  // Execute query
  const projects = await Project.find(queryObj)
    .sort(sort as string)
    .limit(parseInt(limit as string, 10));
  
  res.status(200).json(projects);
});

// Get single project
export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  
  res.status(200).json(project);
});

// Create project
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

// Update project
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  let project = await Project.findById(req.params.id);
  
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  
  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json(project);
});

// Delete project
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  
  await project.deleteOne();
  
  res.status(200).json({ message: 'Project deleted' });
}); 