export class CreateUserDto {
    email: string;
    password: string;
    nombre: string;
    rol: 'laboratorista' | 'director' | 'jerarquico';
}