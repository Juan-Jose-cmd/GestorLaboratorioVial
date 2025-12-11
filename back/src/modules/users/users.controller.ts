import { Request, Response } from "express";
import { UserService } from './users.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from "./dto/create-user.dto";

export class UserController {
    constructor(private userService: UserService) {};

    async getAllUsers(req: Request, res: Response){
        try{
            const users = await this.userService.getAllUsersService();
            res.status(200).json({
                success: true,
                data: users,
                message: 'Todos los usuarios obtenidos'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Ocurrio un erron extrayendo usuarios'
            });
        };
    };

    async getUserById(req: Request, res: Response){
        try{
            const { id } = req.params;
            const user = await this.userService.getUserbyIdService(id);
            res.status(200).json({
                success: true,
                data: user,
                message: 'Usuario encontrado'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
    }

    async register(req: Request, res: Response) {
        try {

            const userDto = plainToClass(CreateUserDto, req.body);
            const errors = await validate(userDto);
        
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: errors.map(e => ({
                        property: e.property,
                        constraints: e.constraints
                    }))
                });
            }
            // 1. Validar datos de entrada
            const userData = req.body;
            
            // 2. Llamar al servicio
            const user = await this.userService.createUser(userData);
            
            // 3. Responder
            res.status(201).json({
                success: true,
                data: user,
                message: 'Usuario registrado exitosamente'
            });
            
        } catch (error: any) {
            // Manejo específico de errores
            if (error.message.includes('ya existe')) {
                return res.status(409).json({
                    success: false,
                    message: 'El usuario ya existe'
                });
            }
            
            // Error genérico
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        };
    };

    async login(req: Request, res: Response){
        try{
            const user = await this.userService.loginUserService(req.body.email, req.body.password);
            res.status(200).json({
                success: true,
                data: user,
                message: 'Login correcto'
            })
        } catch (error: any){
            if (error.message.includes('credenciales') || error.message.includes('no encontrado')) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}