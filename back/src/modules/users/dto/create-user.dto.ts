import { IsEmail, IsString, MinLength, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'El nombre completo es requerido' })
    @IsString()
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    nombreCompleto: string;

    @IsNotEmpty({ message: 'El email es requerido' })
    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsNotEmpty({ message: 'El rol es requerido' })
    @IsIn(['laboratorista', 'director', 'jerarquico'], { 
        message: 'Rol inválido. Debe ser: laboratorista, director o jerarquico' 
    })
    rol: 'laboratorista' | 'director' | 'jerarquico';
}