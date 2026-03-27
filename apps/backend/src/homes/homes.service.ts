import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

  /** Solo el dueño del hogar puede operar sobre recursos ligados al homeId */
  async assertOwner(userId: string, homeId: string): Promise<void> {
    const home = await this.findById(homeId);
    if (!home) throw new NotFoundException('Home not found');
    if (home.ownerId !== userId) {
      throw new ForbiddenException('No tienes acceso a este hogar');
    }
  }

  async findOneForUser(userId: string, id: string): Promise<Home> {
    await this.assertOwner(userId, id);
    const home = await this.findById(id);
    if (!home) throw new NotFoundException('Home not found');
    return home;
  }

  async updateForUser(userId: string, id: string, data: Partial<Home>): Promise<Home> {
    await this.assertOwner(userId, id);
    return this.update(id, data);
  }
}
