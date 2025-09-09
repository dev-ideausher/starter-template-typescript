import { Response } from "express";
import { AuthService } from "../services";
import { ApiError, ApiResponse, asyncHandler } from "../utils";
import { CustomRequest } from "../middlewares/firebase.middleware";
import { RegisterRequest } from "../types";

export class AuthController {
    static register = asyncHandler(async (req: CustomRequest<RegisterRequest>, res: Response) => {
        if (req.user) {
            throw new ApiError(409, "User already registered");
        }
        if (!req.newUser || !req.routeType) {
            throw new ApiError(401, "Unauthorized request");
        }
        const user = await AuthService.register(req.newUser, req.body, req.routeType);
        return res.status(201).json(new ApiResponse(200, user, "User registered successfull y"));
    });

    static login = asyncHandler(async (req: CustomRequest, res: Response) => {
        return res.status(200).json(new ApiResponse(200, req.user, "User logged in successfully"));
    });
}
