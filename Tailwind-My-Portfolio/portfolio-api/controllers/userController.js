const User = require('../models/user');

// Get user information
exports.getUserInfo = async (req, res) => {
  try {
    // Since there should only be one user (portfolio owner), we get the first one
    const user = await User.findOne();
    
    if (!user) {
      return res.status(404).json({ message: 'User information not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create user information (should only be done once)
exports.createUserInfo = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne();
    if (existingUser) {
      return res.status(400).json({ message: 'User information already exists. Use update instead.' });
    }
    
    const user = new User(req.body);
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user information', error: error.message });
  }
};

// Update user information
exports.updateUserInfo = async (req, res) => {
  try {
    const user = await User.findOne();
    
    if (!user) {
      return res.status(404).json({ message: 'User information not found' });
    }
    
    // Update user fields
    Object.keys(req.body).forEach(key => {
      user[key] = req.body[key];
    });
    
    await user.save();
    
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user information', error: error.message });
  }
}; 