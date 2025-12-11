import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Equipo } from "./equipo.entity";
import { Usuario } from "../users/user.entity";
import { Obra } from "../obras/obra.entity";

export type TipoMovimiento = "asignacion" | "devolucion" | "mantenimiento" | "reparacion" | "cambio_estado" | "ubicacion";

@Entity({ name: 'historial_equipos' })
export class HistorialEquipo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ["asignacion", "devolucion", "mantenimiento", "reparacion", "cambio_estado", "ubicacion"]
    })
    tipo: TipoMovimiento;

    @Column({
        type: 'text'
    })
    descripcion: string;

    @Column({
        name: 'estado_anterior',
        length: 50,
        nullable: true
    })
    estadoAnterior: string;

    @Column({
        name: 'estado_nuevo',
        length: 50,
        nullable: true
    })
    estadoNuevo: string;

    @Column({
        name: 'ubicacion_anterior',
        length: 300,
        nullable: true
    })
    ubicacionAnterior: string;

    @Column({
        name: 'ubicacion_nueva',
        length: 300,
        nullable: true
    })
    ubicacionNueva: string;

    @Column({
        name: 'fecha_movimiento',
        type: 'timestamp'
    })
    fechaMovimiento: Date;

    // RELACIÓN: Equipo relacionado
    @ManyToOne(() => Equipo, { nullable: false })
    @JoinColumn({ name: 'equipo_id' })
    equipo: Equipo;

    // RELACIÓN: Usuario que realizó el movimiento
    @ManyToOne(() => Usuario, { nullable: false })
    @JoinColumn({ name: 'realizado_por_id' })
    realizadoPor: Usuario;

    // RELACIÓN: Usuario asignado (si aplica)
    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'asignado_a_id' })
    asignadoA: Usuario | null;

    // RELACIÓN: Obra relacionada (si aplica)
    @ManyToOne(() => Obra, { nullable: true })
    @JoinColumn({ name: 'obra_id' })
    obra: Obra | null;

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;
}

