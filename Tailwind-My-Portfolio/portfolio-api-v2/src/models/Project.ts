import mongoose, { Schema } from 'mongoose';
import { IProject } from '../types';

const projectSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  technologies: [{
    type: String,
    trim: true
  }],
  image: {
    type: String
  },
  githubLink: {
    type: String,
    trim: true
  },
  liveLink: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  completionDate: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model<IProject>('Project', projectSchema); 