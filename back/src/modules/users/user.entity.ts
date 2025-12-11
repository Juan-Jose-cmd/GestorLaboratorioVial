import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { Obra } from "../obras/obra.entity";
import { SolicitudEnsayo } from "../solicitudes/solicitud.entity";
import { Ensayo } from "../ensayos/ensayo.entity";
import { HistorialEquipo } from '../equipos/historialEquipo.entity';

export type RolUsuario = 'laboratorista' | 'director' | 'jerarquico';

@Entity({ name: 'usuario' })
export class Usuario {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ 
        name: 'nombre_completo',
        nullable: false,
        length: 100
    })
    nombreCompleto: string;

    @Column({
        name: 'email',
        unique: true,
        nullable: false
    })
    email: string;

    @Column({ 
        name: 'password_hash',
        nullable: false,
        select: false 
    })
    passwordHash: string;

    @Column({ 
        name: 'es_activo',
        default: true 
    })
    esActivo: boolean;

    @Column({
        type: 'enum',
        enum: ['laboratorista', 'director', 'jerarquico'],
        default: 'laboratorista'
    })
    rol: RolUsuario;

    @Column({ 
        name: 'reset_password_token',
        nullable: true,
        select: false 
    })
    resetPasswordToken: string;

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

    @DeleteDateColumn({ name: 'eliminado_en' }) 
    eliminadoEn: Date;
}