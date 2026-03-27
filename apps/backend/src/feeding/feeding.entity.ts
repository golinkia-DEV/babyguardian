import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('feeding_records')
export class FeedingRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'baby_id' })
  babyId: string;

  @Column({ name: 'recorded_by', nullable: true })
  recordedBy: string;

  @Column({ name: 'feeding_type' })
  feedingType: string;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true, type: 'timestamptz' })
  endTime: Date;

  @Column({ name: 'duration_minutes', nullable: true })
  durationMinutes: number;

  @Column({ name: 'amount_ml', nullable: true })
  amountMl: number;

  @Column({ name: 'breast_side', nullable: true })
  breastSide: string;

  @Column({ name: 'solid_food_description', nullable: true, type: 'text' })
  solidFoodDescription: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
