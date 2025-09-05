import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envSchema = Joi.object({
    PORT: Joi.number().default(8000),
    NODE_ENV: Joi.string().required(),
    MONGODB_URI: Joi.string().uri().required(),
    MONGODB_DBNAME: Joi.string().required(),

    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRY: Joi.string().default("2d"),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRY: Joi.string().default("10d"),

    FIREBASE_PROJECT_ID: Joi.string().required(),
    FIREBASE_PRIVATE_KEY: Joi.string().required(),
    FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),

    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),

    APPLE_CLIENT_ID: Joi.string().required(),
    APPLE_TEAM_ID: Joi.string().required(),
    APPLE_KEY_ID: Joi.string().required(),
    APPLE_PRIVATE_KEY: Joi.string().required(),

    SMTP_HOST: Joi.string().default("smtp.gmail.com"),
    SMTP_PORT: Joi.number().default(587),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),

    CLOUDINARY_CLOUD_NAME: Joi.string().required(),
    CLOUDINARY_API_KEY: Joi.string().required(),
    CLOUDINARY_API_SECRET: Joi.string().required(),

    AWS_S3_BUCKET: Joi.string().required(),
    AWS_S3_REGION: Joi.string().required(),
    AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
    AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
}).unknown(); // allow extra env vars

const { value: envVars, error } = envSchema.validate(process.env, {
    abortEarly: false,
});

if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
}

const config = {
    port: envVars.PORT,
    nodeEnv: envVars.NODE_ENV,
    mongodb: {
        uri: envVars.MONGODB_URI,
        dbName: envVars.MONGODB_DBNAME,
    },
    jwt: {
        accessSecret: envVars.JWT_ACCESS_SECRET,
        accessExpiry: envVars.JWT_ACCESS_EXPIRY,
        refreshSecret: envVars.JWT_REFRESH_SECRET,
        refreshExpiry: envVars.JWT_REFRESH_EXPIRY,
    },
    firebase: {
        projectId: envVars.FIREBASE_PROJECT_ID,
        privateKey: envVars.FIREBASE_PRIVATE_KEY,
        clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
    },
    google: {
        clientId: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    },
    apple: {
        clientId: envVars.APPLE_CLIENT_ID,
        teamId: envVars.APPLE_TEAM_ID,
        keyId: envVars.APPLE_KEY_ID,
        privateKey: envVars.APPLE_PRIVATE_KEY,
    },
    email: {
        host: envVars.SMTP_HOST,
        port: envVars.SMTP_PORT,
        user: envVars.SMTP_USER,
        pass: envVars.SMTP_PASS,
    },
    cloudinary: {
        cloudName: envVars.CLOUDINARY_CLOUD_NAME,
        apiKey: envVars.CLOUDINARY_API_KEY,
        apiSecret: envVars.CLOUDINARY_API_SECRET,
    },
    aws: {
        s3: {
            bucket: envVars.AWS_S3_BUCKET,
            region: envVars.AWS_S3_REGION,
            accessKeyId: envVars.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: envVars.AWS_S3_SECRET_ACCESS_KEY,
        },
    },
};

export default config;

