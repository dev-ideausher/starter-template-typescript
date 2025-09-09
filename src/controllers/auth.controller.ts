import { Request, Response } from "express";
import { AuthService } from "../services";
import { ApiResponse, asyncHandler, JWTUtils } from "../utils";
import { CustomRequest } from "../middlewares/auth.middleware";
import {
    EmailVerificationRequest,
    OAuthRequest,
    RefreshTokensRequest,
    SendEmailRequest,
} from "../types";

export class AuthController {
    static sendVerificationEmail = asyncHandler(
        async (req: CustomRequest<SendEmailRequest>, res: Response) => {
            const { email } = req.body;

            await AuthService.sendVerificationEmail(email);

            res.status(200).json(new ApiResponse(200, {}, "Email verification sent successfully"));
        }
    );

    static verifyEmail = asyncHandler(
        async (req: CustomRequest<EmailVerificationRequest>, res: Response) => {
            const { email, code } = req.body;

            const { user, access_token, refresh_token } = await AuthService.verifyEmail(
                email,
                code
            );

            res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        access_token,
                        refresh_token,
                        requiresProfileCompletion: !user.isProfileComplete,
                    },
                    "Email verified successfully. Please complete your profile."
                )
            );
        }
    );

    static googleOAuth = asyncHandler(async (req: CustomRequest<OAuthRequest>, res: Response) => {
        const { idToken } = req.body;

        const { user, access_token, refresh_token } = await AuthService.googleOAuth(idToken);

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    access_token,
                    refresh_token,
                    requiresProfileCompletion: !user.isProfileComplete,
                },
                "Google authentication successfull"
            )
        );
    });

    static appleOAuth = asyncHandler(async (req: CustomRequest<OAuthRequest>, res: Response) => {
        const { idToken } = req.body;

        const { access_token, refresh_token, user } = await AuthService.appleOAuth(idToken);

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    access_token,
                    refresh_token,
                    requiresProfileCompletion: !user.isProfileComplete,
                },
                "Apple authentication successfull"
            )
        );
    });

    static refreshTokens = asyncHandler(
        async (req: CustomRequest<RefreshTokensRequest>, res: Response) => {
            const { refreshToken } = req.body;

            const { access_token, refresh_token } = await AuthService.refreshToken(refreshToken);
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        { access_token, refresh_token },
                        "Tokens refreshed successfully"
                    )
                );
        }
    );
}
