import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Camera } from './camera.entity';
import { CamerasController } from './cameras.controller';
import { CamerasService } from './cameras.service';
import { HomesModule } from '../homes/homes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Camera]), HomesModule],
  controllers: [CamerasController],
  providers: [CamerasService],
  exports: [CamerasService],
})
export class CamerasModule {}
