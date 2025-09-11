import { AuthRequest } from "#middlewares";
import { UserService } from "#services";
import { asyncHandler, ApiResponse } from "#utils";
import { Response, Request } from "express";
import httpStatus from "http-status";

export class UserController {
    static checkUsername = asyncHandler(async (req: Request, res: Response) => {
        const { username } = req.params;

        const userExits = await UserService.checkIfUsernameExists(username);

        res.status(httpStatus.OK).json(
            new ApiResponse(
                httpStatus.OK,
                {
                    available: !userExits,
                },
                "Username availablility checked successfully"
            )
        );
    });

    static updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
        const user = await UserService.updateUser(req.user!, req.body, req.file?.path);
        return res
            .status(httpStatus.OK)
            .json(new ApiResponse(httpStatus.OK, user, "User updated successfully"));
    });
}
