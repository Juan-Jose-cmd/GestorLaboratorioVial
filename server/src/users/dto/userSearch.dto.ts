import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString } from "class-validator";
import { Role } from "../roles.enum";

export class UserSearchDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Rol no válido' })
  role?: Role;

  @IsOptional()
  @IsString()
  site?: string;

  @IsOptional()
  @Type(() => Boolean) // Transforma string 'true'/'false' a boolean
  @IsBoolean({ message: 'isActive debe ser booleano' })
  isActive?: boolean;

  @IsOptional()
  @IsDateString({}, { message: 'Fecha desde debe ser una fecha válida' })
  desde?: string; // Recibir como string ISO

  @IsOptional()
  @IsDateString({}, { message: 'Fecha hasta debe ser una fecha válida' })
  hasta?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página debe ser un número entero' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Límite debe ser un número entero' })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'sortOrder debe ser ASC o DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
