import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";
import httpStatus from "http-status";
import { ApiError, pick } from "@utils";

type ValidationSchema = Partial<{
    params: ZodObject<any>;
    query: ZodObject<any>;
    body: ZodObject<any>;
    files: ZodObject<any>;
    file: ZodObject<any>;
}>;

export const validate =
    (schema: ValidationSchema) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const isJsonContentType = req.is("application/json");
        const isFormDataContentType = req.is("multipart/form-data");

        // Reject unsupported content types
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

        // Pick only defined schema parts
        const validSchema = pick(schema, ["params", "query", "files", "file", "body"] as const);
        const object = pick(req, Object.keys(validSchema) as Array<keyof typeof validSchema>);

        try {
            // Validate each defined part using Zod
            for (const key of Object.keys(validSchema) as Array<keyof typeof validSchema>) {
                if (validSchema[key]) {
                    const result = validSchema[key]!.parse(object[key]);
                    Object.assign(req, { [key]: result });
                }
            }

            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                // Cleanup uploaded files if validation fails
                if (req.file) {
                    req.file.buffer = Buffer.from([]);
                } else if (Array.isArray(req.files)) {
                    req.files.forEach((file) => (file.buffer = Buffer.from([])));
                } else if (req.files && typeof req.files === "object") {
                    Object.keys(req.files).forEach((key) => {
                        (req.files as Record<string, Express.Multer.File[]>)[key].forEach(
                            (file) => (file.buffer = Buffer.from([]))
                        );
                    });
                }

                // ✅ Construct detailed error messages with key paths
                const errorMessage = err.issues
                    .map((issue) => {
                        const path = issue.path.join(".") || "(root)";
                        return `${path}: ${issue.message}`;
                    })
                    .join(", ");

                return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
            }

            return next(err);
        }
    };
