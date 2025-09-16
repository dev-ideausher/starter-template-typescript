import { S3Folders } from "@config";
import { S3Service } from "@microservices";
import { IUser } from "@models";
import { UserRepository } from "@repositories";
import { UpdateUserRequest } from "@types";
import { ApiError } from "@utils";
import httpStatus from "http-status";

export class UserService {
    static async checkIfUsernameExists(username: string): Promise<boolean> {
        const existingUsername = await UserRepository.findOne({ username });
        return !existingUsername;
    }

    static async updateUser(
        user: IUser,
        payload: UpdateUserRequest,
        profilePic: string | undefined
    ): Promise<IUser> {
        const existingUser = await UserRepository.findOne({ username: payload.username });
        if (existingUser) {
            throw new ApiError(httpStatus.CONFLICT, "Username not available");
        }

        let updates = { ...payload };
        if (profilePic) {
            const uploadedImage = await S3Service.uploadOnS3(S3Folders.profilePics, profilePic);

            if (user.avatar) {
                await S3Service.deleteFromS3(user.avatar.id);
            }

            if (uploadedImage) {
                updates = { ...updates, ...uploadedImage };
            }
        }

        const updatedUser = await UserRepository.findByIdAndUpdate(user._id, updates);
        if (!updatedUser) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
        return updatedUser;
    }
}
