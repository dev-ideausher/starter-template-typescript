import { Response, Request } from "express";
import { AuthRequest } from "../middlewares";
import { UserService } from "../services";
import { ApiResponse, asyncHandler } from "../utils";

export class UserController {
    static completeProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { name, username } = req.body;
        const userId = req.user!._id.toString();

        const avatarLocalPath = req.file?.path;

        const { user, access_token, refresh_token } = await UserService.completeProfile(userId, {
            name,
            username,
            avatarLocalPath,
        });

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    user,
                    access_token,
                    refresh_token,
                },
                "Profile completed successfully"
            )
        );
    });

    static editProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { name, username } = req.body;
        const userId = req.user!._id.toString();

        const avatarLocalPath = req.file?.path;

        const { user } = await UserService.editProfile(userId, {
            name,
            username,
            avatarLocalPath,
        });

        res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
    });

    static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const user = req.user!;

        await UserService.checkProfileComplete(user);

        res.status(200).json(new ApiResponse(200, user, "User Profile fetched successfully"));
    });

    static checkUsername = asyncHandler(async (req: Request, res: Response) => {
        const { username } = req.params;

        const userExits = await UserService.checkIfUsernameExists(username);

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    available: !userExits,
                },
                "Username availablility checked successfully"
            )
        );
    });
}
