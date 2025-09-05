import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../models";
import { JWTUtils } from "../utils";

export interface AuthRequest extends Request {
    user?: IUser;
}

export const verifyJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        const decoded = JWTUtils.verifyAccessToken(token);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
