import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ParsedQs } from "qs";

import { admin } from "@config";
import { IUser, IClient, IAdmin } from "@models";
import { AuthService } from "@services";
import { ApiError } from "@utils";

export interface AuthRequest<T = any, U extends ParsedQs = ParsedQs> extends Request {
    user?: IUser | IClient | IAdmin;
    newUser?: admin.auth.DecodedIdToken;
    routeType?: string;
    body: T;
    query: U;
}

export interface CustomRequest<T = any, U extends ParsedQs = ParsedQs> extends Request {
    user?: IUser | IClient | IAdmin;
    newUser?: admin.auth.DecodedIdToken;
    routeType?: string;
    body: T;
    query: U;
}

export const firebaseAuth =
    (allowUserType: string = "All") =>
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.header("Authorization")?.split(" ")[1];

            if (!token) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Please Authenticate!");
            }

            const payload = await admin.auth().verifyIdToken(token, true);
            const user = await AuthService.getUserByFirebaseUid(payload.uid);

            if (!user) {
                if (["/register"].includes(req.path) || req.path.includes("secret-register")) {
                    req.newUser = payload;
                    req.routeType = allowUserType;
                } else {
                    throw new ApiError(
                        httpStatus.NOT_FOUND,
                        "User doesn't exist. Please create account"
                    );
                }
            } else {
                if (!allowUserType.split(",").includes(user.__t) && allowUserType !== "All") {
                    throw new ApiError(httpStatus.FORBIDDEN, "Sorry, but you can't access this");
                }

                if (user.__t === "Client") {
                    const client = user as IClient;

                    if (client.isBlocked) {
                        throw new ApiError(httpStatus.FORBIDDEN, "User is blocked");
                    }

                    if (client.isDeleted) {
                        throw new ApiError(httpStatus.GONE, "User doesn't exist anymore");
                    }
                }

                req.user = user;
            }

            next();
        } catch (err: any) {
            if (err.code === "auth/id-token-expired") {
                return next(new ApiError(httpStatus.UNAUTHORIZED, "Session is expired"));
            }

            console.error("FirebaseAuthError:", err);
            next(new ApiError(httpStatus.UNAUTHORIZED, "Failed to authenticate"));
        }
    };
