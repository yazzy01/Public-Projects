const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');

// Get all skills
router.get('/', skillController.getAllSkills);

// Get skills by category
router.get('/category/:category', skillController.getSkillsByCategory);

// Get a single skill by ID
router.get('/:id', skillController.getSkillById);

// Create a new skill
router.post('/', skillController.createSkill);

// Update a skill
router.put('/:id', skillController.updateSkill);

// Delete a skill
router.delete('/:id', skillController.deleteSkill);

module.exports = router; 