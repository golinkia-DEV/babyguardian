import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cameras')
export class Camera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'home_id' })
  homeId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ name: 'onvif_host', nullable: true })
  ipAddress?: string;

  @Column({ name: 'onvif_port', default: 554 })
  port: number;

  @Column({ name: 'onvif_username', nullable: true })
  username?: string;

  @Column({ name: 'onvif_password_encrypted', nullable: true, type: 'text' })
  passwordEncrypted?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
