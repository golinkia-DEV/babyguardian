import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Baby } from './baby.entity';

@Injectable()
export class BabiesService {
  constructor(
    @InjectRepository(Baby)
    private babiesRepository: Repository<Baby>,
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

  async update(id: string, data: Partial<Baby>): Promise<Baby> {
    await this.babiesRepository.update(id, data);
    const baby = await this.findById(id);
    if (!baby) throw new NotFoundException('Baby not found');
    return baby;
  }

  async delete(id: string): Promise<void> {
    await this.babiesRepository.delete(id);
  }
}
