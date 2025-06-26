import { Request, Response } from 'express';
import User from '../models/User';
import { asyncHandler } from '../utils/errorHandler';

// Get all users
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get single user
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.status(200).json(user);
});

// Create user
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  // Check if user already exists
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    return res.status(400).json({ message: 'User profile already exists. Use PUT to update.' });
  }
  
  const user = await User.create(req.body);
  res.status(201).json(user);
});

// Update user
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  let user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json(user);
});

// Delete user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  await user.deleteOne();
  
  res.status(200).json({ message: 'User deleted' });
}); 