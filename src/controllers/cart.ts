import { Request, Response } from "express";
import { CreatCartSchema, changeQuantitySchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";

export const addItemToCart = async (req: Request, res: Response) => {
    const validatedData = CreatCartSchema.parse(req.body)
    let Product: Product;

    try {
        Product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    } catch(err) {
        throw new NotFoundException('Product not found!', ErrorCode.PRODUCT_NOT_FOUND)
    }
    const cart = await prismaClient.cartItem.create ({
        data: {

            userId: req.user.id,
            productId: Product.id,
            quantity: validatedData.quantity
        }
    })
    res.json(cart)
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    await prismaClient.cartItem.delete({
        where:{
            id: +req.params.id
        }
    })
    res.json({success: true})
    
}

export const changeQuantity = async (req: Request, res: Response) => {
    const validatedData = changeQuantitySchema.parse(req.body)
    const updatedCart = await prismaClient.cartItem.update({
        where:{
            id: +req.params.id
        },
        data:{
            quantity: validatedData.quantity
        }
    })
    res.json(updatedCart)
    
}

export const getCart = async (req: Request, res: Response) => {

    const cart = await prismaClient.cartItem.findMany({
        where:{
            userId: +req.user.id
        },
        include:{
            product: true
        }
    })
    res.json(cart)
    
}
