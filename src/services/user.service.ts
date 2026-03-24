import httpStatus from "http-status";

import { S3Folders } from "@config";
import { S3Service } from "@microservices";
import { IUser } from "@models";
import { UserRepository } from "@repositories";
import { UpdateUserRequest } from "@types";
import { ApiError } from "@utils";

import { Service } from "typedi";

@Service()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async checkIfUsernameExists(username: string): Promise<boolean> {
    const existingUsername = await this.userRepository.findOne({ username });
    return !existingUsername;
  }

  async updateUser(
    user: IUser,
    payload: UpdateUserRequest,
    profilePic: string | undefined,
  ): Promise<IUser> {
    const existingUser = await this.userRepository.findOne({
      username: payload.username,
    });
    if (existingUser) {
      throw new ApiError(httpStatus.CONFLICT, "Username not available");
    }

    let updates = { ...payload };
    if (profilePic) {
      const uploadedImage = await this.s3Service.uploadOnS3(
        profilePic,
        S3Folders.profilePics,
      );

      if (user.avatar) {
        await this.s3Service.deleteFromS3(user.avatar.id);
      }

      if (uploadedImage) {
        updates = { ...updates, ...uploadedImage };
      }
    }

    const updatedUser = await this.userRepository.findByIdAndUpdate(
      user!._id,
      updates,
    );
    if (!updatedUser) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal server error",
      );
    }
    return updatedUser;
  }
}
