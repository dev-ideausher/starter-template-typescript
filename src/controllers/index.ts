import { Container } from "typedi";


import { AuthController } from "./auth.controller.js";
import { UserController } from "./user.controller.js";

const authController = Container.get(AuthController);
const userController = Container.get(UserController);

export { authController, userController };
