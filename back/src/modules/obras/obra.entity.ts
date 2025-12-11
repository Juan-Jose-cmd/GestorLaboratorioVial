import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { Usuario } from "../users/user.entity";
import { SolicitudEnsayo } from "../solicitudes/solicitud.entity";
import { Ensayo } from "../ensayos/ensayo.entity";
import { Equipo } from "../equipos/equipo.entity";

export type EstadoObra = "planificada" | "en_progreso" | "pausada" | "finalizada" | "cancelada";

@Entity({name: 'obras'})
export class Obra {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'nombre',
        nullable: false,
        length: 200
    })
    nombre: string;

    @Column({
        name: 'ubicacion',
        nullable: false,
        length: 300
    })
    ubicacion: string;

    @Column({
        name: 'descripcion',
        type: 'text',
        nullable: true
    })
    descripcion: string;

    @Column({
        name: 'codigo_obra',
        unique: true,
        length: 50
    })
    codigoObra: string;

    @Column({
        name: 'fecha_inicio',
        type: 'date',
        nullable: true
    })
    fechaInicio: Date;

    @Column({
        name: 'fecha_fin_estimada',
        type: 'date',
        nullable: true
    })
    fechaFinEstimada: Date;

    @Column({
        name: 'fecha_fin_real',
        type: 'date',
        nullable: true
    })
    fechaFinReal: Date;

    @Column({
        name: 'presupuesto',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true
    })
    presupuesto: number;

    @Column({
        name: 'cliente',
        length: 200,
        nullable: true
    })
    cliente: string;

    @ManyToOne(() => Usuario, { nullable: false })
    @JoinColumn({ name: 'director_id' })
    director: Usuario;

    @Column({
        type: 'enum',
        enum: ["planificada", "en_progreso", "pausada", "finalizada", "cancelada"],
        default: 'planificada'
    })
    estado: EstadoObra;

    @OneToMany(() => SolicitudEnsayo, solicitud => solicitud.obra)
    solicitudes: SolicitudEnsayo[];
    
    @OneToMany(() => Ensayo, ensayo => ensayo.obra)
    ensayos: Ensayo[];
    
    @OneToMany(() => Equipo, equipo => equipo.obraActual)
    equiposAsignados: Equipo[];

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'actualizado_en' })
    actualizadoEn: Date;
}