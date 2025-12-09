import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, } from "typeorm";
import { Obra } from "../obras/obra.entity";

export type EstadoEquipo = "operativo" | "mantenimiento" | "fuera_de_servicio";

@Entity({ name: "equipos" })
export class Equipo {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", nullable: false })
    nombre: string;

    @Column({ type: "varchar", nullable: true })
    descripcion: string;

    @Column({ type: "varchar", nullable: false })
    codigoInterno: string;

    @Column({
        type: "enum",
        enum: ["operativo", "mantenimiento", "fuera_de_servicio"],
        default: "operativo",
    })
    estado: EstadoEquipo;

    @ManyToOne(() => Obra, { nullable: true })
    obraActual: Obra; 

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;
}
