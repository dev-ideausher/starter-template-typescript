import { Router } from "express";
import { AuthController } from "../controllers";
import { validate } from "../middlewares";
import { AuthSchema } from "../validators";
import { firebaseAuth } from "../middlewares/firebase.middleware";
import { userTypes } from "../config";

const router = Router();

router.post(
    "/register",
    firebaseAuth(userTypes.CLIENT),
    validate(AuthSchema.register),
    AuthController.register
);

router.post(
    "/admin-secret-register",
    firebaseAuth(userTypes.ADMIN),
    validate(AuthSchema.register),
    AuthController.register
);

router.post("/login", firebaseAuth(userTypes.ALL), AuthController.login);

export default router;
