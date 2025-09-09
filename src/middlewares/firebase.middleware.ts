import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { admin } from "../config";
import { ApiError } from "../utils";
import { AuthService } from "../services";
import { ParsedQs } from "qs";
import { IUser, IClient, IAdmin } from "../models";

declare module "express-serve-static-core" {
    interface Request {
        user?: IUser;
        newUser?: admin.auth.DecodedIdToken;
        routeType?: string;
    }
}

export interface AuthRequest<T = any, U extends ParsedQs = ParsedQs> extends Request {
    user?: IUser | IClient | IAdmin;
    newUser: admin.auth.DecodedIdToken;
    routeType: string;
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
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            const token = req.header("Authorization")?.split(" ")[1];

            // No token
            if (!token) {
                return reject(new ApiError(httpStatus.BAD_REQUEST, "Please Authenticate!"));
            }

            try {
                const payload = await admin.auth().verifyIdToken(token, true);
                const user = await AuthService.getUserByFirebaseUid(payload.uid);

                if (!user) {
                    // Allow registration routes
                    if (["/register"].includes(req.path) || req.path.includes("secret-register")) {
                        req.newUser = payload;
                        req.routeType = allowUserType;
                    } else {
                        return reject(
                            new ApiError(
                                httpStatus.NOT_FOUND,
                                "User doesn't exist. Please create account"
                            )
                        );
                    }
                } else {
                    // Restrict user type if needed
                    if (!allowUserType.split(",").includes(user.__t) && allowUserType !== "All") {
                        return reject(
                            new ApiError(httpStatus.FORBIDDEN, "Sorry, but you can't access this")
                        );
                    }

                    if (user.__t === "Client") {
                        const client = user as IClient;
                        if (client.isBlocked) {
                            return reject(new ApiError(httpStatus.FORBIDDEN, "User is blocked"));
                        }

                        if (client.isDeleted) {
                            return reject(
                                new ApiError(httpStatus.GONE, "User doesn't exist anymore")
                            );
                        }
                    }

                    req.user = user;
                }

                resolve();
            } catch (err: any) {
                if (err.code === "auth/id-token-expired") {
                    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Session is expired"));
                }
                console.error("FirebaseAuthError:", err);
                reject(new ApiError(httpStatus.UNAUTHORIZED, "Failed to authenticate"));
            }
        })
            .then(() => next())
            .catch((err) => next(err));
    };
