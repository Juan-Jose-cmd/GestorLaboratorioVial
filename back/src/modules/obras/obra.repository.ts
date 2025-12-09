import { AppDataSource } from "../../infra/db/data-source";
import { Obra, EstadoObra } from "./obra.entity";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";

export class ObraRepository {
    private repository: Repository<Obra>;

    constructor() {
        this.repository = AppDataSource.getRepository(Obra);
    }

    async create(data: {
        name: string;
        ubicacion: string;
        director: User;
        estado?: EstadoObra;
    }): Promise<Obra> {
        const obra = this.repository.create(data);
        return await this.repository.save(obra);
    }

    async findAll(): Promise<Obra[]> {
        return await this.repository.find({
            relations: ['director'],
            order: { creadoEn: 'DESC' }
        });
    }

    async findById(id: string): Promise<Obra | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['director', 'solicitudes', 'ensayos']
        });
    }

    async findByEstado(estado: EstadoObra): Promise<Obra[]> {
        return await this.repository.find({
            where: { estado },
            relations: ['director']
        });
    }

    async findByDirector(directorId: string): Promise<Obra[]> {
        return await this.repository.find({
            where: { director: { id: directorId } },
            relations: ['director']
        });
    }

    async update(id: string, data: Partial<Obra>): Promise<Obra | null> {
        await this.repository.update(id, data);
        return await this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async countByEstado(estado: EstadoObra): Promise<number> {
        return await this.repository.count({ where: { estado } });
    }

    // Método especial: Obras con ensayos pendientes
    async findWithPendingEnsayos(): Promise<Obra[]> {
        return await this.repository
            .createQueryBuilder('obra')
            .leftJoinAndSelect('obra.ensayos', 'ensayo')
            .leftJoinAndSelect('obra.director', 'director')
            .where('ensayo.estado = :estado', { estado: 'pendiente' })
            .orWhere('ensayo.id IS NULL')
            .orderBy('obra.creadoEn', 'DESC')
            .getMany();
    }
}