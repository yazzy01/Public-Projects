import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  about: {
    type: String,
    required: [true, 'About is required']
  },
  status: {
    type: String,
    default: 'Available for hire'
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  githubLink: {
    type: String,
    trim: true
  },
  linkedinLink: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String
  },
  resumeLink: {
    type: String
  },
  location: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema); 