import { AppDataSource } from '../../infra/db/data-source';
import { SolicitudEnsayo } from './solicitud.entity';
import { Usuario } from '../users/user.entity';
import { Obra } from '../obras/obra.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { TipoEnsayo, PrioridadSolicitud, EstadoSolicitud } from './solicitud.entity';
import { Between, LessThan, In } from "typeorm";

export interface SolicitudFilters {
    obraId?: string;
    estado?: EstadoSolicitud;
    prioridad?: PrioridadSolicitud;
    tipoEnsayo?: TipoEnsayo;
    creadoPorId?: string;
    desde?: Date;
    hasta?: Date;
}

export class SolicitudService {
    private solicitudRepository = AppDataSource.getRepository(SolicitudEnsayo);
    private usuarioRepository = AppDataSource.getRepository(Usuario);
    private obraRepository = AppDataSource.getRepository(Obra);

    //OBTENER SOLICITUDES
    async getAllSolicitudes(filters: SolicitudFilters = {}) {
        const query = this.solicitudRepository.createQueryBuilder('solicitud')
            .leftJoinAndSelect('solicitud.obra', 'obra')
            .leftJoinAndSelect('solicitud.creadoPor', 'creadoPor')
            .leftJoinAndSelect('solicitud.aceptadoPor', 'aceptadoPor')
            .leftJoinAndSelect('solicitud.ensayo', 'ensayo')
            .orderBy('solicitud.creadoEn', 'DESC');

        // Aplicar filtros
        if (filters.obraId) {
            query.andWhere('solicitud.obraId = :obraId', { obraId: filters.obraId });
        }

        if (filters.estado) {
            query.andWhere('solicitud.estado = :estado', { estado: filters.estado });
        }

        if (filters.prioridad) {
            query.andWhere('solicitud.prioridad = :prioridad', { prioridad: filters.prioridad });
        }

        if (filters.tipoEnsayo) {
            query.andWhere('solicitud.tipoEnsayo = :tipoEnsayo', { tipoEnsayo: filters.tipoEnsayo });
        }

        if (filters.creadoPorId) {
            query.andWhere('solicitud.creadoPorId = :creadoPorId', { creadoPorId: filters.creadoPorId });
        }

        if (filters.desde) {
            query.andWhere('solicitud.creadoEn >= :desde', { desde: filters.desde });
        }

        if (filters.hasta) {
            query.andWhere('solicitud.creadoEn <= :hasta', { hasta: filters.hasta });
        }

        return await query.getMany();
    }

    async getSolicitudById(id: string) {
        const solicitud = await this.solicitudRepository.findOne({
            where: { id },
            relations: ['obra', 'creadoPor', 'aceptadoPor', 'ensayo']
        });

        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        return solicitud;
    }

    async getSolicitudesByObra(obraId: string) {
        return await this.solicitudRepository.find({
            where: { obra: { id: obraId } },
            relations: ['creadoPor', 'aceptadoPor', 'ensayo'],
            order: { creadoEn: 'DESC' }
        });
    }

    async getSolicitudesByUsuario(usuarioId: string) {
        return await this.solicitudRepository.find({
            where: { creadoPor: { id: usuarioId } },
            relations: ['obra', 'aceptadoPor', 'ensayo'],
            order: { creadoEn: 'DESC' }
        });
    }

    async getSolicitudesByEstado(estado: EstadoSolicitud) {
        return await this.solicitudRepository.find({
            where: { estado },
            relations: ['obra', 'creadoPor', 'aceptadoPor'],
            order: { prioridad: 'DESC', creadoEn: 'ASC' }
        });
    }

    // CREAR SOLICITUD
    async createSolicitud(solicitudData: CreateSolicitudDto, usuarioId: string) {
        // Validar que la obra existe
        const obra = await this.obraRepository.findOne({
            where: { id: solicitudData.obraId }
        });

        if (!obra) {
            throw new Error('La obra especificada no existe');
        }

        // Validar que el usuario existe
        const usuario = await this.usuarioRepository.findOne({
            where: { id: usuarioId }
        });

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Generar código único
        const codigoSolicitud = await this.generarCodigoSolicitud();

        // Crear solicitud
        const solicitud = this.solicitudRepository.create({
            ...solicitudData,
            codigoSolicitud,
            obra,
            creadoPor: usuario,
            prioridad: solicitudData.prioridad || 'media',
            estado: 'pendiente'
        });

        await this.solicitudRepository.save(solicitud);

        return solicitud;
    }

    // ACTUALIZAR SOLICITUD
    async updateSolicitud(id: string, updateData: UpdateSolicitudDto) {
        const solicitud = await this.solicitudRepository.findOne({
            where: { id }
        });

        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        // Validar que no se pueda modificar si está en proceso o finalizada
        if (['en_proceso', 'finalizada'].includes(solicitud.estado)) {
            throw new Error('No se puede modificar una solicitud en proceso o finalizada');
        }

        // Si se cambia la obra, validar que existe
        if (updateData.obraId && updateData.obraId !== solicitud.obra.id) {
            const nuevaObra = await this.obraRepository.findOne({
                where: { id: updateData.obraId }
            });

            if (!nuevaObra) {
                throw new Error('La nueva obra no existe');
            }

            solicitud.obra = nuevaObra;
        }

        // Actualizar otros campos
        Object.assign(solicitud, updateData);

        await this.solicitudRepository.save(solicitud);

        return solicitud;
    }

