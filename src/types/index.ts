import {
    GoogleTokenPayload,
    AppleTokenPayload,
    EmailVerificationData,
    RefreshTokenResponse,
    AuthResponse,
} from "./auth.types";
import { Avatar, CompleteProfileData, EditProfileData } from "./user.types";

interface JWTPayload {
    id: string;
    email: string;
}

export {
    Avatar,
    JWTPayload,
    AuthResponse,
    GoogleTokenPayload,
    AppleTokenPayload,
    EditProfileData,
    EmailVerificationData,
    CompleteProfileData,
    RefreshTokenResponse,
};
