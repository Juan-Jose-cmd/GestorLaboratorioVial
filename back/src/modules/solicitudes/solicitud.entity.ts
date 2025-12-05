import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Obra } from "../obras/obra.entity";
import { User } from "../users/user.entity";

export type TipoEnsayo = "suelo" | "hormigon" | "asfalto";

export type EstadoSolicitud =
    | "pendiente"
    | "aceptada"
    | "en_proceso"
    | "finalizada"
    | "cancelada";

export type PrioridadSolicitud = "normal" | "alta" | "urgente";

@Entity({ name: "solicitudes" })
export class SolicitudEnsayo {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Obra, { nullable: false })
    obra: Obra;

    @ManyToOne(() => User, { nullable: false })
    creadoPor: User;

    @Column({
        type: "enum",
        enum: ["suelo", "hormigon", "asfalto"],
    })
    tipo: TipoEnsayo;

    @Column({
        type: "enum",
        enum: ["normal", "alta", "urgente"],
        default: "normal",
    })
    prioridad: PrioridadSolicitud;

    @Column({
        type: "enum",
        enum: ["pendiente", "aceptada", "en_proceso", "finalizada", "cancelada"],
        default: "pendiente",
    })
    estado: EstadoSolicitud;

    @Column({ nullable: true })
    descripcion?: string;

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;
}


