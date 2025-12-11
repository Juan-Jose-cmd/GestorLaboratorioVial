import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Usuario } from "../users/user.entity";
import { SolicitudEnsayo } from "../solicitudes/solicitud.entity";
import { Ensayo } from "../ensayos/ensayo.entity";
import { Equipo } from "../equipos/equipo.entity";

export type EstadoObra = "activa" | "pausada" | "finalizada";

@Entity({name: 'obras'})
export class Obra {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'name',
        nullable: false,
    })
    name: string;

    @Column({
        name: 'ubicacion',
        nullable: false
    })
    ubicacion: string;

    @ManyToOne(() => Usuario, { nullable: false })
    director: Usuario;

    @Column({
        type: 'enum',
        enum: ["activa", "pausada", "finalizada"],
        default: 'activa'
    })
    estado: EstadoObra;

    @OneToMany(() => SolicitudEnsayo, solicitud => solicitud.obra)
    solicitudes: SolicitudEnsayo[];
    
    @OneToMany(() => Ensayo, ensayo => ensayo.obra)
    ensayos: Ensayo[];
    
    @OneToMany(() => Equipo, equipo => equipo.obraActual)
    equiposAsignados: Equipo[];

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;

}