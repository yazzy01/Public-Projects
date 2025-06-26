# Portfolio API

A RESTful API for managing a developer's portfolio, built with Express.js, MongoDB, and Mongoose.

## Features

- User information management (personal details)
- Project management (CRUD operations)
- Skills management (CRUD operations)
- Contact form message handling

## Project Structure

```
/portfolio-api/
├── models/
│   ├── user.js
│   ├── project.js
│   ├── skill.js
│   └── contact.js
├── controllers/
│   ├── userController.js
│   ├── projectController.js
│   ├── skillController.js
│   └── contactController.js
├── routes/
│   ├── userRoutes.js
│   ├── projectRoutes.js
│   ├── skillRoutes.js
│   └── contactRoutes.js
├── index.js
├── package.json
└── .env (create this file locally)
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   ```
4. Start the server:
   ```
   npm start
   ```
   Or for development with nodemon:
   ```
   npm run dev
   ```

## API Endpoints

### User Information
- `GET /api/users` - Get user information
- `POST /api/users` - Create user information
- `PUT /api/users` - Update user information

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/category/:category` - Get skills by category
- `GET /api/skills/:id` - Get a specific skill
- `POST /api/skills` - Create a new skill
- `PUT /api/skills/:id` - Update a skill
- `DELETE /api/skills/:id` - Delete a skill

### Contact Messages
- `GET /api/contacts` - Get all contact messages
- `GET /api/contacts/:id` - Get a specific contact message
- `POST /api/contacts` - Create a new contact message
- `PATCH /api/contacts/:id/read` - Mark a message as read
- `DELETE /api/contacts/:id` - Delete a contact message 