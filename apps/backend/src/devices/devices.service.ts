import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartDevice } from './smart-device.entity';
import { InviteToken } from './invite-token.entity';
import * as net from 'net';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(SmartDevice)
    private devicesRepository: Repository<SmartDevice>,
    @InjectRepository(InviteToken)
    private inviteTokensRepository: Repository<InviteToken>,
  ) {}

  async findByHome(homeId: string): Promise<SmartDevice[]> {
    return this.devicesRepository.find({ where: { homeId, isActive: true } });
  }

  async create(data: Partial<SmartDevice>): Promise<SmartDevice> {
    const currentState = data.currentState || {};
    const device = this.devicesRepository.create({ ...data, currentState });
    return this.devicesRepository.save(device);
  }

  async updateState(id: string, state: Record<string, any>): Promise<SmartDevice> {
    await this.devicesRepository.update(id, { currentState: state });
    return this.devicesRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.devicesRepository.update(id, { isActive: false });
  }

  async createPairingToken(homeId: string, createdBy: string) {
    const token = this.generatePairingCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await this.inviteTokensRepository.save(
      this.inviteTokensRepository.create({
        homeId,
        createdBy,
        token,
        role: 'guest',
        permissions: {},
        expiresAt,
      }),
    );

    return {
      code: token,
      qrData: `babyguardian://pair?code=${token}`,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async getPairingStatus(code: string) {
    const invite = await this.inviteTokensRepository.findOne({ where: { token: code } });
    if (!invite) return { status: 'expired' as const };
    if (invite.usedAt) return { status: 'linked' as const };
    if (invite.expiresAt.getTime() < Date.now()) return { status: 'expired' as const };
    return { status: 'waiting' as const };
  }

  async confirmPairing(code: string, usedBy: string) {
    const invite = await this.inviteTokensRepository.findOne({ where: { token: code } });
    if (!invite || invite.expiresAt.getTime() < Date.now()) {
      return { success: false, reason: 'Token expired or invalid' };
    }
    if (!invite.usedAt) {
      invite.usedAt = new Date();
      invite.usedBy = usedBy;
      await this.inviteTokensRepository.save(invite);
    }
    return { success: true, homeId: invite.homeId };
  }

  async discover(deviceType: 'camera' | 'light' | 'router' | 'sensor', subnet?: string) {
    const networkPrefix = this.normalizeSubnet(subnet);
    const scanPlan = this.getPortsByType(deviceType);
    const hosts = Array.from({ length: 64 }, (_, i) => `${networkPrefix}.${i + 1}`);
    const results: Array<{ ip: string; port: number; brand: string; model?: string; protocol: string }> = [];

    await Promise.all(
      hosts.map(async (ip) => {
        for (const probe of scanPlan) {
          const isOpen = await this.isPortOpen(ip, probe.port, 250);
          if (isOpen) {
            results.push({
              ip,
              port: probe.port,
              brand: probe.brand,
              model: probe.model,
              protocol: probe.protocol,
            });
            break;
          }
        }
      }),
    );

    return results;
  }

  private normalizeSubnet(subnet?: string) {
    if (!subnet) return '192.168.1';
    const cleaned = subnet.trim();
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(cleaned)) return cleaned;
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(cleaned)) {
      return cleaned.split('.').slice(0, 3).join('.');
    }
    return '192.168.1';
  }

  private getPortsByType(deviceType: 'camera' | 'light' | 'router' | 'sensor') {
    if (deviceType === 'camera') {
      return [
        { port: 554, protocol: 'rtsp', brand: 'IP Camera', model: 'RTSP/ONVIF' },
        { port: 80, protocol: 'onvif', brand: 'IP Camera', model: 'HTTP ONVIF' },
      ];
    }
    if (deviceType === 'sensor') {
      return [
        { port: 1883, protocol: 'mqtt', brand: 'Sensor', model: 'MQTT' },
        { port: 80, protocol: 'http', brand: 'Sensor', model: 'HTTP' },
      ];
    }
    if (deviceType === 'router') {
      return [{ port: 80, protocol: 'http', brand: 'Router', model: 'Gateway' }];
    }
    return [
      { port: 80, protocol: 'http', brand: 'Smart Light', model: 'WiFi' },
      { port: 55443, protocol: 'yeelight', brand: 'Yeelight', model: 'Bulb' },
    ];
  }

  private isPortOpen(host: string, port: number, timeoutMs: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let done = false;
      const complete = (status: boolean) => {
        if (!done) {
          done = true;
          socket.destroy();
          resolve(status);
        }
      };
      socket.setTimeout(timeoutMs);
      socket.once('connect', () => complete(true));
      socket.once('error', () => complete(false));
      socket.once('timeout', () => complete(false));
      socket.connect(port, host);
    });
  }

  private generatePairingCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
