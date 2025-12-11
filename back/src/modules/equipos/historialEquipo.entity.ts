import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, } from "typeorm";
import { Equipo } from "../equipos/equipo.entity";
import { Obra } from "../obras/obra.entity";
import { Usuario } from "../users/user.entity";

export type TipoMovimiento =
    | "asignacion"        
    | "cambio_obra"      
    | "retiro_obra"    
    | "mantenimiento";  

@Entity({ name: "historial_equipo" })
export class HistorialEquipo {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Equipo, { nullable: false })
    equipo: Equipo;

    @ManyToOne(() => Obra, { nullable: true })
    obraOrigen: Obra | null;

    @ManyToOne(() => Obra, { nullable: true })
    obraDestino: Obra | null;

    @ManyToOne(() => Usuario, { nullable: true })
    realizadoPor: Usuario | null;

    @Column({
        type: "enum",
        enum: ["asignacion", "cambio_obra", "retiro_obra", "mantenimiento"],
    })
    tipo: TipoMovimiento;

    @Column({ type: "text", nullable: true })
    descripcion?: string;

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;
}

