import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../users/user.entity";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

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

    @ManyToOne(() => User, { nullable: false })
    director: User;

    @Column({
        type: 'enum',
        enum: ["activa", "pausada", "finalizada"],
        default: 'activa'
    })
    estado: EstadoObra;

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;

}