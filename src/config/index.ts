import config from "./config.js";
import { S3Folders, fileTypes, userTypes } from "./constants.js";
import { checkDatabaseHealth, connectDB } from "./db.js";
import { admin, auth } from "./firebaseAdmin.js";
import logger from "./logger.js";
import { swaggerSpec } from "./swagger.js";
import s3Client from "./awsS3.js";
import firebaseClientApp from "./firebaseClient.js";

export {
  S3Folders,
  admin as firebaseAdmin,
  auth as firebaseAdminAuth,
  checkDatabaseHealth,
  config,
  connectDB,
  fileTypes,
  logger,
  swaggerSpec,
  userTypes,
  s3Client,
  firebaseClientApp,
};
