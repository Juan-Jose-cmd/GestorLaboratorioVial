import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, Min, IsNotEmpty, MinLength } from 'class-validator';
import { EstadoObra } from '../obra.entity';

export class CreateObraDto {
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @IsString()
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    nombre: string;

    @IsNotEmpty({ message: 'La ubicación es requerida' })
    @IsString()
    ubicacion: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    codigoObra?: string;

    @IsOptional()
    @IsDateString()
    fechaInicio?: Date;

    @IsOptional()
    @IsDateString()
    fechaFinEstimada?: Date;

    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'El presupuesto debe ser mayor o igual a 0' })
    presupuesto?: number;

    @IsOptional()
    @IsString()
    cliente?: string;

    @IsNotEmpty({ message: 'El director es requerido' })
    @IsString()
    directorId: string; 

    @IsOptional()
    @IsEnum(['planificada', 'en_progreso', 'pausada', 'finalizada', 'cancelada'])
    estado?: EstadoObra;
}
