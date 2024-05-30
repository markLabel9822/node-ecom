import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { count } from "console";

export const createProduct = async(req:Request, res:Response) => {

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })
    res.json(product)
    
}

export const updateProduct = async (req: Request, res:Response) => {
    try{

    const product = req.body;  
    if(product.tags){
        product.tags = product.tags.join(',')
    }   
    const updateProduct = await prismaClient.product.update({
        where:{
            id: +req.params.id
        },
        data: product
    })
    res.json(updateProduct)


    }catch(err) {
        throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND)
    }

}
export const deletProduct = async (req: Request, res:Response) => {
    
}

export const listProduct = async (req: Request, res:Response) => {
   const skip = req.query.skip ? +req.query.skip : 0;
   const products = await prismaClient.product.findMany({
    skip: skip,
    take: 5
});
    res.json({
        count, delete:products
    })
}

export const getProductBtId = async (req: Request, res:Response) => {
    try{
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })
        res.json(product)
    }catch(err) {
        console.log(err)
        throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND)

    }
    
}

export const searchProducts = async (req : Request, res: Response)  => {
    const query = req.body.search?.toString() || '';

   
    if (query === '') {
      const products = await prismaClient.product.findMany();
      return res.json(products);
    }
  
    const products = await prismaClient.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } }
        ]
      }
    });
  
    res.json(products);

}