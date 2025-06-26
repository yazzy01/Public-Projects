import mongoose, { Schema } from 'mongoose';
import { ISkill } from '../types';

const skillSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Other']
  },
  proficiency: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  icon: {
    type: String
  },
  color: {
    type: String,
    default: '#3498db'
  }
}, {
  timestamps: true
});

export default mongoose.model<ISkill>('Skill', skillSchema); 