import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateSolicitudDto {
    @IsUUID('4', { message: 'ID de obra inválido' })
    obraId: string;
    
    @IsEnum(['suelo', 'hormigon', 'asfalto'], 
        { message: 'Tipo de ensayo inválido' })
    tipo: string;
    
    @IsOptional()
    @IsEnum(['normal', 'alta', 'urgente'], 
        { message: 'Prioridad inválida' })
    prioridad?: string;
    
    @IsOptional()
    descripcion?: string;
}