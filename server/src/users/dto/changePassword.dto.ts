import { IsNotEmpty, IsEmail, MaxLength, IsString, IsStrongPassword, Validate } from 'class-validator';
import { MatchPassword } from 'src/decorators/password.decorators';

export class ChangePasswordDto {
  
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
  oldPassword: string;

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
  newPassword: string;


  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @Validate(MatchPassword, ['newPassword'])
  confirmPassword: string;
}
export class ResetPasswordRequestDto {

  @IsNotEmpty({ message: 'Email no puede estar vacío' })
  @IsEmail({}, { message: 'Email debe ser un email válido' })
  @MaxLength(100, { message: 'Email de máximo 100 caracteres' })
  email: string;

}

export class ResetPasswordConfirmDto {

  @IsNotEmpty({ message: 'El token es requerido'})
  @IsString()
  token: string;

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
  newPassword: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @Validate(MatchPassword, ['newPassword'])
  confirmPassword: string;
}
