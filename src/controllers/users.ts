import { Request, Response, NextFunction } from "express";
import { AddressSchema, updateUserSchema} from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions//not-found"
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestsException } from "../exceptions/bad-requests";

interface AuthenticatedRequest extends Request {
    user?: any; 
}

export const addAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {    
        AddressSchema.parse(req.body);

        const address = await prismaClient.address.create({
            data: {
                ...req.body,
                userId: req.user.id
            }
        });
        
        res.json(address);
    } catch (error) {
        next(error);
    }
}

export const deleteAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        });
        res.json({ success: true });
    } catch (error) {
        next(new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND));
    }
}

export const listAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const addresses = await prismaClient.address.findMany({
            where: {
                userId: req.user.id
            }
        });
        res.json(addresses);
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const validatedData = updateUserSchema.parse(req.body);
        let shippingAddress: Address | null = null;
        let billingAddress: Address | null = null;

        if (validatedData.defaultShippingAddress) {
            try {
                shippingAddress = await prismaClient.address.findFirstOrThrow({
                    where: {
                        id: validatedData.defaultShippingAddress
                    }
                });
            } catch (error) {
                throw new NotFoundException('Shipping address not found.', ErrorCode.ADDRESS_NOT_FOUND);
            }

            if (shippingAddress.userId !== req.user.id) {
                throw new BadRequestsException('Shipping address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG);
            }
        }

        if (validatedData.defaultBillingAddress) {
            try {
                billingAddress = await prismaClient.address.findFirstOrThrow({
                    where: {
                        id: validatedData.defaultBillingAddress
                    }
                });
            } catch (error) {
                throw new NotFoundException('Billing address not found.', ErrorCode.ADDRESS_NOT_FOUND);
            }

            if (billingAddress.userId !== req.user.id) {
                throw new BadRequestsException('Billing address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG);
            }
        }

        const updatedUser = await prismaClient.user.update({
            where: {
                id: req.user.id
            },
            data: validatedData
        });
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
}

export const listUsers = async(req:Request, res: Response) => {
    const skip = +(req.query.skip as string ?? 0);

    const users = await prismaClient.user.findMany({
      skip: skip,
      take: 5
    });

    res.json(users);
}

export const getUserById = async(req:Request, res: Response) => {
    try {
        const user =await prismaClient.user.findFirstOrThrow ({
            where: {
                id: +req.params.id
            },
            include: {
                addresses: true
            }
        })
        res.json(user)

    } catch(err) {
        throw new NotFoundException('User not foud.', ErrorCode.USER_NOT_FOUND)
    }

}
export const changeUserRole = async(req:Request, res: Response) => {
try {
    const user =await prismaClient.user.update ({
        where: {
            id: +req.params.id
        }, 
        data: {
              Role: req.body.role
        }

    })

    res.json(user)

} catch(err) {
    throw new NotFoundException('User not foud.', ErrorCode.USER_NOT_FOUND)
  }
}
