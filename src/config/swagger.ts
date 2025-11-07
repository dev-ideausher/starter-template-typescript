/**
 * @fileoverview Swagger/OpenAPI configuration
 * @description Configuration for API documentation using Swagger UI
 */

import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./config.js";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Starter Template TypeScript API",
            version: "1.0.0",
            description:
                "A TypeScript starter template for building backend applications with Express. This API provides authentication, user management, and file upload capabilities.",
            contact: {
                name: "API Support",
                email: "support@example.com",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}`,
                description: "Development server",
            },
            {
                url: "https://api.example.com",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Firebase ID Token (Bearer token)",
                },
            },
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        statusCode: {
                            type: "number",
                            example: 400,
                        },
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        message: {
                            type: "string",
                            example: "Error message",
                        },
                        stack: {
                            type: "string",
                            description: "Stack trace (only in development)",
                        },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "507f1f77bcf86cd799439011",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "user@example.com",
                        },
                        name: {
                            type: "string",
                            example: "John Doe",
                        },
                        username: {
                            type: "string",
                            example: "johndoe",
                        },
                        avatar: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example: "avatar-123",
                                },
                                url: {
                                    type: "string",
                                    format: "uri",
                                    example: "https://example.com/avatar.jpg",
                                },
                            },
                        },
                        isEmailVerified: {
                            type: "boolean",
                            example: true,
                        },
                        isProfileComplete: {
                            type: "boolean",
                            example: false,
                        },
                        firebaseUid: {
                            type: "string",
                            example: "firebase-uid-123",
                        },
                        firebaseSignInProvider: {
                            type: "string",
                            example: "google.com",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Client: {
                    allOf: [
                        {
                            $ref: "#/components/schemas/User",
                        },
                        {
                            type: "object",
                            properties: {
                                isBlocked: {
                                    type: "boolean",
                                    example: false,
                                },
                                isDeleted: {
                                    type: "boolean",
                                    example: false,
                                },
                                preferences: {
                                    type: "object",
                                    properties: {
                                        notificationEnabled: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        locationShared: {
                                            type: "boolean",
                                            example: false,
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
                Admin: {
                    allOf: [
                        {
                            $ref: "#/components/schemas/User",
                        },
                        {
                            type: "object",
                            properties: {
                                permissions: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                    example: ["read:users", "write:users"],
                                },
                                superAdmin: {
                                    type: "boolean",
                                    example: false,
                                },
                            },
                        },
                    ],
                },
                RegisterRequest: {
                    type: "object",
                    required: ["name", "username"],
                    properties: {
                        name: {
                            type: "string",
                            minLength: 2,
                            maxLength: 50,
                            example: "John Doe",
                        },
                        username: {
                            type: "string",
                            minLength: 3,
                            maxLength: 30,
                            pattern: "^[a-zA-Z0-9_]+$",
                            example: "johndoe",
                        },
                    },
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        statusCode: {
                            type: "number",
                            example: 200,
                        },
                        success: {
                            type: "boolean",
                            example: true,
                        },
                        message: {
                            type: "string",
                            example: "Operation successful",
                        },
                        data: {
                            type: "object",
                        },
                    },
                },
                HealthCheck: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            enum: ["healthy", "degraded", "unhealthy"],
                            example: "healthy",
                            description: "Overall health status of the system",
                        },
                        message: {
                            type: "string",
                            example: "Backend is running smoothly",
                            description: "Human-readable health status message",
                        },
                        timestamp: {
                            type: "string",
                            format: "date-time",
                            example: "2024-01-15T10:30:00.000Z",
                            description: "ISO timestamp of the health check",
                        },
                        responseTime: {
                            type: "string",
                            example: "15ms",
                            description: "Time taken to perform the health check",
                        },
                        environment: {
                            type: "string",
                            example: "development",
                            description: "Current environment (development, production, test)",
                        },
                        uptime: {
                            type: "string",
                            example: "2h 30m 45s",
                            description: "Server uptime in human-readable format",
                        },
                        checks: {
                            type: "object",
                            description: "Health checks for various components",
                            properties: {
                                database: {
                                    type: "object",
                                    properties: {
                                        status: {
                                            type: "string",
                                            enum: ["healthy", "unhealthy"],
                                            example: "healthy",
                                        },
                                        state: {
                                            type: "string",
                                            enum: ["connected", "disconnected", "connecting", "disconnecting", "error"],
                                            example: "connected",
                                        },
                                        responseTime: {
                                            type: "string",
                                            example: "5ms",
                                        },
                                        name: {
                                            type: "string",
                                            example: "myapp_db",
                                        },
                                        host: {
                                            type: "string",
                                            example: "localhost",
                                        },
                                        port: {
                                            type: "number",
                                            example: 27017,
                                        },
                                        error: {
                                            type: "string",
                                            description: "Error message if database check failed",
                                        },
                                    },
                                },
                            },
                        },
                        process: {
                            type: "object",
                            description: "Process information",
                            properties: {
                                pid: {
                                    type: "number",
                                    example: 12345,
                                    description: "Process ID",
                                },
                                memory: {
                                    type: "object",
                                    properties: {
                                        rss: {
                                            type: "string",
                                            example: "150MB",
                                            description: "Resident Set Size",
                                        },
                                        heapTotal: {
                                            type: "string",
                                            example: "50MB",
                                        },
                                        heapUsed: {
                                            type: "string",
                                            example: "30MB",
                                        },
                                        external: {
                                            type: "string",
                                            example: "5MB",
                                        },
                                        arrayBuffers: {
                                            type: "string",
                                            example: "2MB",
                                        },
                                    },
                                },
                                nodeVersion: {
                                    type: "string",
                                    example: "v22.16.0",
                                },
                            },
                        },
                        system: {
                            type: "object",
                            description: "System information (only in detailed mode)",
                            properties: {
                                platform: {
                                    type: "string",
                                    example: "win32",
                                },
                                arch: {
                                    type: "string",
                                    example: "x64",
                                },
                                cpuCount: {
                                    type: "number",
                                    example: 8,
                                },
                                totalMemory: {
                                    type: "string",
                                    example: "16GB",
                                },
                                freeMemory: {
                                    type: "string",
                                    example: "8GB",
                                },
                                usedMemory: {
                                    type: "string",
                                    example: "8GB",
                                },
                                memoryUsage: {
                                    type: "string",
                                    example: "50%",
                                },
                                uptime: {
                                    type: "string",
                                    example: "2h 30m",
                                },
                                loadAverage: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                    example: ["1.25", "1.50", "1.75"],
                                },
                            },
                        },
                        detailed: {
                            type: "object",
                            description: "Detailed health information (only when ?detailed=true)",
                            properties: {
                                cpuUsage: {
                                    type: "object",
                                    properties: {
                                        user: {
                                            type: "number",
                                            example: 1234567,
                                        },
                                        system: {
                                            type: "number",
                                            example: 987654,
                                        },
                                    },
                                },
                                resourceUsage: {
                                    description: "Resource usage statistics",
                                },
                            },
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: "Authentication",
                description: "User authentication endpoints",
            },
            {
                name: "Users",
                description: "User management endpoints",
            },
            {
                name: "Health",
                description: "Health check endpoints",
            },
        ],
    },
    apis: [
        "./src/routes/**/*.ts",
        "./src/routes/**/*.js",
        "./dist/routes/**/*.js",
    ], // Paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJsdoc(options);

