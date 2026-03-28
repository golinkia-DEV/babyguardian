import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedingService } from './feeding.service';
import { FeedingController } from './feeding.controller';
import { FeedingRecord } from './feeding.entity';
import { BabiesModule } from '../babies/babies.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FeedingRecord]), BabiesModule, AuthModule],
  controllers: [FeedingController],
  providers: [FeedingService],
  exports: [FeedingService],
})
export class FeedingModule {}
