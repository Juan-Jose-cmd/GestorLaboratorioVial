import { IsMimeType, IsOptional } from 'class-validator';
import { IsFile, MaxFileSize } from 'nestjs-form-data';

export class ProfileImageDto {

  @IsFile()
  @MaxFileSize(5 * 1024 * 1024)
  @IsOptional()
  avatar: any;
}