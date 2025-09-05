import { GoogleTokenPayload, AppleTokenPayload, EmailVerificationData } from "./auth.types";
import { Avatar, CompleteProfileData, EditProfileData } from "./user.types";

interface JWTPayload {
    id: string;
    email: string;
}

export {
    Avatar,
    JWTPayload,
    GoogleTokenPayload,
    AppleTokenPayload,
    EditProfileData,
    EmailVerificationData,
    CompleteProfileData,
};
