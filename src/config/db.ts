import mongoose from "mongoose";

import { DatabaseHealth } from "@types";

import config from "./config.js";

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(
            `${config.mongodb.uri}/${config.mongodb.dbName}${
                config.nodeEnv === "test" ? "-test" : ""
            }`
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

export const checkDatabaseHealth = async (): Promise<DatabaseHealth> => {
    try {
        const startTime = Date.now();
        await mongoose.connection.db?.admin().ping();
        const responseTime = Date.now() - startTime;

        const dbState = mongoose.connection.readyState as 0 | 1 | 2 | 3;
        const dbStatus: Record<0 | 1 | 2 | 3, string> = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting",
        };
        // Runtime validation to ensure type safety

        const stateKey = Object.keys(dbStatus).includes(dbState.toString()) ? dbState : 0;

        return {
            status: dbState === 1 ? "healthy" : "unhealthy",
            state: dbStatus[stateKey] as DatabaseHealth["state"],
            responseTime: `${responseTime}ms`,
            name: mongoose.connection.name,
            host: mongoose.connection.host,
            port: mongoose.connection.port,
        };
    } catch (error: unknown) {
        return {
            status: "unhealthy",
            state: "error",
            responseTime: "0ms",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};
