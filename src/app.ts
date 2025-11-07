import compression from "compression";
import cors from "cors";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import swaggerUi from "swagger-ui-express";

import { config } from "@config";
import { swaggerSpec } from "@config/swagger.js";
import { errorHandler, errorLogger, successLogger } from "@middlewares";
import routes from "@routes";
import { performHealthCheck } from "@utils";

const app = express();

// Configure Helmet with content security policy that allows Swagger UI
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    })
);

app.use(
    cors({
        origin: config.cors || "*",
        credentials: true,
    })
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Gzip compression
app.use(compression());

if (config.nodeEnv !== "development") {
    app.use(successLogger);
    app.use(errorLogger);
}

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


// ==================== API Documentation ====================

// Swagger UI setup for API documentation
// Accessible at /api-docs endpoint
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "API Documentation",
    })
);

// ==================== API Routes ====================

app.use("/v1", routes);

// ==================== Health Check Endpoint ====================

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: |
 *       Check the health status of the server, database, and system resources.
 *       
 *       **Basic Health Check:**
 *       - Returns overall system status (healthy/degraded/unhealthy)
 *       - Database connection status
 *       - Process information (PID, memory usage, Node.js version)
 *       - Server uptime and response time
 *       
 *       **Detailed Health Check (use ?detailed=true):**
 *       - All basic information plus:
 *       - System information (platform, CPU, memory, load average)
 *       - Detailed CPU usage statistics
 *       - Resource usage metrics
 *       
 *       **Status Codes:**
 *       - 200: System is healthy (database connected)
 *       - 503: System is degraded/unhealthy (database disconnected or issues)
 *       - 500: Health check itself failed
 *     parameters:
 *       - in: query
 *         name: detailed
 *         schema:
 *           type: boolean
 *           default: false
 *         description: |
 *           Set to `true` to include detailed system information.
 *           When `true`, includes CPU usage, system metrics, and resource usage.
 *         example: false
 *     responses:
 *       200:
 *         description: Server is healthy - all systems operational
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *             examples:
 *               basic:
 *                 summary: Basic health check response
 *                 value:
 *                   status: "healthy"
 *                   message: "Backend is running smoothly"
 *                   timestamp: "2024-01-15T10:30:00.000Z"
 *                   responseTime: "15ms"
 *                   environment: "development"
 *                   uptime: "2h 30m 45s"
 *                   checks:
 *                     database:
 *                       status: "healthy"
 *                       state: "connected"
 *                       responseTime: "5ms"
 *                       name: "myapp_db"
 *                       host: "localhost"
 *                       port: 27017
 *                   process:
 *                     pid: 12345
 *                     memory:
 *                       rss: "150MB"
 *                       heapTotal: "50MB"
 *                       heapUsed: "30MB"
 *                       external: "5MB"
 *                       arrayBuffers: "2MB"
 *                     nodeVersion: "v22.16.0"
 *                   system:
 *                     platform: "win32"
 *                     arch: "x64"
 *                     cpuCount: 8
 *                     totalMemory: "16GB"
 *                     freeMemory: "8GB"
 *                     usedMemory: "8GB"
 *                     memoryUsage: "50%"
 *                     uptime: "2h 30m"
 *                     loadAverage: ["1.25", "1.50", "1.75"]
 *               detailed:
 *                 summary: Detailed health check response (with ?detailed=true)
 *                 value:
 *                   status: "healthy"
 *                   message: "Backend is running smoothly"
 *                   timestamp: "2024-01-15T10:30:00.000Z"
 *                   responseTime: "25ms"
 *                   environment: "development"
 *                   uptime: "2h 30m 45s"
 *                   checks:
 *                     database:
 *                       status: "healthy"
 *                       state: "connected"
 *                       responseTime: "5ms"
 *                   process:
 *                     pid: 12345
 *                     memory:
 *                       rss: "150MB"
 *                       heapTotal: "50MB"
 *                       heapUsed: "30MB"
 *                     nodeVersion: "v22.16.0"
 *                   system:
 *                     platform: "win32"
 *                     arch: "x64"
 *                     cpuCount: 8
 *                     totalMemory: "16GB"
 *                     freeMemory: "8GB"
 *                     usedMemory: "8GB"
 *                     memoryUsage: "50%"
 *                     uptime: "2h 30m"
 *                     loadAverage: ["1.25", "1.50", "1.75"]
 *                   detailed:
 *                     cpuUsage:
 *                       user: 1234567
 *                       system: 987654
 *                     resourceUsage: "Resource usage data"
 *       503:
 *         description: Server is degraded or unhealthy - database disconnected or system issues
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *             example:
 *               status: "degraded"
 *               message: "Backend is experiencing issues"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *               responseTime: "15ms"
 *               environment: "development"
 *               uptime: "2h 30m 45s"
 *               checks:
 *                 database:
 *                   status: "unhealthy"
 *                   state: "disconnected"
 *                   error: "Connection timeout"
 *               process:
 *                 pid: 12345
 *                 memory:
 *                   rss: "150MB"
 *                   heapTotal: "50MB"
 *                   heapUsed: "30MB"
 *                 nodeVersion: "v22.16.0"
 *       500:
 *         description: Health check operation itself failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               statusCode: 500
 *               success: false
 *               message: "Health check failed"
 *               error: "Internal server error during health check"
 */
app.get("/health", async (req: Request, res: Response) => {
    try {
        const detailed = req.query.detailed === 'true';
        const { data, statusCode } = await performHealthCheck(detailed);
        res.status(statusCode).json(data);
    } catch (error: any) {
        res.status(500).json({
            status: 'unhealthy',
            message: 'Health check failed',
            timestamp: new Date().toISOString(),
            error: error.message,
            environment: config.nodeEnv,
        });
    }
});

app.use(errorHandler);

export default app;
