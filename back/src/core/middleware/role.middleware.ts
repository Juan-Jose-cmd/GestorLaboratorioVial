import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }

        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. Se requiere uno de estos roles: ${allowedRoles.join(', ')}`
            });
        }

        next();
    };
};