import {
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';

@ValidatorConstraint({
  name: 'MatchPassword',
  async: false,
})

export class MatchPassword implements ValidatorConstraintInterface {
  validate(
    confirmPassword: string,
    args: ValidationArguments,
  ): Promise<boolean> | boolean {

    const obj = args.object as Record<string, unknown>;
    const key = args.constraints[0];
    const newPassword = obj[key];

    if (confirmPassword !== newPassword) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return 'La contraseña y la confirmacion no coinciden';
  }
}