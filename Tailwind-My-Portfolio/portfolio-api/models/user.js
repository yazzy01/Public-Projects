const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  about: {
    type: String,
    required: true
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
    required: true,
    trim: true,
    lowercase: true
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

const User = mongoose.model('User', userSchema);

module.exports = User; 