import { AppDataSource } from "../../infra/db/data-source";
import { Obra } from "./obra.entity";
import { CreateObraDto } from "./dto/create-obra.dto";
import { UpdateObraDto } from "./dto/update-obra.dto";
import { Ensayo } from "../ensayos/ensayo.entity";
import { EstadoObra } from "./obra.entity";

export class ObraService{
    private obraRepository = AppDataSource.getRepository(Obra);

    async getAllWorksService() {
        const obras = await this.obraRepository.find({
            relations: ['director', 'ensayos', 'solicitudes'],
            order: { creadoEn: 'DESC' }
        });
        return obras;
    }
    
    async getWorkByIdService(id: string) {
        const obra = await this.obraRepository.findOne({
            where: { id },
            relations: ['director', 'ensayos', 'solicitudes', 'equiposAsignados']
        });

        if (!obra) {
            throw new Error('Obra no encontrada');
        }

        return obra;
    }

    async createWorkService(obraData: CreateObraDto) {
        // Validar que el código de obra sea único
        if (obraData.codigoObra) {
            const existingObra = await this.obraRepository.findOne({
                where: { codigoObra: obraData.codigoObra }
            });
            
            if (existingObra) {
                throw new Error('El código de obra ya existe');
            }
        }

        const obra = this.obraRepository.create(obraData);
        await this.obraRepository.save(obra);
        
        return obra;
    }

    async updateWorkService(id: string, updateData: UpdateObraDto) {
        const obra = await this.obraRepository.findOne({ where: { id } });
        
        if (!obra) {
            throw new Error('Obra no encontrada');
        }

        // Validar código único si se está actualizando
        if (updateData.codigoObra && updateData.codigoObra !== obra.codigoObra) {
            const existingObra = await this.obraRepository.findOne({
                where: { codigoObra: updateData.codigoObra }
            });
            
            if (existingObra) {
                throw new Error('El código de obra ya existe');
            }
        }

        Object.assign(obra, updateData);
        await this.obraRepository.save(obra);
        
        return obra;
    }

    async deleteWorkService(id: string) {
        const obra = await this.obraRepository.findOne({ where: { id } });
        
        if (!obra) {
            throw new Error('Obra no encontrada');
        }

        // Verificar si tiene ensayos o solicitudes activas
        const ensayosActivos = await AppDataSource.getRepository(Ensayo)
            .count({ where: { obra: { id }, estado: 'en_proceso' } });
            
        if (ensayosActivos > 0) {
            throw new Error('No se puede eliminar una obra con ensayos en progreso');
        }

        await this.obraRepository.remove(obra);
        
        return { message: 'Obra eliminada correctamente' };
    }

    async changeWorkStatusService(id: string, nuevoEstado: EstadoObra) {
        const obra = await this.obraRepository.findOne({ where: { id } });
        
        if (!obra) {
            throw new Error('Obra no encontrada');
        }

        // Validar transición de estado
        const transicionesValidas: Record<EstadoObra, EstadoObra[]> = {
            planificada: ['en_progreso', 'cancelada'],
            en_progreso: ['pausada', 'finalizada', 'cancelada'],
            pausada: ['en_progreso', 'cancelada'],
            finalizada: [],
            cancelada: []
        };

        if (!transicionesValidas[obra.estado].includes(nuevoEstado)) {
            throw new Error(`Transición de estado no válida: ${obra.estado} -> ${nuevoEstado}`);
        }

        obra.estado = nuevoEstado;
        
        // Si se finaliza, registrar fecha real
        if (nuevoEstado === 'finalizada') {
            obra.fechaFinReal = new Date();
        }

        await this.obraRepository.save(obra);
        
        return obra;
    }

    async getWorksByDirectorService(directorId: string) {
        const obras = await this.obraRepository.find({
            where: { director: { id: directorId } },
            relations: ['ensayos', 'solicitudes'],
            order: { creadoEn: 'DESC' }
        });
        
        return obras;
    }
}