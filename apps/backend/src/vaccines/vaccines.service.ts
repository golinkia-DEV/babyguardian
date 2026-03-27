import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VaccineCatalog } from './vaccine-catalog.entity';
import { BabyVaccine } from './baby-vaccine.entity';

@Injectable()
export class VaccinesService {
  constructor(
    @InjectRepository(VaccineCatalog)
    private catalogRepository: Repository<VaccineCatalog>,
    @InjectRepository(BabyVaccine)
    private babyVaccineRepository: Repository<BabyVaccine>,
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

  async recordVaccine(data: Partial<BabyVaccine>): Promise<BabyVaccine> {
    const record = this.babyVaccineRepository.create(data);
    return this.babyVaccineRepository.save(record);
  }

  async updateVaccineStatus(id: string, status: string, appliedDate?: string): Promise<BabyVaccine> {
    await this.babyVaccineRepository.update(id, { status, appliedDate });
    return this.babyVaccineRepository.findOne({ where: { id } });
  }

  async generateBabySchedule(babyId: string, birthDate: string, countryCode = 'CL'): Promise<BabyVaccine[]> {
    const catalog = await this.getCatalog(countryCode);
    const birth = new Date(birthDate);

    const existing = await this.getBabyVaccines(babyId);
    const existingCatalogIds = existing.map(v => v.catalogId);

    const toCreate = catalog.filter(c => !existingCatalogIds.includes(c.id));

    const records = toCreate.map(c => {
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
}
