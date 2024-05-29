import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';

export interface AuthenticatedRequest extends Request {
    user?: any; 
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user
    if(user.role == 'ADMIN'){
        next()
    }
    else {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }

}
export default authMiddleware;
