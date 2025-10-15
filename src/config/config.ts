import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
    .object({
        PORT: z.coerce.number().default(8000),
        CORS: z.string().default("*"),
        NODE_ENV: z.string().min(1, "NODE_ENV is required"),

        MONGODB_URI: z.string().url("MONGODB_URI must be a valid URI"),
        MONGODB_DBNAME: z.string().min(1, "MONGODB_DBNAME is required"),

        FIREBASE_PROJECT_ID: z.string().min(1, "FIREBASE_PROJECT_ID is required"),
        FIREBASE_PRIVATE_KEY: z.string().min(1, "FIREBASE_PRIVATE_KEY is required"),
        FIREBASE_CLIENT_EMAIL: z.string().email("FIREBASE_CLIENT_EMAIL must be a valid email"),

        AWS_S3_BUCKET: z.string().min(1, "AWS_S3_BUCKET is required"),
        AWS_S3_REGION: z.string().min(1, "AWS_S3_REGION is required"),
        AWS_S3_ACCESS_KEY_ID: z.string().min(1, "AWS_S3_ACCESS_KEY_ID is required"),
        AWS_S3_SECRET_ACCESS_KEY: z.string().min(1, "AWS_S3_SECRET_ACCESS_KEY is required"),
    })
    .loose(); // allows unknown env vars like Joi’s .unknown()

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const message = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
    throw new Error(`Environment validation error: ${message}`);
}

const env = parsed.data;

export const config = {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    cors: env.CORS,
    mongodb: {
        uri: env.MONGODB_URI,
        dbName: env.MONGODB_DBNAME,
    },
    firebase: {
        projectId: env.FIREBASE_PROJECT_ID,
        privateKey: env.FIREBASE_PRIVATE_KEY,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
    },
    aws: {
        s3: {
            bucket: env.AWS_S3_BUCKET,
            region: env.AWS_S3_REGION,
            accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
        },
    },
};

export default config;
