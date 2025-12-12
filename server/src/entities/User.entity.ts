import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { ConstructionSite } from './ConstructionSite.entity';
import { TestRequest } from './TestRequest.entity';
import { TestResult } from './TestResult.entity';

// enums para valores fijos
export enum UserRol {
    LABORATORIST = 'laboratorist',
    DIRECTOR = 'director',
    HIERARCHICAL = 'hierarchical',
};

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    //datos para auntenticar 
    @Column({ unique: true, length: 100, })
    email: string;

    @Column({ length: 100 })
    password: string;

    //datos del usuario 
    @Column({ length: 100 })
    fullName: string;

    @Column({ length: 20, nullable: true })
    phoneNumber: string;

    @Column({ length: 15, nullable: true })
    dni: string;

    //rol y estado
    @Column({
        type: 'enum',
        enum: UserRol,
        default: UserRol.LABORATORIST
    })
    role: UserRol;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    //relaciones
    @ManyToMany(() => ConstructionSite, (site) => site.assignedUsers)
    @JoinTable({
        name: 'user_construction_sites',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'construction_site_id', referencedColumnName: 'id' }
    })
    assignedConstructionSites: ConstructionSite[];

    @OneToMany(() => TestRequest, (request) => request.requestedBy)
    testRequest: TestRequest[];

    @OneToMany(() => TestResult, (result) => result.performedBy)
    testResults: TestResult[];
};

