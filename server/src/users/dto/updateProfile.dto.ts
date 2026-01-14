import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Nombre del usuario' })
  @IsOptional()
  @IsString({ message: 'Nombre debe ser un string' })
  @MinLength(3, { message: 'Nombre debe tener al menos tres caracteres' })
  @MaxLength(80, { message: 'Nombre de máximo 80 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name?: string;

  @ApiPropertyOptional({ description: 'Número de teléfono' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un string' })
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'Teléfono solo puede contener números, +, -, espacios y paréntesis',
  })
  @MinLength(8, { message: 'El teléfono debe tener al menos 8 dígitos' })
  @MaxLength(20, { message: 'El teléfono debe tener máximo 20 caracteres' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Obra asignada' })
  @IsOptional()
  @IsString({ message: 'La obra debe ser un string' })
  @MinLength(2, { message: 'La obra debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La obra debe tener máximo 100 caracteres' })
  site?: string;

  @ApiPropertyOptional({ description: 'URL del avatar' })
  @IsOptional()
  @IsString({ message: 'avatarUrl debe ser un string' })
  avatarUrl?: string;
}