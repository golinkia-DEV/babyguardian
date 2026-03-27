import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { SmartDevice } from './smart-device.entity';
import { InviteToken } from './invite-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmartDevice, InviteToken])],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
