import { AuthRequest } from "#middlewares";
import { UserService } from "#services";
import { asyncHandler, sendResponse } from "#utils";
import { Response, Request } from "express";
import httpStatus from "http-status";

export class UserController {
    static checkUsername = asyncHandler(async (req: Request, res: Response) => {
        const { username } = req.params;

        const userExits = await UserService.checkIfUsernameExists(username);

        return sendResponse(
            res,
            httpStatus.OK,
            { available: !userExits },
            "Username checked successfully"
        );
    });

    static updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
        const user = await UserService.updateUser(req.user!, req.body, req.file?.path);
        return sendResponse(res, httpStatus.OK, user, "User updated successfully");
    });
}
