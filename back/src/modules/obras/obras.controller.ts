import { Request, Response } from "express";
import { ObraService } from "./obra.service";
import { CreateObraDto } from "./dto/create-obra.dto";
import { UpdateObraDto } from "./dto/update-obra.dto";

export class ObraController {
    constructor(private obraService: ObraService) {};

    async getAllWorks(req: Request, res: Response) {
        try {
            const obras = await this.obraService.getAllWorksService();
            res.status(200).json({
                success: true,
                data: obras,
                message: 'Obras obtenidas correctamente'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener obras',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async getWorkById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const obra = await this.obraService.getWorkByIdService(id);
            
            res.status(200).json({
                success: true,
                data: obra,
                message: 'Obra encontrada'
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
                message: 'Error al obtener la obra'
            });
        }
    }

    async createWork(req: Request, res: Response) {
        try {
            const obraData: CreateObraDto = req.body;
            const obra = await this.obraService.createWorkService(obraData);
            
            res.status(201).json({
                success: true,
                data: obra,
                message: 'Obra creada correctamente'
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
                message: 'Error al crear la obra'
            });
        }
    }

    async updateWork(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData: UpdateObraDto = req.body;
            
            const obra = await this.obraService.updateWorkService(id, updateData);
            
            res.status(200).json({
                success: true,
                data: obra,
                message: 'Obra actualizada correctamente'
            });
        } catch (error: any) {
            if (error.message.includes('no encontrada')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (error.message.includes('ya existe')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al actualizar la obra'
            });
        }
    }

    async deleteWork(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.obraService.deleteWorkService(id);
            
            res.status(200).json({
                success: true,
                data: result,
                message: 'Obra eliminada correctamente'
            });
        } catch (error: any) {
            if (error.message.includes('no encontrada')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (error.message.includes('ensayos en progreso')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al eliminar la obra'
            });
        }
    }

    async changeWorkStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            if (!estado) {
                return res.status(400).json({
                    success: false,
                    message: 'El estado es requerido'
                });
            }

            const obra = await this.obraService.changeWorkStatusService(id, estado);
            
            res.status(200).json({
                success: true,
                data: obra,
                message: `Estado de obra actualizado a: ${estado}`
            });
        } catch (error: any) {
            if (error.message.includes('no encontrada')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (error.message.includes('Transición de estado')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al cambiar estado de la obra'
            });
        }
    }

    async getWorksByDirector(req: Request, res: Response) {
        try {
            const { directorId } = req.params;
            const obras = await this.obraService.getWorksByDirectorService(directorId);
            
            res.status(200).json({
                success: true,
                data: obras,
                message: 'Obras del director obtenidas correctamente'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener obras del director'
            });
        }
    }
}