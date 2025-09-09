import { Router } from "express";
import { UserController } from "../controllers";
import { validate, upload } from "../middlewares";
import { UserSchema } from "../validators";
import { firebaseAuth } from "../middlewares/firebase.middleware";
import { userTypes } from "../config";

const router = Router();

router.get(
    "/username-available/:username",
    validate(UserSchema.checkUsername),
    UserController.checkUsername
);

router.patch(
    "/updateDetails",
    firebaseAuth(userTypes.ALL),
    upload.single("avatar"),
    validate(UserSchema.editProfile),
    UserController.updateUser
);

export default router;
