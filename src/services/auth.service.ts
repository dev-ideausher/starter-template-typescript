import { EmailService, OAuthService } from "../microservices";
import { UserRepository } from "../repositories";
import { AuthResponse, RefreshTokenResponse } from "../types";
import { ApiError, JWTUtils } from "../utils";

export class AuthService {
    static async sendVerificationEmail(email: string): Promise<void> {
        const verificationCode = EmailService.generateVerificationCode();
        await EmailService.storeVerificationCode(email, verificationCode);
        await EmailService.sendVerificationEmail(email, verificationCode);
    }

    static async verifyEmail(email: string, code: string): Promise<AuthResponse> {
        const isValid = await EmailService.verifyCode(email, code);
        if (!isValid) throw new ApiError(400, "Invalid or expired verification code");

        let user = await UserRepository.findOne({ email });

        if (!user) {
            user = await UserRepository.create({
                email,
                isEmailVerified: true,
                isProfileComplete: false,
            });
        } else {
            user.isEmailVerified = true;
            user = await UserRepository.save(user);
        }

        const access_token = JWTUtils.generateAccessToken({
            id: user._id.toString(),
            email: user.email,
        });
        const refresh_token = JWTUtils.generateRefreshToken({
            id: user._id.toString(),
            email: user.email,
        });
        return { access_token, refresh_token, user };
    }

    static async googleOAuth(idToken: string): Promise<AuthResponse> {
        const payload = await OAuthService.verifyGoogleToken(idToken);

        let user = await UserRepository.findOne({
            $or: [{ email: payload.email }, { "providers.google.id": payload.sub }],
        });

        if (!user) {
            user = await UserRepository.create({
                email: payload.email,
                isEmailVerified: payload.email_verified,
                isProfileComplete: false,
                providers: { google: { id: payload.sub, email: payload.email } },
            });
        } else {
            user = await UserRepository.findOneAndUpdate(
                { _id: user._id },
                {
                    $set: {
                        "providers.google": { id: payload.sub, email: payload.email },
                        ...(payload.email_verified ? { isEmailVerified: true } : {}),
                    },
                }
            );
        }

        if (!user) throw new ApiError(500, "Internal server error");

        const access_token = JWTUtils.generateAccessToken({
            id: user._id.toString(),
            email: user.email,
        });
        const refresh_token = JWTUtils.generateRefreshToken({
            id: user._id.toString(),
            email: user.email,
        });
        return { access_token, refresh_token, user };
    }

    static async appleOAuth(idToken: string): Promise<AuthResponse> {
        const payload = await OAuthService.verifyAppleToken(idToken);

        let user = await UserRepository.findOne({
            $or: [{ email: payload.email }, { "providers.apple.id": payload.sub }],
        });

        if (!user) {
            // Create new user with incomplete profile
            user = await UserRepository.create({
                email: payload.email || `${payload.sub}@privaterelay.appleid.com`,
                isEmailVerified: payload.email_verified || false,
                isProfileComplete: false,
                providers: {
                    apple: {
                        id: payload.sub,
                        email: payload.email || "",
                    },
                },
            });
            await user.save();
        } else {
            // Update existing user with Apple provider if not already linked
            user = await UserRepository.findOneAndUpdate(
                { _id: user._id },
                {
                    $set: {
                        "providers.apple": {
                            id: payload.sub,
                            email: payload.email,
                        },
                        ...(payload.email_verified ? { isEmailVerified: true } : {}),
                    },
                }
            );
        }

        if (!user) {
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
        return { access_token, refresh_token, user };
    }

    static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        const user = JWTUtils.verifyRefreshToken(refreshToken);
        if (!user) {
            throw new ApiError(401, "Refresh token expired. Please login again.");
        }

        const access_token = JWTUtils.generateAccessToken({
            id: user.id.toString(),
            email: user.email,
        });
        const refresh_token = JWTUtils.generateRefreshToken({
            id: user.id.toString(),
            email: user.email,
        });

        return { access_token, refresh_token };
    }
}
