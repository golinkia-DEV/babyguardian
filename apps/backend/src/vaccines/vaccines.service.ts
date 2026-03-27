import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VaccineCatalog } from './vaccine-catalog.entity';
import { BabyVaccine } from './baby-vaccine.entity';
import { BabiesService } from '../babies/babies.service';
import { RecordVaccineDto } from './dto/record-vaccine.dto';

@Injectable()
export class VaccinesService {
  constructor(
    @InjectRepository(VaccineCatalog)
    private catalogRepository: Repository<VaccineCatalog>,
    @InjectRepository(BabyVaccine)
    private babyVaccineRepository: Repository<BabyVaccine>,
    private babiesService: BabiesService,
  ) {}

  async getCatalog(countryCode = 'CL'): Promise<VaccineCatalog[]> {
    return this.catalogRepository.find({
      where: { countryCode },
      order: { recommendedAgeMonths: 'ASC', doseNumber: 'ASC' },
    });
  }

  async getBabyVaccines(babyId: string): Promise<BabyVaccine[]> {
    return this.babyVaccineRepository.find({
      where: { babyId },
      order: { scheduledDate: 'ASC' },
    });
  }

  async getBabyVaccinesForUser(userId: string, babyId: string): Promise<BabyVaccine[]> {
    await this.babiesService.findOneForOwner(userId, babyId);
    return this.getBabyVaccines(babyId);
  }

  async recordVaccine(data: Partial<BabyVaccine>): Promise<BabyVaccine> {
    const record = this.babyVaccineRepository.create(data);
    return this.babyVaccineRepository.save(record);
  }

  async recordForOwner(userId: string, dto: RecordVaccineDto): Promise<BabyVaccine> {
    await this.babiesService.findOneForOwner(userId, dto.babyId);
    return this.recordVaccine({
      babyId: dto.babyId,
      vaccineName: dto.vaccineName,
      appliedDate: dto.appliedDate,
      status: dto.status || 'applied',
      notes: dto.notes,
      catalogId: dto.catalogId,
    });
  }

  async updateVaccineStatus(id: string, status: string, appliedDate?: string): Promise<BabyVaccine> {
    await this.babyVaccineRepository.update(id, { status, appliedDate });
    const updated = await this.babyVaccineRepository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Vaccine record not found');
    return updated;
  }

  async updateVaccineStatusForOwner(
    userId: string,
    id: string,
    status: string,
    appliedDate?: string,
  ): Promise<BabyVaccine> {
    const row = await this.babyVaccineRepository.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Vaccine record not found');
    await this.babiesService.findOneForOwner(userId, row.babyId);
    return this.updateVaccineStatus(id, status, appliedDate);
  }

  async generateBabySchedule(babyId: string, birthDate: string, countryCode = 'CL'): Promise<BabyVaccine[]> {
    const catalog = await this.getCatalog(countryCode);
    const birth = new Date(birthDate);

    const existing = await this.getBabyVaccines(babyId);
    const existingCatalogIds = existing.map((v) => v.catalogId);

    const toCreate = catalog.filter((c) => !existingCatalogIds.includes(c.id));

    const records = toCreate.map((c) => {
      const scheduledDate = new Date(birth);
      scheduledDate.setMonth(scheduledDate.getMonth() + c.recommendedAgeMonths);
      return this.babyVaccineRepository.create({
        babyId,
        catalogId: c.id,
        vaccineName: c.vaccineName,
        scheduledDate: scheduledDate.toISOString().split('T')[0],
        status: 'pending',
      });
    });

    return this.babyVaccineRepository.save(records);
  }

  async generateBabyScheduleForUser(
    userId: string,
    babyId: string,
    birthDate: string,
    countryCode = 'CL',
  ): Promise<BabyVaccine[]> {
    await this.babiesService.findOneForOwner(userId, babyId);
    return this.generateBabySchedule(babyId, birthDate, countryCode);
  }
}
