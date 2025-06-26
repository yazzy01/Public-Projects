const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Get all contacts (for dashboard)
router.get('/', contactController.getAllContacts);

// Get a single contact by ID
router.get('/:id', contactController.getContactById);

// Create a new contact message
router.post('/', contactController.createContact);

// Mark contact as read
router.patch('/:id/read', contactController.markAsRead);

// Delete a contact
router.delete('/:id', contactController.deleteContact);

module.exports = router; 