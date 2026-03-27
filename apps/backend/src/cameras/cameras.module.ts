import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Camera } from './camera.entity';
import { CamerasController } from './cameras.controller';
import { CamerasService } from './cameras.service';

@Module({
  imports: [TypeOrmModule.forFeature([Camera])],
  controllers: [CamerasController],
  providers: [CamerasService],
  exports: [CamerasService],
})
export class CamerasModule {}
