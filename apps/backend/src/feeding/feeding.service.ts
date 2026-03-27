import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedingRecord } from './feeding.entity';
import { BabiesService } from '../babies/babies.service';
import { CreateFeedingDto } from './dto/create-feeding.dto';

@Injectable()
export class FeedingService {
  constructor(
    @InjectRepository(FeedingRecord)
    private feedingRepository: Repository<FeedingRecord>,
    private babiesService: BabiesService,
  ) {}

  async create(data: Partial<FeedingRecord>): Promise<FeedingRecord> {
    const record = this.feedingRepository.create(data);
    return this.feedingRepository.save(record);
  }

  async createForUser(userId: string, dto: CreateFeedingDto): Promise<FeedingRecord> {
    await this.babiesService.findOneForOwner(userId, dto.babyId);
    return this.create({
      babyId: dto.babyId,
      feedingType: dto.feedingType,
      startTime: new Date(dto.startTime),
      durationMinutes: dto.durationMinutes,
      amountMl: dto.amountMl,
      breastSide: dto.breastSide,
      notes: dto.notes,
      recordedBy: userId,
    });
  }

  async findByBaby(babyId: string, limit = 20, offset = 0): Promise<FeedingRecord[]> {
    return this.feedingRepository.find({
      where: { babyId },
      order: { startTime: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findByBabyForUser(
    userId: string,
    babyId: string,
    limit = 20,
    offset = 0,
  ): Promise<FeedingRecord[]> {
    await this.babiesService.findOneForOwner(userId, babyId);
    return this.findByBaby(babyId, limit, offset);
  }

  async getLastFeeding(babyId: string): Promise<FeedingRecord | null> {
    return this.feedingRepository.findOne({
      where: { babyId },
      order: { startTime: 'DESC' },
    });
  }

  async getLastFeedingForUser(userId: string, babyId: string): Promise<FeedingRecord | null> {
    await this.babiesService.findOneForOwner(userId, babyId);
    return this.getLastFeeding(babyId);
  }

  async delete(id: string): Promise<void> {
    await this.feedingRepository.delete(id);
  }

  async deleteForUser(userId: string, id: string): Promise<void> {
    const row = await this.feedingRepository.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Feeding record not found');
    await this.babiesService.findOneForOwner(userId, row.babyId);
    await this.delete(id);
  }
}
