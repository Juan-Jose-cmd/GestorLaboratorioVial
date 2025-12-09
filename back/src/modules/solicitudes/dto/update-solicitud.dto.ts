import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitudDto } from './create-solicitud.dto';
import { IsEnum, IsOptional, } from 'class-validator';

export class UpdateSolicitudDto extends PartialType(CreateSolicitudDto) {
    @IsOptional()
    @IsEnum(['pendiente', 'aceptada', 'en_proceso', 'finalizada', 'cancelada'])
    estado?: string;
}