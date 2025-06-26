const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register admin (only used once)
router.post('/register', authController.register);

// Login admin
router.post('/login', authController.login);

// Logout admin
router.post('/logout', authController.logout);

// Get current admin
router.get('/me', protect, authController.getMe);

module.exports = router; 