import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateObraDto {
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string;
    
    @IsNotEmpty({ message: 'La ubicación es requerida' })
    ubicacion: string;
    
    @IsNotEmpty({ message: 'El director es requerido' })
    directorId: string;
    
    @IsOptional()
    @IsEnum(['activa', 'pausada', 'finalizada'], 
        { message: 'Estado inválido' })
    estado?: string;
}