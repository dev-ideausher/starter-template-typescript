import { Request, Response, NextFunction } from "express";

const asyncHandler = <T>(
    requestHandler: (_req: Request, _res: Response, _next: NextFunction) => Promise<T>
) => {
    return (_req: Request, _res: Response, _next: NextFunction) => {
        Promise.resolve(requestHandler(_req, _res, _next)).catch(_next);
    };
};

export { asyncHandler };
