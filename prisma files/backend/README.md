# NutriStepPro Backend

A cutting-edge backend system for nutrition and fitness tracking with advanced AI features. Built for 2025 and beyond.

## Features

- **Advanced User Management**: Complete user profiles with authentication, authorization, and biometric support
- **Comprehensive Nutrition Tracking**: Track food intake with detailed nutritional breakdown and analysis
- **AI-Powered Meal Planning**: Generate personalized meal plans based on user goals and preferences
- **Computer Vision Food Analysis**: Take photos of your food for automatic nutritional analysis
- **Real-time Fitness Tracking**: Log workouts, track progress, and get AI-generated workout plans
- **Health Analytics**: Advanced analytics with trend analysis and predictive models
- **Connected Device Integration**: Sync with fitness trackers, smartwatches, and health devices
- **Real-time Insights**: WebSocket-based real-time data and notifications
- **Scalable Architecture**: Built with performance and scalability in mind

## Tech Stack

- **Runtime**: Node.js v20+
- **Framework**: Fastify - high-performance web framework
- **Database**: MongoDB with Prisma ORM
- **Caching**: Redis for high-speed data caching and pub/sub
- **Authentication**: JWT with refresh tokens and biometric integration
- **Queues**: BullMQ for background job processing
- **AI Integration**: Anthropic Claude and OpenAI for intelligent processing
- **Vectorization**: Vector database for semantic food search
- **Workflow Orchestration**: Temporal for reliable workflow execution
- **Validation**: Zod for runtime type safety
- **Logging**: Pino for structured, high-performance logging
- **Testing**: Vitest for unit and integration testing
- **Deployment**: Serverless framework for cloud deployment

## Project Structure

```
backend/
├── prisma/             # Database schema and migrations
├── src/
│   ├── routes/         # API routes and controllers
│   ├── middlewares/    # Middleware functions
│   ├── services/       # Core business logic
│   ├── utils/          # Utility functions
│   ├── data/           # Data management
│   └── plugins/        # Fastify plugins
├── tests/              # Test files
└── server.js           # Application entry point
```

## API Endpoints

The API is structured around RESTful principles with WebSocket support for real-time features.

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### Nutrition

- `GET /nutrition/logs` - Get user's nutrition logs with pagination
- `POST /nutrition/logs` - Create a new nutrition log
- `GET /nutrition/logs/:id` - Get a specific nutrition log
- `PUT /nutrition/logs/:id` - Update a nutrition log
- `DELETE /nutrition/logs/:id` - Delete a nutrition log
- `GET /nutrition/stats` - Get nutrition statistics
- `POST /nutrition/plans/generate` - Generate AI nutrition plan
- `GET /nutrition/plans` - Get user's nutrition plans
- `GET /nutrition/plans/:id` - Get a specific nutrition plan
- `DELETE /nutrition/plans/:id` - Delete a nutrition plan
- `GET /nutrition/foods/search` - Search food database
- `POST /nutrition/analyze/image` - Analyze food image
- `GET /nutrition/insights/realtime` - WebSocket for real-time insights

### Fitness

- `GET /fitness/logs` - Get user's workout logs
- `POST /fitness/logs` - Create a workout log
- `GET /fitness/logs/:id` - Get a specific workout log
- `PUT /fitness/logs/:id` - Update a workout log
- `DELETE /fitness/logs/:id` - Delete a workout log
- `GET /fitness/stats` - Get fitness statistics
- `POST /fitness/plans/generate` - Generate AI workout plan
- `GET /fitness/plans` - Get user's workout plans
- `GET /fitness/plans/:id` - Get a specific workout plan
- `DELETE /fitness/plans/:id` - Delete a workout plan

### User

- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/goals` - Get user goals
- `POST /user/goals` - Create a goal
- `PUT /user/goals/:id` - Update a goal
- `DELETE /user/goals/:id` - Delete a goal
- `GET /user/measurements` - Get body measurements
- `POST /user/measurements` - Add body measurement
- `GET /user/devices` - Get connected devices
- `POST /user/devices` - Connect a new device
- `DELETE /user/devices/:id` - Disconnect a device

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB
- Redis

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/nutristeppro.git
   cd nutristeppro/backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   ```
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Generate Prisma client
   ```
   npx prisma generate
   ```

5. Run database migrations
   ```
   npx prisma migrate deploy
   ```

6. Start the server
   ```
   npm run dev
   ```

## Environment Variables

```
# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Database
DATABASE_URL=mongodb://username:password@localhost:27017/nutristeppro

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d

# AI Services
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENAI_API_KEY=your-openai-api-key

# External Services
ALLOWED_ORIGINS=http://localhost:3000,https://nutristeppro.com
```

## Development

### Code Style

The project follows modern JavaScript conventions with ES modules and async/await patterns.

### Testing

Run tests with:
```
npm test
```

Run tests in watch mode:
```
npm run test:watch
```

### Linting

Lint code with:
```
npm run lint
```

Format code with:
```
npm run format
```

## Deployment

The application is designed to be deployed as a serverless application or as a containerized service.

### Serverless Deployment

```
npm run deploy
```

### Docker Deployment

```
docker-compose up -d
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Nutrition data provided by [USDA FoodData Central](https://fdc.nal.usda.gov/)
- Exercise database courtesy of [Open Exercise Database](https://www.openexercisedb.org/) 