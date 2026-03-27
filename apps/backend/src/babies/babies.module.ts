import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BabiesService } from './babies.service';
import { BabiesController } from './babies.controller';
import { Baby } from './baby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Baby])],
  controllers: [BabiesController],
  providers: [BabiesService],
  exports: [BabiesService],
})
export class BabiesModule {}
