import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, } from "typeorm";
import { Ensayo } from "../ensayos/ensayo.entity";
import { Usuario } from "../users/user.entity";

export type EstadoInforme = "pendiente" | "generado" | "entregado";

@Entity({ name: "informes" })
export class Informe {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Ensayo, { nullable: false })
  @JoinColumn()
  ensayo: Ensayo;

  @ManyToOne(() => Usuario, { nullable: false })
  generadoPor: Usuario;

  @Column({
    type: "enum",
    enum: ["pendiente", "generado", "entregado"],
    default: "pendiente",
  })
  estado: EstadoInforme;

  @Column({ type: "text", nullable: false })
  archivoUrl: string;

  @Column({ type: "text", nullable: false })
  nombreArchivo: string;

  @Column({ type: "int", default: 1 })
  version: number;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
