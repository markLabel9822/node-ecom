import { Request, Response } from "express";
import { updateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";

export const updateUser = async (req: Request, res: Response) => {
    console.log("Update user called");

    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = updateUserSchema.parse(req.body);
    let ShippingAddress: any;
    let BillingAddress: any;

    if (validatedData.defaultShippingAddress) {
        try {
            ShippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }
            });

        } catch (error) {
            throw new NotFoundException('Shipping address not found', ErrorCode.ADDRESS_NOT_FOUND);
        }
        if (ShippingAddress.userId != req.user.id) {
            throw new BadRequestsException('Address not found.', ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }

    if (validatedData.defaultBillingAddress) {
        try {
            BillingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            });

        } catch (error) {
            throw new NotFoundException('Billing address not found', ErrorCode.ADDRESS_NOT_FOUND);
        }
        if (BillingAddress.userId != req.user.id) {
            throw new BadRequestsException('Address not found.', ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }

    const updatedUser = await prismaClient.user.update({
        where: {
            id: req.user.id
        },
        data: validatedData
    });

    res.json(updatedUser);
};
