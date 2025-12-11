import { Request, Response } from "express";
import { UserService } from './users.service';

export class UserController {
    constructor(private userService: UserService) {}

    async register(req: Request, res: Response) {
        try {
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
        }
    }
}