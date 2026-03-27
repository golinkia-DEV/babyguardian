import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './home.entity';

@Injectable()
export class HomesService {
  constructor(
    @InjectRepository(Home)
    private homesRepository: Repository<Home>,
  ) {}

  async create(data: Partial<Home>): Promise<Home> {
    const home = this.homesRepository.create(data);
    return this.homesRepository.save(home);
  }

  async findByOwner(ownerId: string): Promise<Home[]> {
    return this.homesRepository.find({ where: { ownerId } });
  }

  async findById(id: string): Promise<Home | null> {
    return this.homesRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Home>): Promise<Home> {
    await this.homesRepository.update(id, data);
    const home = await this.findById(id);
    if (!home) throw new NotFoundException('Home not found');
    return home;
  }
}
