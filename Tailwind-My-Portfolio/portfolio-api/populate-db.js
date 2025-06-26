const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import models
const User = require('./models/user');
const Project = require('./models/project');
const Skill = require('./models/skill');
const Contact = require('./models/contact');

// Load environment variables
dotenv.config();

// Sample data
const userData = {
  name: "John Doe",
  about: "Passionate Full Stack Developer with expertise in modern web technologies. I love creating responsive and user-friendly applications.",
  status: "Available for hire",
  phone: "+1234567890",
  email: "john.doe@example.com",
  githubLink: "https://github.com/johndoe",
  linkedinLink: "https://linkedin.com/in/johndoe",
  location: "New York, USA"
};

const projectsData = [
  {
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with product management, cart functionality, and payment processing.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
    githubLink: "https://github.com/johndoe/ecommerce-platform",
    liveLink: "https://ecommerce-demo.example.com",
    featured: true
  },
  {
    title: "Task Management App",
    description: "A Kanban-style task management application with drag-and-drop functionality and team collaboration features.",
    technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
    githubLink: "https://github.com/johndoe/task-manager",
    liveLink: "https://taskapp.example.com"
  },
  {
    title: "Weather Dashboard",
    description: "Real-time weather dashboard that displays current conditions and forecasts for multiple locations.",
    technologies: ["JavaScript", "OpenWeather API", "Chart.js", "Bootstrap"],
    githubLink: "https://github.com/johndoe/weather-dashboard",
    liveLink: "https://weather.example.com"
  }
];

const skillsData = [
  {
    name: "JavaScript",
    category: "Frontend",
    proficiency: 5,
    icon: "fab fa-js"
  },
  {
    name: "React",
    category: "Frontend",
    proficiency: 4,
    icon: "fab fa-react"
  },
  {
    name: "Node.js",
    category: "Backend",
    proficiency: 4,
    icon: "fab fa-node-js"
  },
  {
    name: "MongoDB",
    category: "Database",
    proficiency: 4,
    icon: "fas fa-database"
  },
  {
    name: "Express",
    category: "Backend",
    proficiency: 4
  },
  {
    name: "HTML5",
    category: "Frontend",
    proficiency: 5,
    icon: "fab fa-html5"
  },
  {
    name: "CSS3",
    category: "Frontend",
    proficiency: 5,
    icon: "fab fa-css3-alt"
  },
  {
    name: "Git",
    category: "DevOps",
    proficiency: 4,
    icon: "fab fa-git-alt"
  }
];

// Function to populate the database
async function populateDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    console.log('Clearing existing data...');
    try {
      await User.deleteMany({});
      console.log('Cleared users');
      await Project.deleteMany({});
      console.log('Cleared projects');
      await Skill.deleteMany({});
      console.log('Cleared skills');
    } catch (clearError) {
      console.error('Error clearing data:', clearError);
    }
    
    // Create user
    console.log('Creating user...');
    try {
      const user = await User.create(userData);
      console.log('Created user:', user.name);
    } catch (userError) {
      console.error('Error creating user:', userError);
    }
    
    // Create projects
    console.log('Creating projects...');
    try {
      const projects = await Project.insertMany(projectsData);
      console.log('Created projects:', projects.length);
    } catch (projectError) {
      console.error('Error creating projects:', projectError);
    }
    
    // Create skills
    console.log('Creating skills...');
    try {
      const skills = await Skill.insertMany(skillsData);
      console.log('Created skills:', skills.length);
    } catch (skillError) {
      console.error('Error creating skills:', skillError);
    }
    
    console.log('Database population completed');
    
  } catch (error) {
    console.error('Main error:', error);
  } finally {
    // Close the connection
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (closeError) {
      console.error('Error closing connection:', closeError);
    }
    process.exit(0);
  }
}

// Run the population function
console.log('Starting database population...');
populateDatabase(); 