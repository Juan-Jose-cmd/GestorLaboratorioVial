import { AppDataSource } from "../../infra/db/data-source";
import { Equipo, EstadoEquipo } from "./equipo.entity";
import { Repository } from "typeorm";
import { Obra } from "../obras/obra.entity";

export class EquipoRepository {
    private repository: Repository<Equipo>;

    constructor() {
        this.repository = AppDataSource.getRepository(Equipo);
    }

    async create(data: {
        nombre: string;
        codigoInterno: string;
        descripcion?: string;
        estado?: EstadoEquipo;
        obraActual?: Obra;
    }): Promise<Equipo> {
        const equipo = this.repository.create(data);
        return await this.repository.save(equipo);
    }

    async findAll(): Promise<Equipo[]> {
        return await this.repository.find({
            relations: ['obraActual'],
            order: { nombre: 'ASC' }
        });
    }

    async findById(id: string): Promise<Equipo | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['obraActual', 'historiales']
        });
    }

    async findByEstado(estado: EstadoEquipo): Promise<Equipo[]> {
        return await this.repository.find({
            where: { estado },
            relations: ['obraActual'],
            order: { nombre: 'ASC' }
        });
    }

    async findByObra(obraId: string): Promise<Equipo[]> {
        return await this.repository.find({
            where: { obraActual: { id: obraId } },
            relations: ['obraActual'],
            order: { nombre: 'ASC' }
        });
    }

    async findByCodigo(codigo: string): Promise<Equipo | null> {
        return await this.repository.findOne({
            where: { codigoInterno: codigo }
        });
    }

    async update(id: string, data: Partial<Equipo>): Promise<Equipo | null> {
        await this.repository.update(id, data);
        return await this.findById(id);
    }

    async updateEstado(id: string, estado: EstadoEquipo): Promise<Equipo | null> {
        await this.repository.update(id, { estado });
        return await this.findById(id);
    }

    async asignarAObra(id: string, obra: Obra): Promise<Equipo | null> {
        await this.repository.update(id, { obraActual: obra });
        return await this.findById(id);
    }

    async retirarDeObra(id: string): Promise<Equipo | null> {
        await this.repository.update(id, { obraActual: null });
        return await this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    // Métodos estadísticos
    async countByEstado(estado: EstadoEquipo): Promise<number> {
        return await this.repository.count({ where: { estado } });
    }

    async findEquiposDisponibles(): Promise<Equipo[]> {
        return await this.repository.find({
            where: { 
                estado: 'operativo',
                obraActual: null
            },
            order: { nombre: 'ASC' }
        });
    }
}