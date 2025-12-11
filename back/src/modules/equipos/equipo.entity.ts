import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, JoinColumn} from "typeorm";
import { Obra } from "../obras/obra.entity";
import { Usuario } from "../users/user.entity";
import { HistorialEquipo } from "./historialEquipo.entity";

export type EstadoEquipo = "operativo" | "en_mantenimiento" | "roto" | "faltante";
export type TipoEquipo = "laboratorio" | "campo" | "oficina" | "vehiculo";

@Entity({ name: 'equipos' })
export class Equipo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'codigo_patrimonial',
        unique: true,
        length: 50
    })
    codigoPatrimonial: string;

    @Column({
        name: 'nombre',
        length: 200
    })
    nombre: string;

    @Column({
        type: 'enum',
        enum: ["laboratorio", "campo", "oficina", "vehiculo"]
    })
    tipo: TipoEquipo;

    @Column({
        type: 'enum',
        enum: ["operativo", "en_mantenimiento", "roto", "faltante"],
        default: 'operativo'
    })
    estado: EstadoEquipo;

    @Column({
        name: 'marca',
        length: 100,
        nullable: true
    })
    marca: string;

    @Column({
        name: 'modelo',
        length: 100,
        nullable: true
    })
    modelo: string;

    @Column({
        name: 'numero_serie',
        length: 100,
        nullable: true
    })
    numeroSerie: string;

    @Column({
        name: 'fecha_adquisicion',
        type: 'date',
        nullable: true
    })
    fechaAdquisicion: Date;

    @Column({
        name: 'valor_adquisicion',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true
    })
    valorAdquisicion: number;

    @Column({
        name: 'proximo_mantenimiento',
        type: 'date',
        nullable: true
    })
    proximoMantenimiento: Date;

    @Column({
        name: 'ubicacion_actual',
        length: 300
    })
    ubicacionActual: string;

    @Column({
        type: 'text',
        nullable: true
    })
    especificaciones: string;

    // RELACIÓN: Obra donde está asignado actualmente
    @ManyToOne(() => Obra, { nullable: true })
    @JoinColumn({ name: 'obra_actual_id' })
    obraActual: Obra | null;

    // RELACIÓN: Responsable actual del equipo
    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'responsable_id' })
    responsable: Usuario | null;

    // RELACIÓN: Historial de movimientos y mantenimientos
    @OneToMany(() => HistorialEquipo, historial => historial.equipo)
    historial: HistorialEquipo[];

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'actualizado_en' })
    actualizadoEn: Date;

    @DeleteDateColumn({ name: 'eliminado_en' })
    eliminadoEn: Date;

    // MÉTODOS DE INSTANCIA
    necesitaMantenimiento(): boolean {
        if (!this.proximoMantenimiento) return false;
        const hoy = new Date();
        const mantenimiento = new Date(this.proximoMantenimiento);
        return mantenimiento <= hoy;
    }

    puedeSerAsignado(): boolean {
        return this.estado === 'operativo';
    }
}
