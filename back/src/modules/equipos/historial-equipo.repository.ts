import { AppDataSource } from "../../infra/db/data-source";
import { HistorialEquipo, TipoMovimiento } from "./historialEquipo.entity";
import { Repository } from "typeorm";
import { Equipo } from "./equipo.entity";
import { Obra } from "../obras/obra.entity";
import { User } from "../users/user.entity";

export class HistorialEquipoRepository {
    private repository: Repository<HistorialEquipo>;

    constructor() {
        this.repository = AppDataSource.getRepository(HistorialEquipo);
    }

    async create(data: {
        equipo: Equipo;
        tipo: TipoMovimiento;
        obraOrigen?: Obra;
        obraDestino?: Obra;
        realizadoPor?: User;
        descripcion?: string;
    }): Promise<HistorialEquipo> {
        const historial = this.repository.create(data);
        return await this.repository.save(historial);
    }

    async findByEquipo(equipoId: string): Promise<HistorialEquipo[]> {
        return await this.repository.find({
            where: { equipo: { id: equipoId } },
            relations: ['obraOrigen', 'obraDestino', 'realizadoPor'],
            order: { creadoEn: 'DESC' }
        });
    }

    async findByTipo(tipo: TipoMovimiento): Promise<HistorialEquipo[]> {
        return await this.repository.find({
            where: { tipo },
            relations: ['equipo', 'obraOrigen', 'obraDestino'],
            order: { creadoEn: 'DESC' }
        });
    }

    async findByObra(obraId: string): Promise<HistorialEquipo[]> {
        return await this.repository.find({
            where: [
                { obraOrigen: { id: obraId } },
                { obraDestino: { id: obraId } }
            ],
            relations: ['equipo', 'realizadoPor'],
            order: { creadoEn: 'DESC' }
        });
    }

    async findByUsuario(usuarioId: string): Promise<HistorialEquipo[]> {
        return await this.repository.find({
            where: { realizadoPor: { id: usuarioId } },
            relations: ['equipo', 'obraOrigen', 'obraDestino'],
            order: { creadoEn: 'DESC' }
        });
    }

    async getUltimoMovimiento(equipoId: string): Promise<HistorialEquipo | null> {
        return await this.repository.findOne({
            where: { equipo: { id: equipoId } },
            relations: ['obraOrigen', 'obraDestino'],
            order: { creadoEn: 'DESC' }
        });
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}