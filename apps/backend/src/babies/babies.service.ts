import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Baby } from './baby.entity';
import { HomesService } from '../homes/homes.service';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';

@Injectable()
export class BabiesService {
  constructor(
    @InjectRepository(Baby)
    private babiesRepository: Repository<Baby>,
    private homesService: HomesService,
  ) {}

  async findByHome(homeId: string): Promise<Baby[]> {
    return this.babiesRepository.find({ where: { homeId } });
  }

  async findById(id: string): Promise<Baby | null> {
    return this.babiesRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Baby>): Promise<Baby> {
    const baby = this.babiesRepository.create(data);
    return this.babiesRepository.save(baby);
  }

  async createForOwner(userId: string, dto: CreateBabyDto): Promise<Baby> {
    await this.homesService.assertOwner(userId, dto.homeId);
    return this.create({
      homeId: dto.homeId,
      name: dto.name,
      birthDate: dto.birthDate,
      countryCode: dto.countryCode,
      gender: dto.gender,
    });
  }

  async findByHomeForOwner(userId: string, homeId: string): Promise<Baby[]> {
    await this.homesService.assertOwner(userId, homeId);
    return this.findByHome(homeId);
  }

  async findOneForOwner(userId: string, id: string): Promise<Baby> {
    const baby = await this.findById(id);
    if (!baby) throw new NotFoundException('Baby not found');
    await this.homesService.assertOwner(userId, baby.homeId);
    return baby;
  }

  async update(id: string, data: Partial<Baby>): Promise<Baby> {
    await this.babiesRepository.update(id, data);
    const baby = await this.findById(id);
    if (!baby) throw new NotFoundException('Baby not found');
    return baby;
  }

  async updateForOwner(userId: string, id: string, dto: UpdateBabyDto): Promise<Baby> {
    await this.findOneForOwner(userId, id);
    return this.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.babiesRepository.delete(id);
  }

  async deleteForOwner(userId: string, id: string): Promise<void> {
    await this.findOneForOwner(userId, id);
    await this.delete(id);
  }
}
