import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { SmartDevice } from './smart-device.entity';
import { InviteToken } from './invite-token.entity';
import { PairingSession } from './pairing-session.entity';
import { HomesModule } from '../homes/homes.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SmartDevice, InviteToken, PairingSession]), HomesModule, AuthModule],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
