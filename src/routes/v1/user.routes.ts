import { Router } from "express";

import { UserController } from "@controllers";
import {
    // firebaseAuth,
    upload,
    validate
} from "@middlewares";
import { UserSchema } from "@validators";

const router = Router();

router.get(
    "/username-available/:username",
    validate(UserSchema.checkUsername),
    UserController.checkUsername
);

router.patch(
    "/updateDetails",
    // firebaseAuth(userTypes.ALL),
    upload.single("avatar"),
    validate(UserSchema.editProfile),
    UserController.updateUser
);

export default router;
