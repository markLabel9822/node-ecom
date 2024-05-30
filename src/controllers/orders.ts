import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";



interface AuthenticatedRequest extends Request {
    user?: any; 
}
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
    return await prismaClient.$transaction(async(tx) => {
        const cartItems = await tx.cartItem.findMany ({
            where: {
                id: req.body.userId,
            },
            include: {
                product:true
            }
        })
        if( cartItems.length == 0){
            return res.json({message: "cart is empty"})
        }
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0);

        const address = await tx.address.findFirst ({
            where: {
                userId: req.body.userId
            }
        })

        const addressData = [address?.lineOne, address?.lineTwo, address?.city, address?.country]
        .filter(Boolean)
        .join(' ');

        const order = await tx.order.create({
            data: {
                userId: 1,
                netAmount: price,
                address: addressData,
                products: {
                    create:  cartItems.map((cart) =>{
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
    })
    
    const orderEvent = await tx.orderEvent.create({
        data: {
            orderId: order.id,
        }
    })
    await tx.cartItem.deleteMany({
        where: {
            id: req.body.userId,
        }
    })
    return res.json(order)
    })

}

export const listOrders = async (req: Request, res: Response) => {
    const orders = await prismaClient.order.findMany ({
        where: {
            userId: req.body.id,
        }
    })
    res.json(orders)

}

export const cancelOrder = async (req: Request, res: Response) => {
        try {
            const order = await prismaClient.order.update ({
                where: {
                    id: +req.params.id
                },
                data: {
                    status: 'CANCELLED'
                }
            })
            await prismaClient.orderEvent.create({
                data: {
                    orderId: order.id,
                    status:"CANCELLED"
                }
            })
            res.json(order)
    
        }catch(err) {
            throw new NotFoundException ('Order not found', ErrorCode.ORDER_NOT_FOUND)
        }
    }
    

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        })
        res.json(order)

    }catch(err) {
        throw new NotFoundException ('Order not found', ErrorCode.ORDER_NOT_FOUND)
    }
    
}

export const listllOrders = async(req: Request, res: Response) => {
    let whereClause = {}
    const status = req.query.status
    if (status) {
        whereClause = {
            status
        }
    }
    const skip = +(req.query.skip as string ?? 0);
    const orders = await prismaClient.order.findMany ({
        where: whereClause,
        skip:skip,
        take: 5
    })
    res.json(orders)
}

export const changeStatus = async(req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.update({
            where: {
                id: req.body.orderId
            }, 
            data: {
                status: req.body.status
             
            }
        })
        await prismaClient.orderEvent.create ({
            data: {
                orderId: req.body.orderId,
                status: req.body.status
            }
        })
        res.json(order)

    }catch(err) {
      console.log(err)
    }
}

export const listUserOrders = async(req: Request, res: Response) => {

    let whereClause: any = {
        userId: +req.params.id
    }
    const status = req.params.status
    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    }
    const skip = +(req.query.skip as string ?? 0);
    const orders = await prismaClient.order.findMany ({
        where: whereClause,
        skip: skip,
        take: 5
    })
    res.json(orders)

}