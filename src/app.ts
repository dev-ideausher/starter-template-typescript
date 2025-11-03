import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import hpp from "hpp";

import routes from "@routes";
import { errorHandler, errorLogger, successLogger } from "@middlewares";
import { config } from "@config";
import { performHealthCheck } from "@utils";

const app = express();

app.use(helmet());

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


app.use("/v1", routes);

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
