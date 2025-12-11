import { Request, Response } from "express";
import { SolicitudService, SolicitudFilters } from "./solicitud.service";
import { EstadoSolicitud, PrioridadSolicitud, TipoEnsayo } from "./solicitud.entity";

export class SolicitudController {
    constructor(private solicitudService: SolicitudService) {}

    async getAllSolicitudes(req: Request, res: Response) {
        try {
            // Validar y convertir filters
            const filters = this.parseAndValidateFilters(req.query);
            
            const solicitudes = await this.solicitudService.getAllSolicitudes(filters);
            
            res.status(200).json({
                success: true,
                data: solicitudes,
                message: 'Solicitudes obtenidas correctamente',
                filters: filters // Opcional: devolver filters aplicados
            });
        } catch (error: any) {
            if (error.message.includes('inválido') || error.message.includes('Inválido')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            
            console.error('Error en getAllSolicitudes:', error);
            res.status(500).json({
                success: false,
                message: 'Error obteniendo solicitudes'
            });
        }
    }

    private parseAndValidateFilters(query: any): SolicitudFilters {
        const filters: SolicitudFilters = {};

        // Obra ID (simple string)
        if (query.obraId) {
            if (typeof query.obraId === 'string' && query.obraId.trim()) {
                filters.obraId = query.obraId.trim();
            }
        }

        // Estado (validar enum)
        if (query.estado) {
            const estadoStr = query.estado as string;
            if (this.isValidEstado(estadoStr)) {
                filters.estado = estadoStr as EstadoSolicitud;
            } else {
                throw new Error(`Estado inválido: ${estadoStr}. Valores válidos: pendiente, aceptada, en_proceso, finalizada, cancelada`);
            }
        }

        // Prioridad (validar enum)
        if (query.prioridad) {
            const prioridadStr = query.prioridad as string;
            if (this.isValidPrioridad(prioridadStr)) {
                filters.prioridad = prioridadStr as PrioridadSolicitud;
            } else {
                throw new Error(`Prioridad inválida: ${prioridadStr}. Valores válidos: baja, media, alta, urgente`);
            }
        }

        // Tipo de ensayo (validar enum)
        if (query.tipoEnsayo) {
            const tipoStr = query.tipoEnsayo as string;
            if (this.isValidTipoEnsayo(tipoStr)) {
                filters.tipoEnsayo = tipoStr as TipoEnsayo;
            } else {
                throw new Error(`Tipo de ensayo inválido: ${tipoStr}. Valores válidos: suelo, hormigon, asfalto`);
            }
        }

        // Fechas
        if (query.desde) {
            const desdeDate = new Date(query.desde as string);
            if (!isNaN(desdeDate.getTime())) {
                filters.desde = desdeDate;
            }
        }

        if (query.hasta) {
            const hastaDate = new Date(query.hasta as string);
            if (!isNaN(hastaDate.getTime())) {
                filters.hasta = hastaDate;
            }
        }

        // Creado por
        if (query.creadoPorId) {
            if (typeof query.creadoPorId === 'string' && query.creadoPorId.trim()) {
                filters.creadoPorId = query.creadoPorId.trim();
            }
        }

        return filters;
    }

    private isValidEstado(estado: string): estado is EstadoSolicitud {
        const estadosValidos: EstadoSolicitud[] = [
            'pendiente', 'aceptada', 'en_proceso', 'finalizada', 'cancelada'
        ];
        return estadosValidos.includes(estado as EstadoSolicitud);
    }

    private isValidPrioridad(prioridad: string): prioridad is PrioridadSolicitud {
        const prioridadesValidas: PrioridadSolicitud[] = [
            'baja', 'media', 'alta', 'urgente'
        ];
        return prioridadesValidas.includes(prioridad as PrioridadSolicitud);
    }

    private isValidTipoEnsayo(tipo: string): tipo is TipoEnsayo {
        const tiposValidos: TipoEnsayo[] = ['suelo', 'hormigon', 'asfalto'];
        return tiposValidos.includes(tipo as TipoEnsayo);
    }


    async getSolicitudById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const solicitud = await this.solicitudService.getSolicitudById(id);
            
            res.status(200).json({
                success: true,
                data: solicitud,
                message: 'Solicitud encontrada'
            });
        } catch (error: any) {
            if (error.message.includes('no encontrada')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error obteniendo solicitud'
            });
        }
    }

    async getSolicitudesByObra(req: Request, res: Response) {
        try {
            const { obraId } = req.params;
            const solicitudes = await this.solicitudService.getSolicitudesByObra(obraId);
            
            res.status(200).json({
                success: true,
                data: solicitudes,
                message: 'Solicitudes de la obra obtenidas'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo solicitudes de la obra'
            });
        }
    }

    async createSolicitud(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }
        
        const solicitudData = req.body; 
        
        const solicitud = await this.solicitudService.createSolicitud(
            solicitudData, 
            userId 
        );
        
        res.status(201).json({
            success: true,
            data: solicitud,
            message: 'Solicitud creada correctamente'
        });
    } catch (error: any) {
        if (error.message.includes('ya existe')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creando solicitud'
        });
    }
}

    async updateEstado(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const userId = req.user?.id; 
        
        // Validar que userId existe
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }
        
        const solicitud = await this.solicitudService.updateEstado(id, estado, userId);
        
        res.status(200).json({
            success: true,
            data: solicitud,
            message: `Estado actualizado a: ${estado}`
        });
    } catch (error: any) {
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        if (error.message.includes('transición inválida')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error actualizando estado'
        });
    }
}

    async aceptarSolicitud(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = req.user?.id; 
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }
        
        const solicitud = await this.solicitudService.aceptarSolicitud(id, userId);
        
        res.status(200).json({
            success: true,
            data: solicitud,
            message: 'Solicitud aceptada correctamente'
        });
    } catch (error: any) {
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        if (error.message.includes('ya aceptada') || error.message.includes('no puede ser aceptada')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error aceptando solicitud'
        });
    }
}
    
    async getSolicitudesByEstado(req: Request, res: Response) {
    try {
        const { estado } = req.params;
        
        // Validar que el estado sea válido
        if (!this.isValidEstado(estado)) {
            return res.status(400).json({
                success: false,
                message: `Estado inválido: ${estado}`
            });
        }
        
        const solicitudes = await this.solicitudService.getSolicitudesByEstado(
            estado as EstadoSolicitud
        );
        
        res.status(200).json({
            success: true,
            data: solicitudes,
            message: `Solicitudes en estado '${estado}' obtenidas`
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo solicitudes por estado'
        });
    }
}

