import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camera } from './camera.entity';
import { HomesService } from '../homes/homes.service';
import { FieldEncryptionService } from '../common/field-encryption.service';
import { CreateCameraDto } from './dto/create-camera.dto';

@Injectable()
export class CamerasService {
  constructor(
    @InjectRepository(Camera)
    private camerasRepository: Repository<Camera>,
    private homesService: HomesService,
    private fieldEncryption: FieldEncryptionService,
  ) {}

  async create(userId: string, dto: CreateCameraDto): Promise<Record<string, unknown>> {
    await this.homesService.assertOwner(userId, dto.homeId);

    const secret = dto.password || dto.verifyCode || null;
    const passwordEncrypted = this.fieldEncryption.encrypt(secret || undefined);

    const camera = this.camerasRepository.create({
      homeId: dto.homeId,
      name: dto.name,
      brand: dto.brand,
      model: dto.model,
      ipAddress: dto.ipAddress,
      port: dto.port ?? 554,
      username: dto.username,
      passwordEncrypted: passwordEncrypted || undefined,
      isActive: true,
    });
    const saved = await this.camerasRepository.save(camera);
    return this.toPublic(saved);
  }

  async byHome(userId: string, homeId: string): Promise<Record<string, unknown>[]> {
    await this.homesService.assertOwner(userId, homeId);
    const list = await this.camerasRepository.find({
      where: { homeId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return list.map((c) => this.toPublic(c));
  }

  async remove(userId: string, id: string): Promise<void> {
    const cam = await this.camerasRepository.findOne({ where: { id } });
    if (!cam) throw new NotFoundException('Camera not found');
    await this.homesService.assertOwner(userId, cam.homeId);
    await this.camerasRepository.update(id, { isActive: false });
  }

  private toPublic(c: Camera): Record<string, unknown> {
    return {
      id: c.id,
      homeId: c.homeId,
      name: c.name,
      brand: c.brand,
      model: c.model,
      ipAddress: c.ipAddress,
      port: c.port,
      username: c.username,
      isActive: c.isActive,
      createdAt: c.createdAt,
    };
  }
}
