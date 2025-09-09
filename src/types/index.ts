import {
    GoogleTokenPayload,
    AppleTokenPayload,
    EmailVerificationRequest,
    RefreshTokenResponse,
    AuthResponse,
    SendEmailRequest,
    OAuthRequest,
    RefreshTokensRequest,
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
    EmailVerificationRequest,
    CompleteProfileData,
    RefreshTokenResponse,
    SendEmailRequest,
    OAuthRequest,
    RefreshTokensRequest,
};
