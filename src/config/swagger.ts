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
                            enum: ["healthy", "unhealthy"],
                            example: "healthy",
                        },
                        timestamp: {
                            type: "string",
                            format: "date-time",
                        },
                        uptime: {
                            type: "number",
                            example: 3600,
                        },
                        database: {
                            type: "object",
                            properties: {
                                status: {
                                    type: "string",
                                    example: "healthy",
                                },
                                state: {
                                    type: "string",
                                    example: "connected",
                                },
                                responseTime: {
                                    type: "string",
                                    example: "5ms",
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

