import { Router } from "express";
import { UserController } from "../controllers";
import { verifyJWT, validate, upload } from "../middlewares";
import { UserSchema } from "../validators";

const router = Router();

router.get(
    "/username-available/:username",
    validate(UserSchema.checkUsername),
    UserController.checkUsername
);

router.patch(
    "/complete-profile",
    verifyJWT,
    upload.single("avatar"),
    validate(UserSchema.completeProfile),
    UserController.completeProfile
);

router.patch(
    "/edit-profile",
    verifyJWT,
    upload.single("avatar"),
    validate(UserSchema.editProfile),
    UserController.editProfile
);

router.get("/profile", verifyJWT, UserController.getProfile);

export default router;
