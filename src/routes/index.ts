import { Router } from 'express';
import authRoutes from './auth';
import productsRoutes from './products';
import cartRoutes from './cart';
import usersRoutes from './users';
import orderRoutes from './orders';



const rootRouter: Router = Router();

rootRouter.use('/carts', cartRoutes);
rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);
rootRouter.use('/users', usersRoutes);
rootRouter.use('/orders', orderRoutes);


export default rootRouter;
