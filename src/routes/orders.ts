import { Router } from 'express';
import { errorHandler } from '../error-handler';
import { createOrder,listOrders,getOrderById,cancelOrder,changeStatus,listUserOrders,listllOrders} from '../controllers/orders';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin'

const orderRoutes: Router = Router();

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder))
orderRoutes.get('/', [authMiddleware], errorHandler(listOrders))
orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))
// orderRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById))
orderRoutes.get('/index', [authMiddleware,adminMiddleware], errorHandler(listllOrders))
orderRoutes.put('/:users/:id', [authMiddleware,adminMiddleware], errorHandler(listUserOrders))
// orderRoutes.put('/:id/status', [authMiddleware,adminMiddleware], errorHandler(changeStatus))
orderRoutes.put('/status', [authMiddleware,adminMiddleware], errorHandler(changeStatus))


export default orderRoutes;
