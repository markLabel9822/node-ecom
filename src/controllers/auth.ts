import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { BadRequestsException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';
import { SignUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';


interface AuthenticatedRequest extends Request {
    user?: any; 
}



export const signup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

 
        SignUpSchema.parse(req.body);
        const { email, password, name } = req.body;

        let user = await prismaClient.user.findFirst({ where: { email } });
        if (user) {
            throw new BadRequestsException('User already exists!', ErrorCode.USER_ALREADY_EXISTS);
        }

        user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10)
            }
        });

        res.json(user);
    } catch (error) {
       console.log('error test')
    }
};

export const login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        let user = await prismaClient.user.findFirst({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND);
        }
        if (!compareSync(password, user.password)) {
            throw new BadRequestsException('Incorrect password', ErrorCode.INCORRECT_PASSWORD);
        }
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET);

        res.json({ user, token });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        res.json(user);
    } catch (error) {
        next(error);
    }
};