import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('invite_tokens')
export class InviteToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'home_id' })
  homeId: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column()
  token: string;

  @Column({ default: 'guest' })
  role: string;

  @Column({ type: 'jsonb', default: {} })
  permissions: Record<string, any>;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'used_by', nullable: true })
  usedBy?: string;

  @Column({ name: 'used_at', nullable: true, type: 'timestamptz' })
  usedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
