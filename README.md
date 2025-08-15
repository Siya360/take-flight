# Take-Flight Application

This project is a full-stack flight booking application with a React frontend (Vite + Tailwind + shadcn/ui) and Node.js backend, featuring real-time flight data updates through WebSocket connections.

## Architecture

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui components (port 3000)
- **Backend**: Node.js server with REST API and WebSocket support (port 8081)
- **Database**: MongoDB (port 27017)
- **Cache**: Redis (port 6379)

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js 18+
- Yarn or Bun (package managers)
- Docker & Docker Compose (for full-stack setup)

### Environment Setup

#### Backend Server Setup
Navigate to the `/server` directory:
```bash
cd server
cp .env.example .env
```
Open the .env file and fill in the actual configuration values.

#### Install Dependencies

**Backend:**
```bash
cd server
yarn install
```

**Frontend:**
```bash
cd frontend
# Using bun (recommended)
bun install
# OR using yarn
yarn install
```

## Running the Application

### Frontend Only (Development)
In the `/frontend` directory:
```bash
# Using bun
bun dev
# OR using yarn
yarn dev
```
Open http://localhost:3000 to view the React application.

### Backend Only (Development)
In the `/server` directory:
```bash
yarn start
```
The Node.js server will start on http://localhost:8081.

### Full Stack with Docker
Run the entire application stack with Docker:
```bash
docker compose up --build
```
This starts:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8081
- MongoDB: localhost:27017
- Redis: localhost:6379

### Service Ports Reference

| Service    | Port | Description |
|------------|------|-------------|
| Frontend   | 3000 | React + Vite dev server / built app |
| Backend    | 8081 | Node.js API server |
| MongoDB    | 27017 | Database |
| Redis      | 6379 | Cache and sessions |

## Testing

### Frontend Tests
In the `/frontend` directory:
```bash
# Using bun
bun test
# OR using yarn
yarn test
```

### Backend Tests
In the `/server` directory:
```bash
yarn test
```

## Building for Production

### Frontend Build
In the `/frontend` directory:
```bash
# Using bun
bun run build
# OR using yarn
yarn build
```
This creates an optimized production build in the `dist/` folder.

### Backend Build
The backend runs directly from source. For production deployment, ensure environment variables are properly configured.

## Project Structure

```
├── frontend/           # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components (shadcn/ui)
│   │   ├── pages/       # Application pages/routes
│   │   ├── lib/         # Utilities and configurations
│   │   └── hooks/       # Custom React hooks
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
├── server/             # Node.js backend server
│   ├── lambda_functions/ # Serverless functions
│   ├── microservices/   # Service modules
│   └── package.json     # Backend dependencies
└── docker-compose.yml   # Full-stack orchestration
```

## Development Workflow

1. **Local Development** (recommended for rapid iteration):
   - Start backend: `cd server && yarn start`
   - Start frontend: `cd frontend && bun dev`
   - Access app at http://localhost:3000

2. **Docker Development** (for testing full integration):
   - Run: `docker compose up --build`
   - Access app at http://localhost:3000

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
