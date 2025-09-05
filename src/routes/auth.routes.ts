import { Router } from "express";
import { AuthController } from "../controllers";
import { validate } from "../middlewares";
import { AuthSchemas } from "../validators";

const router = Router();

// Public routes
router.post(
    "/send-verification",
    validate(AuthSchemas.sendVerification),
    AuthController.sendVerificationEmail
);
router.post("/verify-email", validate(AuthSchemas.emailVerification), AuthController.verifyEmail);
router.post("/oauth/google", validate(AuthSchemas.googleOAuth), AuthController.googleOAuth);
router.post("/oauth/apple", validate(AuthSchemas.appleOAuth), AuthController.appleOAuth);
router.post("/refresh-tokens", validate(AuthSchemas.refreshTokens), AuthController.refreshTokens);

export default router;
