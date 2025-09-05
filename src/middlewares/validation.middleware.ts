import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ApiError } from "../utils";

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);

        if (error) {
            throw new ApiError(500, error.message);
        }

        next();
    };
};
