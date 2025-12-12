import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import { TestRequest } from "./TestRequest.entity";

@Entity('construction_sites')
export class ConstructionSite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;  //ej "Autopista Ruta 9 - Tramo Rosario"

  @Column({ length: 100, nullable: true })
  location: string;  //ej "Km 12+500 al 18+200"

  @Column({ length: 50, nullable: true })
  contractNumber: string;

  @Column({ length: 100, nullable: true })
  client: string;  //empresa contratante

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  //elaciones
  @ManyToMany(() => User, (user) => user.assignedConstructionSites)
  assignedUsers: User[];

  @OneToMany(() => TestRequest, (request) => request.constructionSite)
  testRequests: TestRequest[];
}