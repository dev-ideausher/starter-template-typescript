import os from 'os';

import { config, checkDatabaseHealth } from "@config";
import { HealthCheckResponse } from "@types";
// DONT CHANGE THIS FILE

// Helper function to get memory usage
export const getMemoryUsage = () => {
    const used = process.memoryUsage();
    return {
        rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(used.external / 1024 / 1024)}MB`,
        arrayBuffers: `${Math.round(used.arrayBuffers / 1024 / 1024)}MB`,
    };
};

// Helper function to get system info
export const getSystemInfo = () => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
        platform: os.platform(),
        arch: os.arch(),
        cpuCount: os.cpus().length,
        totalMemory: `${Math.round(totalMem / 1024 / 1024 / 1024)}GB`,
        freeMemory: `${Math.round(freeMem / 1024 / 1024 / 1024)}GB`,
        usedMemory: `${Math.round(usedMem / 1024 / 1024 / 1024)}GB`,
        memoryUsage: `${Math.round((usedMem / totalMem) * 100)}%`,
        uptime: `${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`,
        loadAverage: os.loadavg().map(load => load.toFixed(2)),
    };
};

// Health check service function
export const performHealthCheck = async (detailed: boolean = false): Promise<{ data: HealthCheckResponse; statusCode: number }> => {
    const startTime = Date.now();

    // Check database health
    const database = await checkDatabaseHealth();
    const responseTime = Date.now() - startTime;

    // Determine overall health status
    const isHealthy = database.status === 'healthy';
    const overallStatus = isHealthy ? 'healthy' : 'degraded';
    const httpStatusCode = isHealthy ? 200 : 503;

    const healthCheck: HealthCheckResponse = {
        status: overallStatus,
        message: isHealthy
            ? 'Backend is running smoothly'
            : 'Backend is experiencing issues',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        environment: config.nodeEnv,
        uptime: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m ${Math.floor(process.uptime() % 60)}s`,
        checks: {
            database,
        },
        process: {
            pid: process.pid,
            memory: getMemoryUsage(),
            nodeVersion: process.version,
        },
        system: getSystemInfo(),
    };

    // Add detailed view if requested
    if (detailed) {
        healthCheck.detailed = {
            cpuUsage: process.cpuUsage(),
            resourceUsage: process.resourceUsage ? process.resourceUsage() : 'Not available',
        };
    }

    return { data: healthCheck, statusCode: httpStatusCode };
};
