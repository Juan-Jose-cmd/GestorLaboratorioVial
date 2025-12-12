import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { TestRequest } from './TestRequest.entity';
import { User } from './User.entity';

// Interface para los puntos de la curva
export interface CompactionPoint {
  moisturePercent: number;    //% humedad
  dryDensity: number;         //densidad seca (g/cm³)
  wetWeight: number;          //peso húmedo (g)
  dryWeight: number;          //peso seco (g)
  volume: number;             //volumen del molde (cm³)
};

@Entity('test_results')
export class TestResult {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    //relacion con la peticion
    @OneToOne(() => TestRequest, (request) => request.testResult)
    @JoinColumn()
    testRequest: TestRequest;

    //quien realizo el ensayo
    @ManyToOne(() => User, (user) => user.testResults)
    performedBy: User;

    //fecha
    @Column({ type: 'timestamp' })
    testDate: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    //datos del ensayo (proctor)
  @Column({ length: 50 })
  norm: string;  //ej "IRAM 9512", "ASTM D698"

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  maxDryDensity: number;  //densidad máxima seca (g/cm³)

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  optimumMoisture: number;  //humedad óptima (%)

  //curva de comparacion (almacenada como JSON)
  @Column({ type: 'jsonb' })
  compactionCurve: CompactionPoint[];

  //calculos
  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  wetDensity: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  moistureContent: number;

  //observaciones
  @Column({ type: 'text', nullable: true })
  observations: string;

  //archivos (paths o URLs)
  @Column({ nullable: true })
  pdfReportPath: string;  //ruta al PDF generado

  @Column({ nullable: true })
  chartImagePath: string;  //ruta a la imagen de la gráfica

  //verificacion
  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  verifiedBy: User;
};
