import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import { ConstructionSite } from './ConstructionSite.entity';
import { TestResult } from './TestResult.entity';

export enum TestType {
    PROCTOR = 'proctor',
    CBR = 'cbr',
    GRANULOMETRY ='granulometry',
    SAND_EQUIVALENT = 'sand _equivalent',
    CONCRETE_SLAB = 'concrete_slab',
};

export enum Priority {
    LOW = 'low',
    NORMAL = 'normal',
    HIGH = 'high',
    URGENT = 'urgent'
};

export enum RequestStatus {
    PENDING = 'pending',
    ASSIGNED = 'assigned',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
};

@Entity('test_request')
export class TestRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    //datos del ensayo
    @Column({
        type: 'enum',
        enum: TestType
    })
    testType : TestType;

    @Column({
        type: 'enum',
        enum: Priority,
        default: Priority.NORMAL
    })
    priority: Priority;

    @Column({ 
        type: 'enum',
        enum: RequestStatus,
        default : RequestStatus.PENDING
    })
    status: RequestStatus;

    //muestra
    @Column({ length: 50 })
    sampleCode: string; //ej "OBRA-001-PROCTOR-2024"

    @Column({ length: 100, nullable: true })
    sampleLocation: string;  //ej "Km 12+500, Talud derecho"

    @Column({ type: 'timestamp' })
    requiredDate: Date;  //fecha requerida de entrega

    @Column({ type: 'text', nullable: true })
    observations: string;  //0bservaciones del solicitante

    //metadatos
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    assignedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

    //relaciones
    @ManyToOne(() => User, (user) => user.testRequest)
    requestedBy: User;  // Quién solicitó

    @ManyToOne(() => User, { nullable: true })
    assignedTo: User;  //laboratorista asignado

    @ManyToOne(() => ConstructionSite)
    constructionSite: ConstructionSite;  //obra relacionada

    @OneToOne(() => TestResult, (result) => result.testRequest, { nullable: true })
    testResult: TestResult;  //resultado del ensayo

};