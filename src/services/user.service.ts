import { CloudinaryService } from "../microservices";
import { IUser, User } from "../models";
import { Avatar, CompleteProfileData, EditProfileData } from "../types";
import { AuthResponse } from "../types/auth.types";
import { ApiError, JWTUtils } from "../utils";

export class UserService {
    static async completeProfile(
        userId: string,
        profileData: CompleteProfileData
    ): Promise<AuthResponse> {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Check if username is already taken
        let existingUsername = null;

        if (profileData.username) {
            existingUsername = await User.findOne({
                username: profileData.username,
                _id: { $ne: userId },
            });
        }

        if (existingUsername) {
            throw new ApiError(400, "Username already taken");
        }

        let avatar: Avatar | null = null;

        if (profileData.avatarLocalPath) {
            const response = await CloudinaryService.uploadOnCloudinary(
                profileData.avatarLocalPath
            );
            if (response) {
                avatar = { id: response?.id, url: response?.url };
            }
        }

        const updates: Partial<CompleteProfileData> = {};

        for (const [key, value] of Object.entries(profileData)) {
            if (key === "avatarLocalFile") continue;
            if (value !== undefined) {
                (updates as any)[key] = value;
            }
        }

        if (avatar) {
            (updates as any)["avatar"] = avatar;
        }
        (updates as any)["isProfileComplete"] = true;

        if (user.avatar) {
            await CloudinaryService.deleteFromCloudinary(user.avatar.id);
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
        }).select("-providers -createdAt -updatedAt -__v");

        if (!updatedUser) {
            throw new ApiError(500, "Internal server error");
        }

        const access_token = JWTUtils.generateAccessToken({
            id: user._id.toString(),
            email: user.email,
        });
        const refresh_token = JWTUtils.generateRefreshToken({
            id: user._id.toString(),
            email: user.email,
        });
        return { access_token, refresh_token, user: updatedUser };
    }

    static async editProfile(
        userId: string,
        profileData: EditProfileData
    ): Promise<{ user: IUser }> {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Check if username is already taken
        let existingUsername = null;

        if (profileData.username) {
            existingUsername = await User.findOne({
                username: profileData.username,
                _id: { $ne: userId },
            });
        }

        if (existingUsername) {
            throw new ApiError(400, "Username already taken");
        }

        let avatar: Avatar | null = null;

        if (profileData.avatarLocalPath) {
            const response = await CloudinaryService.uploadOnCloudinary(
                profileData.avatarLocalPath
            );
            if (response) {
                avatar = { id: response?.id, url: response?.url };
            }
        }

        const updates: Partial<CompleteProfileData> = {};

        for (const [key, value] of Object.entries(profileData)) {
            if (key === "avatarLocalFile") continue;
            if (value !== undefined) {
                (updates as any)[key] = value;
            }
        }

        if (avatar) {
            (updates as any)["avatar"] = avatar;
        }
        (updates as any)["isProfileComplete"] = true;

        if (user.avatar) {
            await CloudinaryService.deleteFromCloudinary(user.avatar.id);
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
        }).select("-providers -createdAt -updatedAt -__v");

        if (!updatedUser) {
            throw new ApiError(500, "Internal server error");
        }

        return { user: updatedUser };
    }

    static async getUserProfile(userId: string): Promise<IUser> {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    static async checkProfileComplete(user: IUser): Promise<void> {
        if (!user.isProfileComplete) {
            throw new ApiError(400, "incomplete profile");
        }
    }

    static async checkIfUsernameExists(username: string): Promise<boolean> {
        const existingUsername = await User.findOne({
            username,
        });

        if (existingUsername) {
            return true;
        } else {
            return false;
        }
    }
}