async getSolicitudesByUsuario(req: Request, res: Response) {
    try {
        const { usuarioId } = req.params;
        const solicitudes = await this.solicitudService.getSolicitudesByUsuario(usuarioId);
        
        res.status(200).json({
            success: true,
            data: solicitudes,
            message: 'Solicitudes del usuario obtenidas'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo solicitudes del usuario'
        });
    }
}

async updateSolicitud(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const solicitud = await this.solicitudService.updateSolicitud(id, updateData);
        
        res.status(200).json({
            success: true,
            data: solicitud,
            message: 'Solicitud actualizada correctamente'
        });
    } catch (error: any) {
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        if (error.message.includes('No se puede modificar')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error actualizando solicitud'
        });
    }
}

async updatePrioridad(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { prioridad } = req.body;
        
        // Validar prioridad
        if (!this.isValidPrioridad(prioridad)) {
            return res.status(400).json({
                success: false,
                message: `Prioridad inválida: ${prioridad}`
            });
        }
        
        const solicitud = await this.solicitudService.updatePrioridad(
            id, 
            prioridad as PrioridadSolicitud
        );
        
        res.status(200).json({
            success: true,
            data: solicitud,
            message: `Prioridad actualizada a: ${prioridad}`
        });
    } catch (error: any) {
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        if (error.message.includes('No se puede cambiar')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error actualizando prioridad'
        });
    }
}

async deleteSolicitud(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await this.solicitudService.deleteSolicitud(id);
        
        res.status(200).json({
            success: true,
            data: result,
            message: 'Solicitud eliminada correctamente'
        });
    } catch (error: any) {
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        if (error.message.includes('No se puede eliminar')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error eliminando solicitud'
        });
    }
}
}