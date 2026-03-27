import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartDevice } from './smart-device.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(SmartDevice)
    private devicesRepository: Repository<SmartDevice>,
  ) {}

  async findByHome(homeId: string): Promise<SmartDevice[]> {
    return this.devicesRepository.find({ where: { homeId, isActive: true } });
  }

  async create(data: Partial<SmartDevice>): Promise<SmartDevice> {
    const device = this.devicesRepository.create(data);
    return this.devicesRepository.save(device);
  }

  async updateState(id: string, state: Record<string, any>): Promise<SmartDevice> {
    await this.devicesRepository.update(id, { currentState: state });
    return this.devicesRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.devicesRepository.update(id, { isActive: false });
  }
}
