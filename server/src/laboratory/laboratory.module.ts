import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from './entitie/laboratory.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Laboratory])],
  exports: [TypeOrmModule],
})
export class LaboratoryModule {}