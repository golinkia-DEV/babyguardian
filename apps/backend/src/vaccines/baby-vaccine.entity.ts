import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('baby_vaccines')
export class BabyVaccine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'baby_id' })
  babyId: string;

  @Column({ name: 'catalog_id', nullable: true })
  catalogId: string;

  @Column({ name: 'vaccine_name', nullable: true })
  vaccineName: string;

  @Column({ name: 'applied_date', nullable: true, type: 'date' })
  appliedDate: string;

  @Column({ name: 'scheduled_date', nullable: true, type: 'date' })
  scheduledDate: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ name: 'batch_number', nullable: true })
  batchNumber: string;

  @Column({ name: 'healthcare_provider', nullable: true })
  healthcareProvider: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
