import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'home_id' })
  homeId: string;

  @Column({ name: 'baby_id', nullable: true })
  babyId: string;

  @Column({ name: 'camera_id', nullable: true })
  cameraId: string;

  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ default: 'info' })
  severity: string;

  @Column({ nullable: true, type: 'decimal' })
  confidence: number;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @Column({ name: 'acknowledged_by', nullable: true })
  acknowledgedBy: string;

  @Column({ name: 'acknowledged_at', nullable: true, type: 'timestamptz' })
  acknowledgedAt: Date;

  @Column({ name: 'resolved_at', nullable: true, type: 'timestamptz' })
  resolvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
