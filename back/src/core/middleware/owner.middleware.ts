import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../infra/db/data-source';
import { Obra } from '../../modules/obras/obra.entity';

/*Middleware que verifica si el usuario es:
    1. Jerárquico (puede hacer cualquier cosa) 
    2. Director de la obra (solo puede modificar sus obras)
*/

export const obraOwnerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Si es jerárquico, permite todo
    if (req.user?.rol === 'jerarquico') {
        return next();
    }

    // Para otros roles, necesita verificar la obra
    const obraId = req.params.id;
    
    if (!obraId) {
        return res.status(400).json({
            success: false,
            message: 'ID de obra no proporcionado'
        });
    }

    // Verificar si el usuario es director de esta obra
    const obraRepository = AppDataSource.getRepository(Obra);
    
    obraRepository.findOne({
        where: { id: obraId },
        relations: ['director']
    })
    .then(obra => {
        if (!obra) {
            return res.status(404).json({
                success: false,
                message: 'Obra no encontrada'
            });
        }

        // Verificar si el usuario autenticado es el director
        if (obra.director.id !== req.user?.id) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para modificar esta obra'
            });
        }

        next();
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: 'Error verificando permisos'
        });
    });
};