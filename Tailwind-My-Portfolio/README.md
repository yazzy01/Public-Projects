# Yassir's Portfolio - Full-Stack Tailwind CSS Project

A modern, responsive full-stack portfolio website built with Tailwind CSS, JavaScript, and a Node.js/Express/MongoDB backend.

## Project Status

This project is currently at **65% completion**. So far, we have:

- ✅ Set up the frontend with Tailwind CSS and responsive design
- ✅ Implemented dark/light mode toggle with persistence
- ✅ Created smooth animations and transitions
- ✅ Built the basic page sections (Header, Hero, About, Skills, Portfolio, Contact)
- ✅ Developed a RESTful API with Express.js and MongoDB
- ✅ Implemented authentication system for admin access
- ✅ Created data models for projects, skills, and contact messages

## Remaining Tasks

The remaining 35% of the project includes:

- ⬜ Finalizing admin dashboard interface
- ⬜ Implementing frontend-API integration for all sections
- ⬜ Adding comprehensive form validation
- ⬜ Completing responsive design for all device sizes
- ⬜ Adding SEO optimization
- ⬜ Cross-browser testing and bug fixing
- ⬜ Performance optimization
- ⬜ Deployment to production

## Project Structure

```
/
├── src/                   # Frontend source files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Base styles and Tailwind imports
│   ├── main.js            # Main JavaScript file
│   ├── api-service.js     # API integration service
│   └── ...                # Other frontend assets
│
├── portfolio-api/         # Express.js API (v1)
│   ├── models/            # Mongoose data models
│   ├── controllers/       # API controllers
│   ├── routes/            # API routes
│   └── ...                # Other backend files
│
├── portfolio-api-v2/      # TypeScript API (v2)
│   ├── src/               # TypeScript source files
│   ├── dist/              # Compiled JavaScript
│   └── ...                # Configuration files
│
├── dist/                  # Compiled CSS output
├── node_modules/          # Dependencies
├── package.json           # Project configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

## Running the Project

### Frontend

1. Install dependencies:
   ```
   npm install
   ```

2. Build the CSS files:
   ```
   npm run build
   ```

3. For development with automatic rebuilding:
   ```
   npm run watch
   ```

4. Open the `src/index.html` file in your browser to view the frontend.

### Backend API (v1)

1. Navigate to the API directory:
   ```
   cd portfolio-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

### Backend API (v2 - TypeScript)

1. Navigate to the API v2 directory:
   ```
   cd portfolio-api-v2
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the TypeScript files:
   ```
   npm run build
   ```

4. Start the server:
   ```
   npm start
   ```

## Technologies Used

- **Frontend**:
  - HTML5/CSS3
  - Tailwind CSS
  - JavaScript (ES6+)
  - PostCSS

- **Backend**:
  - Node.js/Express
  - TypeScript
  - MongoDB/Mongoose
  - JWT Authentication

- **Tools**:
  - npm
  - Git
  - VS Code

## Features

- Responsive design for all device sizes
- Dark/light mode toggle
- Animated UI elements
- Project filtering and showcase
- Skills visualization
- Contact form with API integration
- Admin dashboard for content management
- Secure authentication system
- RESTful API for data management