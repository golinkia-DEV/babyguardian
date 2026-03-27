import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vaccines_catalog')
export class VaccineCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'country_code', default: 'CL' })
  countryCode: string;

  @Column({ name: 'vaccine_name' })
  vaccineName: string;

  @Column({ name: 'diseases_covered', type: 'text', array: true, nullable: true })
  diseasesCovered: string[];

  @Column({ name: 'recommended_age_months' })
  recommendedAgeMonths: number;

  @Column({ name: 'dose_number', default: 1 })
  doseNumber: number;

  @Column({ name: 'is_mandatory', default: true })
  isMandatory: boolean;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
