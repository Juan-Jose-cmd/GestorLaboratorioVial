import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../infra/db/data-source';
import { Obra } from '../../modules/obras/obra.entity';

/*Middleware que verifica permisos específicos para obras según el método HTTP y el rol del usuario*/

export const obraPermissionsMiddleware = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const user = req.user;
    
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'No autenticado'
        });
    }

    // Jerárquicos tienen acceso total
    if (user.rol === 'jerarquico') {
        return next();
    }

    // Para GET, permitir a todos los roles autenticados
    if (req.method === 'GET') {
        return next();
    }

    // Para POST, solo jerárquicos
    // Para PUT/PATCH/DELETE, necesita verificar propiedad

    const obraId = req.params.id;
    
    if (!obraId) {
        return res.status(400).json({
            success: false,
            message: 'ID de obra requerido'
        });
    }

    try {
        const obraRepository = AppDataSource.getRepository(Obra);
        const obra = await obraRepository.findOne({
            where: { id: obraId },
            relations: ['director'],
            select: ['id']
        });

        if (!obra) {
            return res.status(404).json({
                success: false,
                message: 'Obra no encontrada'
            });
        }

        // Solo directores pueden modificar sus obras
        if (user.rol === 'director') {
            // Necesita cargar el director completo para comparar IDs
            const obraCompleta = await obraRepository.findOne({
                where: { id: obraId },
                relations: ['director']
            });

            if (obraCompleta?.director.id === user.id) {
                return next();
            }
        }

        return res.status(403).json({
            success: false,
            message: 'No tiene permisos para esta acción'
        });

    } catch (error) {
        console.error('Error en middleware de permisos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verificando permisos'
        });
    }
};