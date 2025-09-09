import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envSchema = Joi.object({
    PORT: Joi.number().default(8000),
    CORS: Joi.string().default("*"),
    NODE_ENV: Joi.string().required(),
    MONGODB_URI: Joi.string().uri().required(),
    MONGODB_DBNAME: Joi.string().required(),

    FIREBASE_PROJECT_ID: Joi.string().required(),
    FIREBASE_PRIVATE_KEY: Joi.string().required(),
    FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),

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
    cors: envVars.CORS,
    mongodb: {
        uri: envVars.MONGODB_URI,
        dbName: envVars.MONGODB_DBNAME,
    },
    firebase: {
        projectId: envVars.FIREBASE_PROJECT_ID,
        privateKey: envVars.FIREBASE_PRIVATE_KEY,
        clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
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

