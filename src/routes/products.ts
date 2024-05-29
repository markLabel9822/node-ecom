import { Router } from 'express'
import { errorHandler } from '../error-handler'
import { createProduct, deletProduct, getProductBtId, listProduct, updateProduct } from '../controllers/products'
import authMiddleware from '../middlewares/auth'

const productsRoutes:Router = Router()

productsRoutes.post('/',[authMiddleware, authMiddleware], errorHandler(createProduct))
productsRoutes.put('/:id',[authMiddleware, authMiddleware], errorHandler(updateProduct))
productsRoutes.delete('/:id',[authMiddleware, authMiddleware], errorHandler(deletProduct))
productsRoutes.get('/',[authMiddleware, authMiddleware], errorHandler(listProduct))
productsRoutes.get('/:id',[authMiddleware, authMiddleware], errorHandler(getProductBtId))

export default productsRoutes