import { Request, Response, NextFunction } from "express";
import { ErrorCode, HttpException } from "../exceptions/root";

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode).json({
        message: error.message,
        ErrorCode: error.errorCode,
        errors: error.errors
    });
};
