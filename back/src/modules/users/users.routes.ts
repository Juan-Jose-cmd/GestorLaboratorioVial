import { Router } from "express";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";

const userService = new UserService();
const userController = new UserController(userService);

const userRouter = Router();

userRouter.get('/');

userRouter.get('/:id');

userRouter.post('/register', userController.register.bind(userController));

userRouter.post('/login');

export default userRouter;