import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;
  
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;
  
  @IsOptional()
  @IsString()
  language?: string;
}