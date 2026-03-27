import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedingService } from './feeding.service';
import { FeedingController } from './feeding.controller';
import { FeedingRecord } from './feeding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedingRecord])],
  controllers: [FeedingController],
  providers: [FeedingService],
  exports: [FeedingService],
})
export class FeedingModule {}
