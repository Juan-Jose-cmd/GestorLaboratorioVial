import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, } from "typeorm";

import { Obra } from "../obras/obra.entity";
import { SolicitudEnsayo } from "../solicitudes/solicitud.entity";
import { User } from "../users/user.entity";

export type EstadoEnsayo = "pendiente" | "en_proceso" | "finalizado";

@Entity({ name: "ensayos" })
export class Ensayo {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Obra, { nullable: false })
    obra: Obra;

    @OneToOne(() => SolicitudEnsayo, { nullable: false })
    @JoinColumn()
    solicitud: SolicitudEnsayo;

    @ManyToOne(() => User, { nullable: false })
    laboratorista: User;

    @Column({
        type: "jsonb",
        nullable: false,
    })
    datos: any; 

    @Column({
        type: "enum",
        enum: ["pendiente", "en_proceso", "finalizado"],
        default: "pendiente",
    })
    estado: EstadoEnsayo;

    @Column("text", { array: true, nullable: true })
    imagenesGraficos: string[];

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;
}