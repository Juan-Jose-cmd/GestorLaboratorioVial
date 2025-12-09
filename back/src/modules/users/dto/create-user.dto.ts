import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string;
    
    @IsEmail({}, { message: 'Email inválido' })
    email: string;
    
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
    
    @IsEnum(['laboratorista', 'director', 'jerarquico'], 
        { message: 'Rol inválido. Debe ser: laboratorista, director o jerarquico' })
    rol: string;
}
