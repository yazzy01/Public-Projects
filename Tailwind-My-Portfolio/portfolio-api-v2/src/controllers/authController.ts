import { Request, Response } from 'express';
import Admin from '../models/Admin';
import { AuthRequest } from '../types';

// Register a new admin (only used once to create the initial admin)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }
    
    const { username, password } = req.body;
    
    // Create new admin
    const admin = new Admin({ username, password });
    await admin.save();
    
    // Generate token
    const token = admin.generateAuthToken();
    
    res.status(201).json({
      message: 'Admin registered successfully',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error: (error as Error).message });
  }
};

// Login admin
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Generate token
    const token = admin.generateAuthToken();
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
  }
};

// Logout admin
export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get current admin
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error getting admin info', error: (error as Error).message });
  }
}; 