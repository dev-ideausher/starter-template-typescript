import { Response, Request } from "express";
import { AuthRequest } from "../middlewares";
import { UserService } from "../services";
import { asyncHandler } from "../utils";

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

        res.status(200).json({
            success: true,
            message: "Profile completed successfully",
            data: {
                user,
                access_token,
                refresh_token,
            },
        });
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

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user,
            },
        });
    });

    static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const user = req.user!;

        await UserService.checkProfileComplete(user);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    avatar: user.avatar,
                    isEmailVerified: user.isEmailVerified,
                    isProfileComplete: user.isProfileComplete,
                    providers: user.providers,
                },
            },
        });
    });

    static checkUsername = asyncHandler(async (req: Request, res: Response) => {
        const { username } = req.params;

        const userExits = await UserService.checkIfUsernameExists(username);

        res.status(200).json({
            success: true,
            data: {
                available: !userExits,
            },
        });
    });
}
