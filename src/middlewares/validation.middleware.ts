import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import httpStatus from "http-status";
import { pick, ApiError } from "../utils";

type ValidationSchema = Partial<{
    params: ObjectSchema;
    query: ObjectSchema;
    body: ObjectSchema;
    files: ObjectSchema;
    file: ObjectSchema;
}>;

export const validate =
    (schema: ValidationSchema) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // Check if request content type is JSON
        const isJsonContentType = req.is("application/json");

        // Check if request content type is form-data
        const isFormDataContentType = req.is("multipart/form-data");

        // Reject requests with unsupported content types
        if (
            Object.keys(req.body || {}).length !== 0 &&
            !isJsonContentType &&
            !isFormDataContentType
        ) {
            return next(
                new ApiError(
                    httpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Unsupported content type. Only JSON and form-data are supported."
                )
            );
        }

        // cherry-pick fields from the input schema ["params", "query", "body", "files", "file"]
        const validSchema = pick(schema, ["params", "query", "files", "file", "body"] as const);

        const object = pick(req, Object.keys(validSchema) as Array<keyof typeof validSchema>);

        // Compile schema to Joi schema object and validate the request object
        const { value, error } = Joi.compile(validSchema)
            .prefs({ errors: { label: "key" } })
            .validate(object);

        if (error) {
            console.log("🚀 ~ validate ~ error:", req.body, req.files, error);
        }

        // If validation fails, throw 400 Bad Request error
        if (error) {
            // cleanup files buffer if exist upon validation failing
            if (req.file) {
                req.file.buffer = Buffer.from([]);
            } else if (Array.isArray(req.files)) {
                req.files.forEach((file) => {
                    file.buffer = Buffer.from([]);
                });
            } else if (req.files && typeof req.files === "object") {
                Object.keys(req.files).forEach((key) => {
                    (req.files as Record<string, Express.Multer.File[]>)[key].forEach((file) => {
                        file.buffer = Buffer.from([]);
                    });
                });
            }

            const errorMessage = error.details.map((details) => details.message).join(", ");
            return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        }

        // Update validated fields in request with returned value
        Object.assign(req, value);

        return next();
    };
