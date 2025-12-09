import { AppDataSource } from "../../infra/db/data-source";
import { SolicitudEnsayo, EstadoSolicitud, PrioridadSolicitud, TipoEnsayo } from "./solicitud.entity";
import { Repository } from "typeorm";
import { Obra } from "../obras/obra.entity";
import { User } from "../users/user.entity";

export class SolicitudRepository {
    private repository: Repository<SolicitudEnsayo>;

    constructor() {
        this.repository = AppDataSource.getRepository(SolicitudEnsayo);
    }

    async create(data: {
        obra: Obra;
        creadoPor: User;
        tipo: TipoEnsayo;
        prioridad?: PrioridadSolicitud;
        descripcion?: string;
    }): Promise<SolicitudEnsayo> {
        const solicitud = this.repository.create(data);
        return await this.repository.save(solicitud);
    }

    async findAll(): Promise<SolicitudEnsayo[]> {
        return await this.repository.find({
            relations: ['obra', 'creadoPor', 'obra.director'],
            order: { creadoEn: 'DESC' }
        });
    }

    async findById(id: string): Promise<SolicitudEnsayo | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['obra', 'creadoPor', 'ensayo', 'obra.director']
        });
    }

    async findByEstado(estado: EstadoSolicitud): Promise<SolicitudEnsayo[]> {
        return await this.repository.find({
            where: { estado },
            relations: ['obra', 'creadoPor'],
            order: { prioridad: 'DESC', creadoEn: 'ASC' }
        });
    }

    async findByObra(obraId: string): Promise<SolicitudEnsayo[]> {
        return await this.repository.find({
            where: { obra: { id: obraId } },
            relations: ['creadoPor', 'ensayo'],
            order: { creadoEn: 'DESC' }
        });
    }

    async findByCreador(creadorId: string): Promise<SolicitudEnsayo[]> {
        return await this.repository.find({
            where: { creadoPor: { id: creadorId } },
            relations: ['obra', 'obra.director'],
            order: { creadoEn: 'DESC' }
        });
    }

    async update(id: string, data: Partial<SolicitudEnsayo>): Promise<SolicitudEnsayo | null> {
        await this.repository.update(id, data);
        return await this.findById(id);
    }

    async updateEstado(id: string, estado: EstadoSolicitud): Promise<SolicitudEnsayo | null> {
        await this.repository.update(id, { estado });
        return await this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async countByEstado(estado: EstadoSolicitud): Promise<number> {
        return await this.repository.count({ where: { estado } });
    }

    async countByTipo(tipo: TipoEnsayo): Promise<number> {
        return await this.repository.count({ where: { tipo } });
    }

    async findUrgentes(): Promise<SolicitudEnsayo[]> {
        return await this.repository.find({
            where: { 
                prioridad: 'urgente',
                estado: 'pendiente'
            },
            relations: ['obra', 'creadoPor'],
            order: { creadoEn: 'ASC' }
        });
    }
}