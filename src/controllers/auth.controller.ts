import { Response } from "express";
import httpStatus from "http-status";

import { AuthRequest } from "@middlewares";
import { AuthService } from "@services";
import { RegisterRequest } from "@types";
import { asyncHandler, ApiError, sendResponse } from "@utils";

export class AuthController {
    static register = asyncHandler(async (req: AuthRequest<RegisterRequest>, res: Response) => {
        if (req.user) {
            throw new ApiError(409, "User already registered");
        }
        const user = await AuthService.register(
            req.newUser!,
            req.body,
            req.routeType!,
            req.file?.path
        );
        return sendResponse(res, httpStatus.OK, user, "User registered successfully");
    });

    static login = asyncHandler(async (req: AuthRequest, res: Response) => {
        return sendResponse(res, httpStatus.OK, req.user, "User logged in successfully");
    });
}
