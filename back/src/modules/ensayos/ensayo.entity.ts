import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ChildEntity, TableInheritance, DeleteDateColumn } from "typeorm";
import { Usuario } from "../users/user.entity";
import { Obra } from "../obras/obra.entity";
import { SolicitudEnsayo } from "../solicitudes/solicitud.entity";

export type EstadoEnsayo = "pendiente" | "en_proceso" | "completado" | "cancelado";
export type ResultadoEnsayo = "aprobado" | "rechazado" | "condicional" | "pendiente";

@Entity({ name: 'ensayos' })
@TableInheritance({ column: { type: "varchar", name: "tipo" } })
export abstract class Ensayo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'codigo_ensayo',
        unique: true,
        length: 50
    })
    codigoEnsayo: string;

    @Column({
        type: 'enum',
        enum: ["pendiente", "en_proceso", "completado", "cancelado"],
        default: 'pendiente'
    })
    estado: EstadoEnsayo;

    @Column({
        type: 'enum',
        enum: ["aprobado", "rechazado", "condicional", "pendiente"],
        default: 'pendiente'
    })
    resultado: ResultadoEnsayo;

    @Column({
        name: 'fecha_inicio',
        type: 'timestamp',
        nullable: true
    })
    fechaInicio: Date;

    @Column({
        name: 'fecha_fin',
        type: 'timestamp',
        nullable: true
    })
    fechaFin: Date;

    @Column({
        type: 'text',
        nullable: true
    })
    observaciones: string;

    @Column({
        name: 'ruta_informe',
        type: 'text',
        nullable: true
    })
    rutaInforme: string;

    // RELACIÓN: Laboratorista asignado
    @ManyToOne(() => Usuario, { nullable: false })
    @JoinColumn({ name: 'laboratorista_id' })
    laboratorista: Usuario;

    // RELACIÓN: Obra relacionada
    @ManyToOne(() => Obra, { nullable: false })
    @JoinColumn({ name: 'obra_id' })
    obra: Obra;

    // RELACIÓN: Solicitud que originó este ensayo
    @OneToOne(() => SolicitudEnsayo, solicitud => solicitud.ensayo, { nullable: true })
    @JoinColumn({ name: 'solicitud_id' })
    solicitud: SolicitudEnsayo | null;

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'actualizado_en' })
    actualizadoEn: Date;

    @DeleteDateColumn({ name: 'eliminado_en' })
    eliminadoEn: Date;

    abstract obtenerMetricas(): Record<string, any>;
}

// ENSAYO DE SUELO
@ChildEntity()
export class EnsayoSuelo extends Ensayo {
    @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
    contenidoHumedad: number; // %

    @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
    densidadSeca: number; // g/cm³

    @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
    limiteLiquido: number;

    @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
    limitePlastico: number;

    @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
    indicePlasticidad: number;

    @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
    cbr: number; // %

    obtenerMetricas(): Record<string, any> {
        return {
            contenidoHumedad: this.contenidoHumedad,
            densidadSeca: this.densidadSeca,
            limiteLiquido: this.limiteLiquido,
            limitePlastico: this.limitePlastico,
            indicePlasticidad: this.indicePlasticidad,
            cbr: this.cbr
        };
    }
}

// ENSAYO DE HORMIGÓN
@ChildEntity()
export class EnsayoHormigon extends Ensayo {
    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    resistenciaCompresion: number; // MPa

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    asentamientoCono: number; // cm

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    temperatura: number; // °C

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    densidad: number; // kg/m³

    @Column({ type: 'varchar', length: 50, nullable: true })
    tipoCemento: string;

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    relacionAguaCemento: number;

    obtenerMetricas(): Record<string, any> {
        return {
            resistenciaCompresion: this.resistenciaCompresion,
            asentamientoCono: this.asentamientoCono,
            temperatura: this.temperatura,
            densidad: this.densidad,
            tipoCemento: this.tipoCemento,
            relacionAguaCemento: this.relacionAguaCemento
        };
    }
}

// ENSAYO DE ASFALTO
@ChildEntity()
export class EnsayoAsfalto extends Ensayo {
    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    penetracion: number; // 0.1 mm

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    puntoAblandamiento: number; // °C

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    ductilidad: number; // cm

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    pesoEspecifico: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    tipoAsfalto: string;

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    contenidoBitumen: number; // %

    obtenerMetricas(): Record<string, any> {
        return {
            penetracion: this.penetracion,
            puntoAblandamiento: this.puntoAblandamiento,
            ductilidad: this.ductilidad,
            pesoEspecifico: this.pesoEspecifico,
            tipoAsfalto: this.tipoAsfalto,
            contenidoBitumen: this.contenidoBitumen
        };
    }
}