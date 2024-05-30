import { Router } from 'express';
import { errorHandler } from '../error-handler';
import { addAddress, deleteAddress, listAddress, changeUserRole, getUserById, listUsers, updateUser } from "../controllers/users";
import authMiddleware from '../middlewares/auth';

const usersRoutes: Router = Router();

usersRoutes.post('/address', [authMiddleware], errorHandler(addAddress));
usersRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
usersRoutes.get('/address', [authMiddleware], errorHandler(listAddress));
usersRoutes.put('/', [authMiddleware], errorHandler(updateUser));
usersRoutes.put('/:id/role', [authMiddleware,authMiddleware], errorHandler(changeUserRole));
usersRoutes.get('/', [authMiddleware,authMiddleware], errorHandler(listUsers));
usersRoutes.get('/:id', [authMiddleware,authMiddleware], errorHandler(getUserById));

export default usersRoutes;
