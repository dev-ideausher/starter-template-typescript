import { IUser } from "../models";

export interface GoogleTokenPayload {
    sub: string;
    email: string;
    email_verified: boolean;
    given_name: string;
    family_name: string;
    picture?: string;
}

export interface AppleTokenPayload {
    sub: string;
    email?: string;
    email_verified?: boolean;
}

export interface EmailVerificationRequest {
    email: string;
    code: string;
    expiresAt: Date;
}

export interface SendEmailRequest {
    email: string;
}

export interface OAuthRequest {
    idToken: string;
}

export interface RefreshTokensRequest {
    refreshToken: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: IUser;
}

export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}
