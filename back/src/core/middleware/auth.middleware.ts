import { Request, Response, NextFunction } from 'express';
import { AuthService, TokenPayload } from '../../modules/auth/auth.service';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
            token?: string;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Obtener token
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticación requerido'
            });
        }

        // 2. Validar formato
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                success: false,
                message: 'Formato de token inválido. Use: Bearer <token>'
            });
        }

        const token = parts[1];

        // 3. Verificar token usando AuthService
        const decoded = AuthService.verifyToken(token);
        
        // 4. Adjuntar al request
        req.user = decoded;
        req.token = token;
        
        next();
    } catch (error: any) {
        if (error.message.includes('expirado')) {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Por favor, inicie sesión nuevamente.'
            });
        }
        
        if (error.message.includes('inválido')) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o corrupto.'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Error de autenticación'
        });
    }
};