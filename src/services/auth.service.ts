import { admin, userTypes } from "../config";
import { IUser } from "../models";
import { IAdmin, IClient } from "../models/user.model";
import { UserRepository } from "../repositories";
import { RegisterRequest } from "../types";

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
        data: RegisterRequest,
        routeType: string
    ): Promise<IClient | IAdmin> {
        const user: Partial<IUser> = {
            ...createNewUserObject(newUser),
            ...data,
        };
        if (routeType === userTypes.CLIENT) {
            return UserRepository.createClient(user);
        } else {
            return UserRepository.createAdmin(user);
        }
    }
}
