import httpStatus from "http-status";

import { firebaseAdmin, S3Folders, userTypes } from "@config";
import { S3Service } from "@microservices";
import { IClient, IAdmin, IUser } from "@models";
import {
  UserRepository,
  AdminRepository,
  ClientRepository,
} from "@repositories";
import { RegisterRequest } from "@types";
import { ApiError } from "@utils";

const createNewUserObject = (newUser: firebaseAdmin.auth.DecodedIdToken) => ({
  email: newUser.email,
  firebaseUid: newUser.uid,
  isEmailVerified: newUser.isEmailVerified,
  firebaseSignInProvider: newUser.firebase.sign_in_provider,
});

import { Service } from "typedi";

@Service()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
    private readonly adminRepository: AdminRepository,
    private readonly clientRepository: ClientRepository,
  ) {}

  async getUserByFirebaseUid(
    id: string,
  ): Promise<IClient | IAdmin | IUser | null> {
    const user = await this.userRepository.getUserByFirebaseUId(id);
    if (!user) return null;
    if (user.__t == "Client") {
      return user as IClient;
    } else if (user.__t == "Admin") {
      return user as IAdmin;
    } else {
      return user as IUser;
    }
  }

  async register(
    newUser: firebaseAdmin.auth.DecodedIdToken,
    payload: RegisterRequest,
    routeType: string,
    profilePic: string | undefined,
  ): Promise<IClient | IAdmin> {
    const existingUser = await this.userRepository.findOne({
      username: payload.username,
    });
    if (existingUser) {
      throw new ApiError(httpStatus.CONFLICT, "Username not available");
    }

    let user: Partial<IUser> = {
      ...createNewUserObject(newUser),
      ...payload,
    };

    if (profilePic) {
      const uploadedImage = await this.s3Service.uploadOnS3(
        profilePic,
        S3Folders.profilePics,
      );
      if (uploadedImage) {
        user = { ...user, ...uploadedImage };
      }
    }

    if (routeType === userTypes.CLIENT) {
      return this.clientRepository.create(user as IClient);
    } else {
      return this.adminRepository.create(user as IAdmin);
    }
  }
}
