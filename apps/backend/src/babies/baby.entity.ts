import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('babies')
export class Baby {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'home_id' })
  homeId: string;

  @Column()
  name: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ name: 'birth_weight_grams', nullable: true })
  birthWeightGrams: number;

  @Column({ name: 'birth_height_cm', nullable: true, type: 'decimal' })
  birthHeightCm: number;

  @Column({ name: 'blood_type', nullable: true })
  bloodType: string;

  @Column({ name: 'medical_notes', nullable: true, type: 'text' })
  medicalNotes: string;

  @Column({ name: 'photo_url', nullable: true, type: 'text' })
  photoUrl: string;

  @Column({ name: 'country_code', default: 'CL' })
  countryCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
