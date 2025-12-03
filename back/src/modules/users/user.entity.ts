import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;
}