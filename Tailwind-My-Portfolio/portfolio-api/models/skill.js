const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
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

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill; 