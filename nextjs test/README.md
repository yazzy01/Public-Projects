# CollabFlow

CollabFlow is a modern SaaS platform for content collaboration and management. It helps teams create, manage, and distribute content across multiple channels with AI assistance.

## Features

- **Collaborative Editing**: Work together on content in real-time with your entire team
- **AI-Powered Assistance**: Get intelligent suggestions and automate repetitive tasks
- **Multi-Channel Publishing**: Publish content to multiple platforms with a single click
- **Progressive Web App**: Install and use the app offline on any device
- **Authentication & Authorization**: Secure user authentication and role-based access control
- **Organization & Project Management**: Organize content in projects and organizations

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Deployment**: Serverless and Edge Computing
- **PWA**: next-pwa for progressive web app capabilities
- **TypeScript**: For type safety and better developer experience

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/collabflow.git
cd collabflow
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/collabflow"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize the database:

```bash
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This application is designed to be deployed to modern cloud platforms that support serverless and edge computing, such as Vercel, Netlify, or AWS Amplify.

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set up the environment variables
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [next-pwa](https://github.com/shadowwalker/next-pwa) 