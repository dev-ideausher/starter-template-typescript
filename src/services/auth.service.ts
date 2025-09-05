import { EmailService, OAuthService } from "../microservices";
import { IUser, User } from "../models";
import { AuthResponse } from "../types/auth.types";
import { ApiError, JWTUtils } from "../utils";

export class AuthService {
    static async sendVerificationEmail(email: string): Promise<void> {
        const verificationCode = EmailService.generateVerificationCode();
        await EmailService.storeVerificationCode(email, verificationCode);
        await EmailService.sendVerificationEmail(email, verificationCode);
    }

    static async verifyEmail(email: string, code: string): Promise<AuthResponse> {
        const isValid = await EmailService.verifyCode(email, code);

        if (!isValid) {
            throw new ApiError(400, "Invalid or expired verification code");
        }

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                isEmailVerified: true,
                isProfileComplete: false,
            });
            await user.save();
        } else {
            user.isEmailVerified = true;
            await user.save();
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

        let user = await User.findOne({
            $or: [{ email: payload.email }, { "providers.google.id": payload.sub }],
        });

        if (!user) {
            // Create new user with incomplete profile
            user = new User({
                email: payload.email,
                avatar: payload.picture,
                isEmailVerified: payload.email_verified,
                isProfileComplete: false,
                providers: {
                    google: {
                        id: payload.sub,
                        email: payload.email,
                    },
                },
            });
            await user.save();
        } else {
            // Update existing user with Google provider if not already linked
            user = await User.findOneAndUpdate(
                { _id: user._id },
                {
                    $set: {
                        "providers.google": {
                            id: payload.sub,
                            email: payload.email,
                        },
                        ...(payload.email_verified ? { isEmailVerified: true } : {}),
                    },
                },
                { new: true }
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

    static async appleOAuth(
        idToken: string,
        userInfo?: { name: { firstName: string; lastName: string } }
    ): Promise<AuthResponse> {
        const payload = await OAuthService.verifyAppleToken(idToken);

        let user = await User.findOne({
            $or: [{ email: payload.email }, { "providers.apple.id": payload.sub }],
        });

        if (!user) {
            // Create new user with incomplete profile
            user = new User({
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
            user = await User.findOneAndUpdate(
                { _id: user._id },
                {
                    $set: {
                        "providers.apple": {
                            id: payload.sub,
                            email: payload.email,
                        },
                        ...(payload.email_verified ? { isEmailVerified: true } : {}),
                    },
                },
                { new: true }
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
}
