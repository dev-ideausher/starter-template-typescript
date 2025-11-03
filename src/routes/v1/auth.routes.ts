import { Router } from "express";

import { userTypes } from "@config";
import { AuthController } from "@controllers";
import { firebaseAuth, upload, validate } from "@middlewares";
import { AuthSchema } from "@validators";

const router = Router();

router.post(
    "/register",
    firebaseAuth(userTypes.CLIENT),
    upload.single("avatar"),
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
