import { Router } from "express";
import authRoutes from "./v1/auth.routes.js";
import userRoutes from "./v1/user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
