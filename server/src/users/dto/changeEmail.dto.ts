import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class ChangeEmailRequestDto {

  @IsNotEmpty({ message: 'Email no puede estar vacío' })
  @IsEmail({}, { message: 'Email debe ser un email válido' })
  @MaxLength(100, { message: 'Email de máximo 100 caracteres' })
  newEmail: string;

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
}

export class ChangeEmailConfirmDto {

  @IsNotEmpty()
  @IsString()
  token: string;
}