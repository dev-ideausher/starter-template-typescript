import { Response, Request } from "express";
import { UserService } from "../services";
import { asyncHandler, sendResponse } from "../utils";
import { AuthRequest } from "../middlewares";
import httpStatus from "http-status";

export class UserController {
    static checkUsername = asyncHandler(async (req: Request, res: Response) => {
        const { username } = req.params;

        const userExits = await UserService.checkIfUsernameExists(username);

        sendResponse(
            res,
            httpStatus.OK,
            {
                available: !userExits,
            },
            "Username availablility checked successfully"
        );
    });

    static updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
        const user = await UserService.updateUser(req.user!, req.body, req.file?.path);
        sendResponse(res, httpStatus.OK, user, "User updated successfully");
    });
}
