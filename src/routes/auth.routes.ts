import { Router } from "express";
import { AuthController } from "../controllers";
import { validate } from "../middlewares";
import { AuthSchema } from "../validators";

const router = Router();

// Public routes
router.post(
    "/send-verification",
    validate(AuthSchema.sendVerification),
    AuthController.sendVerificationEmail
);
router.post("/verify-email", validate(AuthSchema.emailVerification), AuthController.verifyEmail);
router.post("/oauth/google", validate(AuthSchema.googleOAuth), AuthController.googleOAuth);
router.post("/oauth/apple", validate(AuthSchema.appleOAuth), AuthController.appleOAuth);
router.post("/refresh-tokens", validate(AuthSchema.refreshTokens), AuthController.refreshTokens);

export default router;
