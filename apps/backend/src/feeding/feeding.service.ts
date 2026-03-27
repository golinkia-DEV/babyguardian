import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedingRecord } from './feeding.entity';

@Injectable()
export class FeedingService {
  constructor(
    @InjectRepository(FeedingRecord)
    private feedingRepository: Repository<FeedingRecord>,
  ) {}

  async create(data: Partial<FeedingRecord>): Promise<FeedingRecord> {
    const record = this.feedingRepository.create(data);
    return this.feedingRepository.save(record);
  }

  async findByBaby(babyId: string, limit = 20, offset = 0): Promise<FeedingRecord[]> {
    return this.feedingRepository.find({
      where: { babyId },
      order: { startTime: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getLastFeeding(babyId: string): Promise<FeedingRecord | null> {
    return this.feedingRepository.findOne({
      where: { babyId },
      order: { startTime: 'DESC' },
    });
  }

  async delete(id: string): Promise<void> {
    await this.feedingRepository.delete(id);
  }
}
