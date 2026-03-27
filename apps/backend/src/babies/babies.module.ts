import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BabiesService } from './babies.service';
import { BabiesController } from './babies.controller';
import { Baby } from './baby.entity';
import { HomesModule } from '../homes/homes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Baby]), HomesModule],
  controllers: [BabiesController],
  providers: [BabiesService],
  exports: [BabiesService],
})
export class BabiesModule {}
