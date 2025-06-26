const mongoose = require('mongoose');
const Admin = require('./models/admin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Admin credentials
const adminData = {
  username: 'admin',
  password: 'admin123'  // This will be hashed by the pre-save hook
};

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: adminData.username });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.connection.close();
      return;
    }
    
    // Create admin
    const admin = new Admin(adminData);
    await admin.save();
    console.log('Admin user created successfully');
    console.log('Username:', adminData.username);
    console.log('Password:', adminData.password);
    console.log('Please change the password after first login');
    
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error creating admin:', error);
    await mongoose.connection.close();
  }
}

// Run the function
createAdmin(); 