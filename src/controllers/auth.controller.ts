import { Response } from "express";
import { AuthService } from "../services";
import { ApiError, ApiResponse, asyncHandler } from "../utils";
import { CustomRequest } from "../middlewares";
import { RegisterRequest } from "../types";
import httpStatus from "http-status";

export class AuthController {
    static register = asyncHandler(async (req: CustomRequest<RegisterRequest>, res: Response) => {
        if (req.user) {
            throw new ApiError(409, "User already registered");
        }
        const user = await AuthService.register(
            req.newUser!,
            req.body,
            req.routeType!,
            req.file?.path
        );
        return res
            .status(httpStatus.CREATED)
            .json(new ApiResponse(httpStatus.CREATED, user, "User registered successfull y"));
    });

    static login = asyncHandler(async (req: CustomRequest, res: Response) => {
        return res
            .status(httpStatus.OK)
            .json(new ApiResponse(httpStatus.OK, req.user, "User logged in successfully"));
    });
}
