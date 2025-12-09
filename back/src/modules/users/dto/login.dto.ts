import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Email inválido' })
    email: string;
    
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    password: string;
}