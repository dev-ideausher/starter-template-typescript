# Production Express App

## Overview

This is a TypeScript starter template for building backend applications with Express.

## Features

-   Modular architecture with separate folders for config, controllers, middleware, models, routes, services, microservices, validators, types and utils.
-   TypeScript for type safety and better development experience.
-   Configurable settings for different environments.
-   **OpenAPI/Swagger documentation** - Interactive API documentation with Swagger UI.
-   **Docker support** - Complete Docker setup with development and production configurations, including MongoDB and Redis services.

## Getting Started

### Prerequisites

-   Node.js (version 14 or higher)
-   npm (Node Package Manager)

### Installation

1. Clone the repository:
    ```
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```
    cd production-express-app
    ```
3. Install the dependencies:
    ```
    npm install
    ```

### Configuration

-   Create a new `.env` file analogous to `.env.sample` provided in order to run the server

### Running the Application

#### Local Development (without Docker)

To start the application in development mode, run:

```
npm run dev
```

This will start a development server using ts-node

To start the application, run:

```
npm start
```

This will compile the TypeScript files and start the Express server.

#### Docker Development

**Prerequisites:**
- Docker Desktop installed and running
- Docker Compose v3.8 or higher

**Start Development Environment:**

```bash
# Start all services (MongoDB, Redis, and the app in dev mode)
docker-compose up -d

# Or start only the development app (with hot reload)
docker-compose up app-dev

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Build and Run Production:**

```bash
# Build production image
docker build -t starter-app:latest -f Dockerfile .

# Or use docker-compose with production profile
docker-compose --profile production -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Docker Services:**
- **MongoDB**: Available at `localhost:27017`
- **Redis**: Available at `localhost:6379`
- **App (Dev)**: Available at `http://localhost:8000`
- **App (Prod)**: Available at `http://localhost:8000`

**Useful Docker Commands:**
```bash
# View running containers
docker-compose ps

# View logs for specific service
docker-compose logs -f app-dev

# Rebuild containers
docker-compose up -d --build

# Clean up (removes volumes)
docker-compose down -v

# Execute commands in container
docker-compose exec app-dev sh
```

**Note:** Make sure your `.env` file is configured with the correct MongoDB URI for Docker:
```
MONGODB_URI=mongodb://mongodb:27017
```

### API Documentation

The project includes interactive API documentation powered by Swagger/OpenAPI.

**Access the API documentation:**
- After starting the server, navigate to: `http://localhost:8000/api-docs`
- The Swagger UI provides an interactive interface to explore and test all API endpoints
- All endpoints are documented with request/response schemas, authentication requirements, and examples

**Features:**
- Complete OpenAPI 3.0 specification
- Interactive API testing directly from the browser
- Authentication support (Firebase Bearer tokens)
- Request/response schema validation
- Example requests and responses

**Adding Documentation to New Endpoints:**
Add JSDoc comments with `@swagger` annotations above your route handlers. See `src/routes/v1/auth.routes.ts` for examples.

### Directory Structure

-   `src/app.ts`: Main application file.
-   `src/server.ts`: Server entry point.
-   `src/config`: Configuration settings for services.
-   `src/microservices`: External services for perfoming micro tasks
-   `src/controllers`: Request handlers.
-   `src/middleware`: Middleware functions.
-   `src/models`: Data models.
-   `src/routes`: Application routes.
-   `src/services`: Database operations.
-   `src/types`: Type definitions.
-   `src/validators`: Request validators.
-   `temp`: Temporarily stored files uploaded through multer.

