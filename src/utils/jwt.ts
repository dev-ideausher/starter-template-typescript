import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";
import { config } from "../config";

export class JWTUtils {
    static generateAccessToken = (payload: JWTPayload): string => {
        const options: jwt.SignOptions = {
            expiresIn: config.jwt.accessExpiry,
        };
        const secret = config.jwt.accessSecret;
        return jwt.sign(payload, secret, options);
    };

    static generateRefreshToken = (payload: JWTPayload): string => {
        const options: jwt.SignOptions = {
            expiresIn: config.jwt.refreshExpiry,
        };
        const secret = config.jwt.refreshSecret;
        return jwt.sign(payload, secret, options);
    };

    static verifyAccessToken = (token: string): JWTPayload => {
        return jwt.verify(token, config.jwt.accessSecret) as JWTPayload;
    };

    static verifyRefreshToken = (token: string): JWTPayload => {
        return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
    };
}
