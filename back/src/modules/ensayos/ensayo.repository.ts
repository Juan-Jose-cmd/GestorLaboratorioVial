import { AppDataSource } from "../../infra/db/data-source";
import { Ensayo, EstadoEnsayo } from "./ensayo.entity";
import { Repository } from "typeorm";
import { Obra } from "../obras/obra.entity";
import { User } from "../users/user.entity";
import { SolicitudEnsayo } from "../solicitudes/solicitud.entity";

export class EnsayoRepository {
    private repository: Repository<Ensayo>;

    constructor() {
        this.repository = AppDataSource.getRepository(Ensayo);
    }

    async create(data: {
        obra: Obra;
        solicitud: SolicitudEnsayo;
        laboratorista: User;
        datos: any;
        estado?: EstadoEnsayo;
    }): Promise<Ensayo> {
        const ensayo = this.repository.create(data);
        return await this.repository.save(ensayo);
    }

    async findAll(): Promise<Ensayo[]> {
        return await this.repository.find({
            relations: ['obra', 'laboratorista', 'solicitud'],
            order: { creadoEn: 'DESC' }
        });
    }

    async findById(id: string): Promise<Ensayo | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['obra', 'laboratorista', 'solicitud', 'solicitud.creadoPor']
        });
    }

    async findByEstado(estado: EstadoEnsayo): Promise<Ensayo[]> {
        return await this.repository.find({
            where: { estado },
            relations: ['obra', 'laboratorista'],
            order: { creadoEn: 'ASC' }
        });
    }

    async findByLaboratorista(laboratoristaId: string): Promise<Ensayo[]> {
        return await this.repository.find({
            where: { laboratorista: { id: laboratoristaId } },
            relations: ['obra', 'solicitud'],
            order: { creadoEn: 'DESC' }
        });
    }

    async findByObra(obraId: string): Promise<Ensayo[]> {
        return await this.repository.find({
            where: { obra: { id: obraId } },
            relations: ['laboratorista', 'solicitud'],
            order: { estado: 'ASC', creadoEn: 'DESC' }
        });
    }

    async update(id: string, data: Partial<Ensayo>): Promise<Ensayo | null> {
        await this.repository.update(id, data);
        return await this.findById(id);
    }

    async updateEstado(id: string, estado: EstadoEnsayo): Promise<Ensayo | null> {
        await this.repository.update(id, { estado });
        return await this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async countByEstado(estado: EstadoEnsayo): Promise<number> {
        return await this.repository.count({ where: { estado } });
    }

    async findEnsayosConInformePendiente(): Promise<Ensayo[]> {
        return await this.repository
            .createQueryBuilder('ensayo')
            .leftJoinAndSelect('ensayo.informe', 'informe')
            .leftJoinAndSelect('ensayo.obra', 'obra')
            .leftJoinAndSelect('ensayo.laboratorista', 'laboratorista')
            .where('ensayo.estado = :estado', { estado: 'finalizado' })
            .andWhere('informe.id IS NULL OR informe.estado = :informeEstado', { 
                informeEstado: 'pendiente' 
            })
            .orderBy('ensayo.creadoEn', 'ASC')
            .getMany();
    }
}