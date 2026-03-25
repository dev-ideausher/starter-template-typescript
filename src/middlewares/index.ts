import { errorHandler } from "./error.middleware.js";
import { firebaseAuth } from "./firebase.middleware.js";
import { successLogger, errorLogger } from "./morgan.middleware.js";
import { upload } from "./multer.middleware.js";
import { validate } from "./validation.middleware.js";
export type { AuthRequest, CustomRequest } from "./firebase.middleware.js";

export {
  validate,
  errorHandler,
  successLogger,
  errorLogger,
  firebaseAuth,
  upload,
};
