import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('smart_devices')
export class SmartDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'home_id' })
  homeId: string;

  @Column()
  name: string;

  @Column({ name: 'device_type' })
  deviceType: string;

  @Column({ nullable: true })
  protocol: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'mac_address', nullable: true })
  macAddress: string;

  @Column({ name: 'device_id_external', nullable: true })
  deviceIdExternal: string;

  @Column({ name: 'api_key_encrypted', nullable: true, type: 'text' })
  apiKeyEncrypted: string;

  @Column({ name: 'current_state', type: 'jsonb', default: {} })
  currentState: Record<string, any>;

  @Column({ name: 'automation_rules', type: 'jsonb', default: [] })
  automationRules: any[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
