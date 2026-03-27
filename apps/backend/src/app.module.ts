import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BabiesModule } from './babies/babies.module';
import { EventsModule } from './events/events.module';
import { FeedingModule } from './feeding/feeding.module';
import { VaccinesModule } from './vaccines/vaccines.module';
import { HomesModule } from './homes/homes.module';
import { DevicesModule } from './devices/devices.module';
import { NotificationsModule } from './notifications/notifications.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('database.url'),
        autoLoadEntities: true,
        synchronize: configService.get('app.env') === 'development',
        logging: configService.get('app.env') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    BabiesModule,
    EventsModule,
    FeedingModule,
    VaccinesModule,
    HomesModule,
    DevicesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
