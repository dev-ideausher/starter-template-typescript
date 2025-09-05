# Production Express App

## Overview

This is a TypeScript starter template for building backend applications with Express.

## Features

-   Modular architecture with separate folders for config, controllers, middleware, models, routes, services, microservices, validators, types and utils.
-   TypeScript for type safety and better development experience.
-   Configurable settings for different environments.

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

