import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, DeleteDateColumn, JoinColumn } from "typeorm";
import { Usuario } from "../users/user.entity";
import { Obra } from "../obras/obra.entity";
import { Ensayo } from "../ensayos/ensayo.entity";

export type TipoEnsayo = "suelo" | "hormigon" | "asfalto";
export type PrioridadSolicitud = "baja" | "media" | "alta" | "urgente";
export type EstadoSolicitud = "pendiente" | "aceptada" | "en_proceso" | "finalizada" | "cancelada";

@Entity({ name: 'solicitudes_ensayo' })
export class SolicitudEnsayo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'codigo_solicitud',
        unique: true,
        length: 50
    })
    codigoSolicitud: string;

    @Column({
        type: 'text'
    })
    descripcion: string;

    @Column({
        type: 'enum',
        enum: ["suelo", "hormigon", "asfalto"]
    })
    tipoEnsayo: TipoEnsayo;

    @Column({
        type: 'enum',
        enum: ["baja", "media", "alta", "urgente"],
        default: 'media'
    })
    prioridad: PrioridadSolicitud;

    @Column({
        type: 'enum',
        enum: ["pendiente", "aceptada", "en_proceso", "finalizada", "cancelada"],
        default: 'pendiente'
    })
    estado: EstadoSolicitud;

    @Column({
        name: 'fecha_requerida',
        type: 'date'
    })
    fechaRequerida: Date;

    @Column({
        name: 'fecha_limite',
        type: 'date',
        nullable: true
    })
    fechaLimite: Date;

    @Column({
        name: 'parametros_especiales',
        type: 'json',
        nullable: true
    })
    parametrosEspeciales: Record<string, any>;

    // RELACIÓN: Quién creó la solicitud
    @ManyToOne(() => Usuario, { nullable: false })
    @JoinColumn({ name: 'creado_por_id' })
    creadoPor: Usuario;

    // RELACIÓN: A qué obra pertenece
    @ManyToOne(() => Obra, { nullable: false })
    @JoinColumn({ name: 'obra_id' })
    obra: Obra;

    // RELACIÓN: Quién aceptó la solicitud (laboratorista)
    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'aceptado_por_id' })
    aceptadoPor: Usuario | null;

    // RELACIÓN: Ensayo generado a partir de esta solicitud
    @OneToOne(() => Ensayo, ensayo => ensayo.solicitud, { nullable: true })
    @JoinColumn({ name: 'ensayo_id' })
    ensayo: Ensayo | null;

    @Column({
        name: 'fecha_aceptacion',
        type: 'timestamp',
        nullable: true
    })
    fechaAceptacion: Date;

    @Column({
        name: 'fecha_finalizacion',
        type: 'timestamp',
        nullable: true
    })
    fechaFinalizacion: Date;

    @Column({
        name: 'comentarios_cancelacion',
        type: 'text',
        nullable: true
    })
    comentariosCancelacion: string;

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'actualizado_en' })
    actualizadoEn: Date;

    @DeleteDateColumn({ name: 'eliminado_en' })
    eliminadoEn: Date;

    // MÉTODOS DE INSTANCIA
    puedeSerAceptada(): boolean {
        return this.estado === 'pendiente';
    }

    puedeSerCancelada(): boolean {
        return ['pendiente', 'aceptada', 'en_proceso'].includes(this.estado);
    }

    calcularDiasRestantes(): number {
        if (!this.fechaLimite) return -1;
        const hoy = new Date();
        const limite = new Date(this.fechaLimite);
        const diffTime = limite.getTime() - hoy.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

