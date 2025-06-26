# Portfolio API v2

A modern RESTful API for managing portfolio data, built with TypeScript, Express.js, and MongoDB.

## Features

- **TypeScript Integration**: Type-safe development with TypeScript
- **RESTful API**: Well-structured API endpoints for managing portfolio data
- **Authentication**: JWT-based authentication for admin access
- **Security**: Helmet, rate limiting, and other security features
- **Database**: MongoDB with Mongoose for data modeling
- **Admin Dashboard**: Simple admin interface to manage portfolio data
- **Validation**: Request validation with express-validator

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register admin (only used once)
- `POST /api/auth/login`: Login admin
- `POST /api/auth/logout`: Logout admin
- `GET /api/auth/me`: Get current admin info

### User Profile
- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get user by ID
- `POST /api/users`: Create a user
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user

### Projects
- `GET /api/projects`: Get all projects
- `GET /api/projects/:id`: Get project by ID
- `POST /api/projects`: Create a project
- `PUT /api/projects/:id`: Update project
- `DELETE /api/projects/:id`: Delete project

### Skills
- `GET /api/skills`: Get all skills
- `GET /api/skills/:id`: Get skill by ID
- `POST /api/skills`: Create a skill
- `PUT /api/skills/:id`: Update skill
- `DELETE /api/skills/:id`: Delete skill

### Contact Messages
- `GET /api/contacts`: Get all contact messages (admin only)
- `GET /api/contacts/:id`: Get contact message by ID (admin only)
- `POST /api/contacts`: Submit a contact message (public)
- `PATCH /api/contacts/:id/read`: Mark contact message as read (admin only)
- `DELETE /api/contacts/:id`: Delete contact message (admin only)

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd portfolio-api-v2
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

4. Create an admin user
```bash
npm run create-admin
```

5. Build and start the server
```bash
npm run build
npm start
```

For development:
```bash
npm run dev
```

## Admin Dashboard

Access the admin dashboard at:
- Login: http://localhost:5000/login
- Dashboard: http://localhost:5000/admin

Default admin credentials:
- Username: admin
- Password: admin123

## License

This project is licensed under the ISC License. 