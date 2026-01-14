import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsEnum,
  IsBoolean,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Role } from '../roles.enum';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nombre no puede estar vacío' })
  @IsString({ message: 'Nombre debe ser un string' })
  @MinLength(3, { message: 'Nombre debe tener al menos tres caracteres' })
  @MaxLength(80, { message: 'Nombre de máximo 80 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name: string;

  @IsNotEmpty({ message: 'Email no puede estar vacío' })
  @IsEmail({}, { message: 'Email debe ser un email válido' })
  @MaxLength(100, { message: 'Email de máximo 100 caracteres' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString({ message: 'La contraseña debe ser un string' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Contraseña debe tener al menos 8 caracteres, una minúscula, una mayúscula, un número y un símbolo (@!#$%&)',
    },
  )
  @MaxLength(100, { message: 'La contraseña debe tener máximo 100 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El número de teléfono es requerido' })
  @IsString({ message: 'El teléfono debe ser un string' })
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'Teléfono solo puede contener números, +, -, espacios y paréntesis',
  })
  @MinLength(8, { message: 'El teléfono debe tener al menos 8 dígitos' })
  @MaxLength(20, { message: 'El teléfono debe tener máximo 20 caracteres' })
  phone: string;

  @IsNotEmpty({ message: 'La obra es requerida' })
  @IsString({ message: 'La obra debe ser un string' })
  @MinLength(2, { message: 'La obra debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La obra debe tener máximo 100 caracteres' })
  site: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Rol no válido' })
  @IsString({ message: 'El rol debe ser un string' })
  role?: Role = Role.Laboratorist;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser booleano' })
  isActive?: boolean = true;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @IsOptional()
  @IsString({ message: 'Nombre debe ser un string' })
  @MinLength(3, { message: 'Nombre debe tener al menos tres caracteres' })
  @MaxLength(80, { message: 'Nombre de máximo 80 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email debe ser un email válido' })
  @MaxLength(100, { message: 'Email de máximo 100 caracteres' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un string' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Contraseña debe tener al menos 8 caracteres, una minúscula, una mayúscula, un número y un símbolo (@!#$%&)',
    },
  )
  @MaxLength(100, { message: 'La contraseña debe tener máximo 100 caracteres' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un string' })
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'Teléfono solo puede contener números, +, -, espacios y paréntesis',
  })
  @MinLength(8, { message: 'El teléfono debe tener al menos 8 dígitos' })
  @MaxLength(20, { message: 'El teléfono debe tener máximo 20 caracteres' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'La obra debe ser un string' })
  @MinLength(2, { message: 'La obra debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La obra debe tener máximo 100 caracteres' })
  site?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Rol no válido' })
  @IsString({ message: 'El rol debe ser un string' })
  role?: Role;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser booleano' })
  isActive?: boolean;

}

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}