import { admin, S3Folders, userTypes } from "#config";
import { S3Service } from "#microservices";
import { IClient, IAdmin, IUser } from "#models";
import { UserRepository } from "#repositories";
import { RegisterRequest } from "#types";
import { ApiError } from "#utils";
import httpStatus from "http-status";

const createNewUserObject = (newUser: admin.auth.DecodedIdToken) => ({
    email: newUser.email,
    firebaseUid: newUser.uid,
    isEmailVerified: newUser.isEmailVerified,
    firebaseSignInProvider: newUser.firebase.sign_in_provider,
});

export class AuthService {
    static async getUserByFirebaseUid(id: string): Promise<IClient | IAdmin | IUser | null> {
        const user = await UserRepository.getUserByFirebaseUId(id);
        if (!user) return null;
        if (user.__t == "Client") {
            return user as IClient;
        } else if (user.__t == "Admin") {
            return user as IAdmin;
        } else {
            return user as IUser;
        }
    }

    static async register(
        newUser: admin.auth.DecodedIdToken,
        payload: RegisterRequest,
        routeType: string,
        profilePic: string | undefined
    ): Promise<IClient | IAdmin> {
        const existingUser = await UserRepository.findOne({ username: payload.username });
        if (existingUser) {
            throw new ApiError(httpStatus.CONFLICT, "Username not available");
        }

        let user: Partial<IUser> = {
            ...createNewUserObject(newUser),
            ...payload,
        };

        if (profilePic) {
            const uploadedImage = await S3Service.uploadOnS3(S3Folders.profilePics, profilePic);
            if (uploadedImage) {
                user = { ...user, ...uploadedImage };
            }
        }

        if (routeType === userTypes.CLIENT) {
            return UserRepository.createClient(user);
        } else {
            return UserRepository.createAdmin(user);
        }
    }
}
