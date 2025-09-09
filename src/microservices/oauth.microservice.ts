import { OAuth2Client } from "google-auth-library";
import appleSigninAuth from "apple-signin-auth";
import { GoogleTokenPayload, AppleTokenPayload } from "../types";
import { config } from "../config";
import { ApiError } from "../utils";

export class OAuthService {
    private static googleClient = new OAuth2Client(config.google.clientId);

    static async verifyGoogleToken(idToken: string): Promise<GoogleTokenPayload> {
        const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new ApiError(400, "Invalid Google token");
        }

        return {
            sub: payload.sub,
            email: payload.email!,
            email_verified: payload.email_verified!,
            given_name: payload.given_name!,
            family_name: payload.family_name!,
            picture: payload.picture,
        };
    }

    static async verifyAppleToken(idToken: string): Promise<AppleTokenPayload> {
        try {
            const payload = await appleSigninAuth.verifyIdToken(idToken, {
                audience: config.apple.clientId,
                ignoreExpiration: false,
            });

            return {
                sub: payload.sub,
                email: payload.email,
                email_verified: payload.email_verified === "true",
            };
        } catch (error) {
            throw new Error("Apple token verification failed");
        }
    }
}
