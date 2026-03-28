import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomesService } from './homes.service';
import { HomesController } from './homes.controller';
import { Home } from './home.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Home]), AuthModule],
  controllers: [HomesController],
  providers: [HomesService],
  exports: [HomesService],
})
export class HomesModule {}
