import { Router } from "express";
import { UserController } from "../controllers";
import { verifyJWT, validate, upload } from "../middlewares";
import { UserSchemas } from "../validators";

const router = Router();

router.get("/username-available/:username", UserController.checkUsername);

// router.patch(
//     "/complete-profile",
//     verifyJWT,
//     upload.single("avatar"),
//     validate(UserSchemas.completeProfile),
//     UserController.completeProfile
// );

// router.patch(
//     "/edit-profile",
//     verifyJWT,
//     upload.single("avatar"),
//     validate(UserSchemas.editProfile),
//     UserController.editProfile
// );

router.get("/profile", verifyJWT, UserController.getProfile);

export default router;
