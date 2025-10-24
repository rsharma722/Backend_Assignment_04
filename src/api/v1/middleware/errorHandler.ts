import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { HTTP } from "../../../constants/http";
import { errorResponse } from "../models/responseModel";

const errorHandler = (
err: Error | null,
req: Request,
res: Response,
_next: NextFunction
): void => {
if (!err) {
    res
    .status(HTTP.INTERNAL_SERVER_ERROR)
    .json(errorResponse("An unexpected error occurred", "UNKNOWN_ERROR"));
    return;
}

if (process.env.NODE_ENV !== "test") {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.error(err.stack || err.message);
}

if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message, err.code));
    return;
}

res
    .status(HTTP.INTERNAL_SERVER_ERROR)
    .json(errorResponse("An unexpected error occurred", "UNKNOWN_ERROR"));
};

export default errorHandler;

export const notFound = (req: Request, res: Response) => {
res
    .status(HTTP.NOT_FOUND)
    .json(errorResponse(`Route ${req.method} ${req.originalUrl} not found`, "NOT_FOUND"));
};