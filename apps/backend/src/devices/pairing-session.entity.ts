import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('pairing_sessions')
@Index(['code'], { unique: true })
@Index(['status', 'expiresAt'])
@Index(['homeId'])
@Index(['createdBy'])
export class PairingSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'pairing_token', unique: true })
  pairingToken: string;

  @Column({ name: 'home_id' })
  homeId: string;

  @Column({ name: 'hub_device_id', nullable: true })
  hubDeviceId?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'claimed', 'expired', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'claimed' | 'expired' | 'cancelled';

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'claimed_by', nullable: true })
  claimedBy?: string;

  @Column({ name: 'claimed_from_ip', nullable: true })
  claimedFromIp?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'claimed_at', nullable: true, type: 'timestamptz' })
  claimedAt?: Date;

  @Column({ name: 'cancelled_at', nullable: true, type: 'timestamptz' })
  cancelledAt?: Date;
}
