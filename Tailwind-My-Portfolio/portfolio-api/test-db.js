const mongoose = require('mongoose');
const User = require('./models/user');
const Project = require('./models/project');
const Skill = require('./models/skill');

async function testDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/portfolio', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    // Create a user
    const user = new User({
      name: "John Doe",
      about: "Full Stack Developer",
      email: "john@example.com",
      githubLink: "https://github.com/johndoe",
      linkedinLink: "https://linkedin.com/in/johndoe"
    });
    
    await user.save();
    console.log('User created:', user);
    
    // Create a project
    const project = new Project({
      title: "Portfolio Website",
      description: "My personal portfolio website",
      technologies: ["HTML", "CSS", "JavaScript"],
      githubLink: "https://github.com/johndoe/portfolio",
      liveLink: "https://johndoe.com"
    });
    
    await project.save();
    console.log('Project created:', project);
    
    // Create a skill
    const skill = new Skill({
      name: "JavaScript",
      category: "Frontend",
      proficiency: 5
    });
    
    await skill.save();
    console.log('Skill created:', skill);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
  } catch (error) {
    console.error('Error:', error);
    // Close connection
    await mongoose.connection.close();
  }
}

testDatabase(); 