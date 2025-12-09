import { AppDataSource } from "../../infra/db/data-source";
import { Informe, EstadoInforme } from "./informe.entity";
import { Repository } from "typeorm";
import { Ensayo } from "../ensayos/ensayo.entity";
import { User } from "../users/user.entity";

export class InformeRepository {
    private repository: Repository<Informe>;

    constructor() {
        this.repository = AppDataSource.getRepository(Informe);
    }

    async create(data: {
        ensayo: Ensayo;
        generadoPor: User;
        archivoUrl: string;
        nombreArchivo: string;
        version?: number;
        estado?: EstadoInforme;
    }): Promise<Informe> {
        const informe = this.repository.create(data);
        return await this.repository.save(informe);
    }

    async findAll(): Promise<Informe[]> {
        return await this.repository.find({
            relations: ['ensayo', 'generadoPor', 'ensayo.obra', 'ensayo.laboratorista'],
            order: { creadoEn: 'DESC' }
        });
    }

    async findById(id: string): Promise<Informe | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['ensayo', 'generadoPor', 'ensayo.obra', 'ensayo.solicitud']
        });
    }

    async findByEnsayo(ensayoId: string): Promise<Informe | null> {
        return await this.repository.findOne({
            where: { ensayo: { id: ensayoId } },
            relations: ['generadoPor']
        });
    }

    async findByEstado(estado: EstadoInforme): Promise<Informe[]> {
        return await this.repository.find({
            where: { estado },
            relations: ['ensayo', 'ensayo.obra'],
            order: { creadoEn: 'ASC' }
        });
    }

    async findByGenerador(userId: string): Promise<Informe[]> {
        return await this.repository.find({
            where: { generadoPor: { id: userId } },
            relations: ['ensayo', 'ensayo.obra'],
            order: { creadoEn: 'DESC' }
        });
    }

    async update(id: string, data: Partial<Informe>): Promise<Informe | null> {
        await this.repository.update(id, data);
        return await this.findById(id);
    }

    async updateEstado(id: string, estado: EstadoInforme): Promise<Informe | null> {
        await this.repository.update(id, { estado });
        return await this.findById(id);
    }

    async incrementVersion(informeId: string): Promise<Informe | null> {
        const informe = await this.findById(informeId);
        if (!informe) return null;

        informe.version += 1;
        return await this.repository.save(informe);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}