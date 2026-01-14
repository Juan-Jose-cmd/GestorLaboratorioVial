import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./createUser.dto";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { Role } from "../roles.enum";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(Role, { message: 'Rol no válido' })
  role?: Role;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser booleano' })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isExternal debe ser booleano' })
  isExternal?: boolean;
}