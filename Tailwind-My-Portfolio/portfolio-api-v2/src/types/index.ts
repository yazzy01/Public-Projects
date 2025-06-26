import { Document } from 'mongoose';
import { Request } from 'express';

// User interface
export interface IUser extends Document {
  name: string;
  about: string;
  status?: string;
  phone?: string;
  email: string;
  githubLink?: string;
  linkedinLink?: string;
  profileImage?: string;
  resumeLink?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project interface
export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  githubLink?: string;
  liveLink?: string;
  featured: boolean;
  completionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Skill interface
export interface ISkill extends Document {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Other';
  proficiency: number;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contact interface
export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Admin interface
export interface IAdmin extends Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// Extended Request interface with admin property
export interface AuthRequest extends Request {
  admin?: IAdmin;
}

// Error response interface
export interface ErrorResponse {
  message: string;
  error?: any;
  stack?: string;
} 