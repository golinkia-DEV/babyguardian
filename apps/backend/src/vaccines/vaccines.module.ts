import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccinesService } from './vaccines.service';
import { VaccinesController } from './vaccines.controller';
import { VaccineCatalog } from './vaccine-catalog.entity';
import { BabyVaccine } from './baby-vaccine.entity';
import { BabiesModule } from '../babies/babies.module';

@Module({
  imports: [TypeOrmModule.forFeature([VaccineCatalog, BabyVaccine]), BabiesModule],
  controllers: [VaccinesController],
  providers: [VaccinesService],
  exports: [VaccinesService],
})
export class VaccinesModule {}
