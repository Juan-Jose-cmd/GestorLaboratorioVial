import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Obra } from "../obras/obra.entity";
import { SolicitudEnsayo } from "../solicitudes/solicitud.entity";
import { Ensayo } from "../ensayos/ensayo.entity";
import { HistorialEquipo } from '../equipos/historialEquipo.entity';

export type RolUsuario = 'laboratorista' | 'director' | 'jerarquico';

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ 
        name: 'name',
        nullable: false,
    })
    name: string;

    @Column({
        name: 'email',
        unique: true,
        nullable: false
    })
    email: string;

    @Column({ 
        name: 'password',
        nullable: false 
    })
    password: string;

    @Column({ default: true })
    activo: boolean;

    @Column({
        type: 'enum',
        enum: ['laboratorista', 'director', 'jerarquico'],
    })
    rol: RolUsuario;

    @OneToMany(() => Obra, obra => obra.director)
    obrasDirigidas: Obra[];
    
    @OneToMany(() => SolicitudEnsayo, solicitud => solicitud.creadoPor)
    solicitudesCreadas: SolicitudEnsayo[];
    
    @OneToMany(() => Ensayo, ensayo => ensayo.laboratorista)
    ensayosAsignados: Ensayo[];
    
    @OneToMany(() => HistorialEquipo, historial => historial.realizadoPor)
    movimientosEquipos: HistorialEquipo[];

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;
}