    // CAMBIAR ESTADO
    async updateEstado(id: string, nuevoEstado: EstadoSolicitud, usuarioId?: string) {
        const solicitud = await this.solicitudRepository.findOne({
            where: { id },
            relations: ['creadoPor', 'obra']
        });

        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        // Validar transiciones de estado
        const transicionesValidas: Record<EstadoSolicitud, EstadoSolicitud[]> = {
            pendiente: ['aceptada', 'cancelada'],
            aceptada: ['en_proceso', 'cancelada'],
            en_proceso: ['finalizada', 'cancelada'],
            finalizada: [],
            cancelada: []
        };

        if (!transicionesValidas[solicitud.estado].includes(nuevoEstado)) {
            throw new Error(`Transición de estado inválida: ${solicitud.estado} → ${nuevoEstado}`);
        }

        // Lógica específica por estado
        if (nuevoEstado === 'aceptada' && usuarioId) {
            const laboratorista = await this.usuarioRepository.findOne({
                where: { id: usuarioId, rol: 'laboratorista' }
            });

            if (!laboratorista) {
                throw new Error('Solo los laboratoristas pueden aceptar solicitudes');
            }

            solicitud.aceptadoPor = laboratorista;
            solicitud.fechaAceptacion = new Date();
        }

        if (nuevoEstado === 'finalizada') {
            solicitud.fechaFinalizacion = new Date();
        }

        solicitud.estado = nuevoEstado;
        await this.solicitudRepository.save(solicitud);

        return solicitud;
    }

    // CAMBIAR PRIORIDAD
    async updatePrioridad(id: string, nuevaPrioridad: PrioridadSolicitud) {
        const solicitud = await this.solicitudRepository.findOne({
            where: { id }
        });

        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        if (solicitud.estado === 'finalizada') {
            throw new Error('No se puede cambiar la prioridad de una solicitud finalizada');
        }

        solicitud.prioridad = nuevaPrioridad;
        await this.solicitudRepository.save(solicitud);

        return solicitud;
    }

    // ACEPTAR SOLICITUD 
    async aceptarSolicitud(id: string, laboratoristaId: string) {
        const solicitud = await this.solicitudRepository.findOne({
            where: { id },
            relations: ['creadoPor', 'obra']
        });

        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        if (solicitud.estado !== 'pendiente') {
            throw new Error('Solo se pueden aceptar solicitudes pendientes');
        }

        const laboratorista = await this.usuarioRepository.findOne({
            where: { id: laboratoristaId, rol: 'laboratorista' }
        });

        if (!laboratorista) {
            throw new Error('Usuario no es un laboratorista válido');
        }

        solicitud.estado = 'aceptada';
        solicitud.aceptadoPor = laboratorista;
        solicitud.fechaAceptacion = new Date();

        await this.solicitudRepository.save(solicitud);

        return solicitud;
    }

    // ELIMINAR/CANCELAR SOLICITUD
    async deleteSolicitud(id: string) {
        const solicitud = await this.solicitudRepository.findOne({
            where: { id },
            relations: ['ensayo']
        });

        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        // Validar que no tenga ensayo asociado
        if (solicitud.ensayo) {
            throw new Error('No se puede eliminar una solicitud con ensayo asociado');
        }

        // Solo se pueden eliminar solicitudes pendientes o canceladas
        if (!['pendiente', 'cancelada'].includes(solicitud.estado)) {
            throw new Error('Solo se pueden eliminar solicitudes pendientes o canceladas');
        }

        await this.solicitudRepository.remove(solicitud);

        return { message: 'Solicitud eliminada correctamente' };
    }

    // MÉTODOS PRIVADOS DE AYUDA
    private async generarCodigoSolicitud(): Promise<string> {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        
        // Contar solicitudes del mes
        const inicioMes = new Date(año, fecha.getMonth(), 1);
        const finMes = new Date(año, fecha.getMonth() + 1, 0);
        
        const count = await this.solicitudRepository.count({
            where: {
                creadoEn: Between(inicioMes, finMes)
            }
        });

        const numero = (count + 1).toString().padStart(4, '0');
        return `SOL-${año}${mes}-${numero}`;
    }

    // ESTADÍSTICAS (opcional, útil para dashboards)
    async getEstadisticas(obraId?: string) {
        const query = this.solicitudRepository.createQueryBuilder('solicitud')
            .select('solicitud.estado', 'estado')
            .addSelect('COUNT(solicitud.id)', 'cantidad')
            .groupBy('solicitud.estado');

        if (obraId) {
            query.where('solicitud.obraId = :obraId', { obraId });
        }

        const resultados = await query.getRawMany();

        // Formatear resultados
        const total = resultados.reduce((sum, item) => sum + parseInt(item.cantidad), 0);
        
        return {
            total,
            porEstado: resultados.reduce((acc, item) => {
                acc[item.estado] = parseInt(item.cantidad);
                return acc;
            }, {} as Record<string, number>),
            porcentajes: resultados.reduce((acc, item) => {
                acc[item.estado] = total > 0 ? (parseInt(item.cantidad) / total * 100).toFixed(1) : '0';
                return acc;
            }, {} as Record<string, string>)
        };
    }

    // MÉTODO PARA VERIFICAR VENCIMIENTOS
    async verificarVencimientos() {
        const hoy = new Date();
        
        const solicitudesVencidas = await this.solicitudRepository.find({
            where: {
                fechaLimite: LessThan(hoy), 
                estado: In(['pendiente', 'aceptada', 'en_proceso'])
            },
            relations: ['creadoPor', 'obra']
        });

        // Aquí podrías enviar notificaciones
        return {
            vencidas: solicitudesVencidas.length,
            solicitudes: solicitudesVencidas
        };
    }
}