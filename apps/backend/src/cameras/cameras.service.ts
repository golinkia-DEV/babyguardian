import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camera } from './camera.entity';

@Injectable()
export class CamerasService {
  constructor(
    @InjectRepository(Camera)
    private camerasRepository: Repository<Camera>,
  ) {}

  async create(data: Partial<Camera>) {
    const camera = this.camerasRepository.create(data);
    return this.camerasRepository.save(camera);
  }

  async byHome(homeId: string) {
    return this.camerasRepository.find({
      where: { homeId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string) {
    await this.camerasRepository.update(id, { isActive: false });
  }
}
