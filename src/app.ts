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
 *       Check the health status of the server and database.
 *       Use ?detailed=true for detailed health information including database metrics.
 *     parameters:
 *       - in: query
 *         name: detailed
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Return detailed health information
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       503:
 *         description: Server is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       500:
 *         description: Health check failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
