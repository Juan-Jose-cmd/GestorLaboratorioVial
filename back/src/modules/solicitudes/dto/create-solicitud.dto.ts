import { IsEnum, IsNotEmpty, IsString, IsDateString, IsOptional, IsObject } from 'class-validator';
import { TipoEnsayo, PrioridadSolicitud } from '../solicitud.entity';

export class CreateSolicitudDto {
    @IsNotEmpty({ message: 'La descripción es requerida' })
    @IsString()
    descripcion: string;

    @IsNotEmpty({ message: 'El tipo de ensayo es requerido' })
    @IsEnum(['suelo', 'hormigon', 'asfalto'])
    tipoEnsayo: TipoEnsayo;

    @IsNotEmpty({ message: 'La obra es requerida' })
    @IsString()
    obraId: string;

    @IsNotEmpty({ message: 'La fecha requerida es obligatoria' })
    @IsDateString()
    fechaRequerida: Date;

    @IsOptional()
    @IsDateString()
    fechaLimite?: Date;

    @IsOptional()
    @IsEnum(['baja', 'media', 'alta', 'urgente'])
    prioridad?: PrioridadSolicitud;

    @IsOptional()
    @IsObject()
    parametrosEspeciales?: Record<string, any>;

    @IsOptional()
    @IsString()
    comentariosCancelacion?: string;
}