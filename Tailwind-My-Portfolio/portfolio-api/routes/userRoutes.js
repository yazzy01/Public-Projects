const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get user information
router.get('/', userController.getUserInfo);

// Create user information
router.post('/', userController.createUserInfo);

// Update user information
router.put('/', userController.updateUserInfo);

module.exports = router; 