import { Response, Request } from "express";
import httpStatus from "http-status";

import { AuthRequest } from "@middlewares";
import { UserService } from "@services";
import { asyncHandler, sendResponse } from "@utils";

import { Service } from "typedi";

@Service()
export class UserController {
    constructor(private readonly userService: UserService) {}

    checkUsername = asyncHandler(async (req: Request, res: Response) => {
        const { username } = req.params;

        const userExits = await this.userService.checkIfUsernameExists(username);

        return sendResponse(
            res,
            httpStatus.OK,
            { available: !userExits },
            "Username checked successfully!"
        );
    });

    updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
        const user = await this.userService.updateUser(req.user!, req.body, req.file?.path);
        return sendResponse(res, httpStatus.OK, user, "User updated successfully");
    });
}
