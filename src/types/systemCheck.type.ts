import { getMemoryUsage } from "@utils";


export interface DatabaseHealth {
    status: "healthy" | "unhealthy";
    state: "connected" | "disconnected" | "connecting" | "disconnecting" | "error";
    responseTime?: string;
    name?: string;
    host?: string;
    port?: number;
    error?: string;
}

interface ProcessInfo {
    pid: number;
    memory: ReturnType<typeof getMemoryUsage>;
    nodeVersion: string;
}

interface SystemInfo {
    platform: string;
    arch: string;
    cpuCount: number;
    totalMemory: string;
    freeMemory: string;
    usedMemory: string;
    memoryUsage: string;
    uptime: string;
    loadAverage: string[];
}

// Optional detailed info if query param `?detailed=true`
interface DetailedHealthInfo {
    cpuUsage: NodeJS.CpuUsage;
    resourceUsage: NodeJS.ResourceUsage | string;
}

// 🩺 Full health check response
export interface HealthCheckResponse {
    status: "healthy" | "degraded" | "unhealthy";
    message: string;
    timestamp: string;
    responseTime: string;
    environment: string;
    uptime: string;
    checks: {
        database: DatabaseHealth;
    };
    process: ProcessInfo;
    system: SystemInfo;
    detailed?: DetailedHealthInfo;
}
