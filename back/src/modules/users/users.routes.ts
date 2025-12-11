import { Router } from "express";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";

const userService = new UserService();
const userController = new UserController(userService);

const userRouter = Router();

userRouter.get('/', userController.getAllUsers.bind(userController));

userRouter.get('/:id', userController.getUserById.bind(userController));

userRouter.post('/register', userController.register.bind(userController));

userRouter.post('/login', userController.login.bind(userController));

export default userRouter;