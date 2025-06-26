/**
 * Simple script to start the server in development mode
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create .env file if it doesn't exist
const envFile = path.join(__dirname, '.env');
if (!fs.existsSync(envFile)) {
  console.log('Creating .env file...');
  const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=development_secret_key_change_in_production
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100`;
  
  fs.writeFileSync(envFile, envContent);
  console.log('.env file created successfully!');
}

// Create public directories if they don't exist
const publicDir = path.join(__dirname, 'public');
const adminDir = path.join(publicDir, 'admin');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

if (!fs.existsSync(adminDir)) {
  fs.mkdirSync(adminDir);
}

// Start the server
console.log('Starting server in development mode...');
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start server:', error.message);
} 