import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { UnauthorizedException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';

export interface AuthenticatedRequest extends Request {
    user?: any; 
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    } else {
        try {
            const payload = jwt.verify(token, JWT_SECRET) as any;
            const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });
            if (!user) {
                return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
            } else {
                req.user = user; 
                return next(); 
            }
        } catch (error) {
            return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
        }
    }
};

export default authMiddleware;
