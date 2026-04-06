import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { SmartDevice } from './smart-device.entity';
import { InviteToken } from './invite-token.entity';
import { PairingSession } from './pairing-session.entity';
import * as net from 'net';
import { HomesService } from '../homes/homes.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DiscoverDeviceDto } from './dto/discover-device.dto';
import { CreatePairingSessionDto } from './dto/create-pairing-session.dto';
import { ClaimPairingSessionDto } from './dto/claim-pairing-session.dto';
import { PairingSessionResponseDto, ClaimResponseDto, PairingStatusResponseDto } from './dto/pairing-session-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DevicesService {
  private readonly PAIRING_TTL_MINUTES = 5;
  private readonly PAIRING_CODE_LENGTH = 8;
  private readonly MAX_FAILED_ATTEMPTS = 10;
  private readonly FAILED_ATTEMPTS_WINDOW_MINUTES = 10;

  constructor(
    @InjectRepository(SmartDevice)
    private devicesRepository: Repository<SmartDevice>,
    @InjectRepository(InviteToken)
    private inviteTokensRepository: Repository<InviteToken>,
    @InjectRepository(PairingSession)
    private pairingSessionsRepository: Repository<PairingSession>,
    private homesService: HomesService,
  ) {}

  async findById(id: string): Promise<SmartDevice | null> {
    return this.devicesRepository.findOne({ where: { id } });
  }

  async findByHome(homeId: string): Promise<SmartDevice[]> {
    return this.devicesRepository.find({ where: { homeId, isActive: true } });
  }

  async findByHomeForUser(userId: string, homeId: string): Promise<SmartDevice[]> {
    await this.homesService.assertOwner(userId, homeId);
    return this.findByHome(homeId);
  }

  async create(data: Partial<SmartDevice>): Promise<SmartDevice> {
    const currentState = data.currentState || {};
    const device = this.devicesRepository.create({ ...data, currentState });
    return this.devicesRepository.save(device);
  }

  async createForUser(userId: string, dto: CreateDeviceDto): Promise<SmartDevice> {
    await this.homesService.assertOwner(userId, dto.homeId);
    return this.create({
      homeId: dto.homeId,
      name: dto.name,
      deviceType: dto.deviceType,
      protocol: dto.protocol,
      ipAddress: dto.ipAddress,
      currentState: dto.currentState,
    });
  }

  async updateState(id: string, state: Record<string, unknown>): Promise<SmartDevice> {
    await this.devicesRepository.update(id, { currentState: state as Record<string, any> });
    const device = await this.devicesRepository.findOne({ where: { id } });
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  async updateStateForUser(userId: string, id: string, state: Record<string, unknown>): Promise<SmartDevice> {
    const d = await this.findById(id);
    if (!d) throw new NotFoundException('Device not found');
    await this.homesService.assertOwner(userId, d.homeId);
    return this.updateState(id, state);
  }

  async delete(id: string): Promise<void> {
    await this.devicesRepository.update(id, { isActive: false });
  }

  async deleteForUser(userId: string, id: string): Promise<void> {
    const d = await this.findById(id);
    if (!d) throw new NotFoundException('Device not found');
    await this.homesService.assertOwner(userId, d.homeId);
    await this.delete(id);
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

  async createPairingTokenForUser(userId: string, homeId: string) {
    await this.homesService.assertOwner(userId, homeId);
    return this.createPairingToken(homeId, userId);
  }

  /**
   * Solo el creador del token o el dueño del hogar pueden ver el estado real;
   * para el resto se responde como expirado para no filtrar existencia del código.
   */
  async getPairingStatusForUser(userId: string, code: string) {
    const invite = await this.inviteTokensRepository.findOne({ where: { token: code } });
    if (!invite) return { status: 'expired' as const };
    if (invite.createdBy !== userId) {
      try {
        await this.homesService.assertOwner(userId, invite.homeId);
      } catch {
        return { status: 'expired' as const };
      }
    }
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

  async discover(dto: DiscoverDeviceDto) {
    return this.scanNetwork(dto.deviceType, dto.subnet);
  }

  private async scanNetwork(deviceType: 'camera' | 'light' | 'router' | 'sensor', subnet?: string) {
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

  private generatePairingCode(): string {
    // Base32 without ambiguous characters: 0/O, 1/I/l
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < this.PAIRING_CODE_LENGTH; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Hub creates a pairing session and gets code + QR payload
   */
  async createPairingSessionForUser(
    userId: string,
    dto: CreatePairingSessionDto,
  ): Promise<PairingSessionResponseDto> {
    // Verify user owns this home
    await this.homesService.assertOwner(userId, dto.homeId);

    const code = this.generatePairingCode();
    const pairingToken = uuidv4();
    const expiresAt = new Date(Date.now() + this.PAIRING_TTL_MINUTES * 60 * 1000);

    const session = this.pairingSessionsRepository.create({
      code,
      pairingToken,
      homeId: dto.homeId,
      hubDeviceId: dto.hubDeviceId,
      status: 'pending',
      expiresAt,
      createdBy: userId,
    });

    await this.pairingSessionsRepository.save(session);

    return {
      id: session.id,
      code: session.code,
      qrData: `babyguardian://pair?token=${pairingToken}`,
      expiresAt: session.expiresAt.toISOString(),
      status: session.status,
    };
  }

  /**
   * Get pairing session status (with permission checks)
   */
  async getPairingSessionStatus(
    userId: string,
    sessionId: string,
  ): Promise<PairingStatusResponseDto> {
    const session = await this.pairingSessionsRepository.findOne({ where: { id: sessionId } });

    if (!session) {
      throw new NotFoundException('Pairing session not found');
    }

    // Only creator or home owner can view status
    const isCreator = session.createdBy === userId;
    const isOwner = await this.homesService
      .assertOwner(userId, session.homeId)
      .then(() => true)
      .catch(() => false);

    if (!isCreator && !isOwner) {
      throw new BadRequestException('Not authorized to view this session');
    }

    // Check if expired
    if (session.expiresAt.getTime() < Date.now()) {
      return {
        status: 'expired',
      };
    }

    return {
      status: session.status,
      claimedBy: session.claimedBy,
      claimedAt: session.claimedAt?.toISOString(),
    };
  }

  /**
   * Cancel a pairing session (hub only)
   */
  async cancelPairingSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.pairingSessionsRepository.findOne({ where: { id: sessionId } });

    if (!session) {
      throw new NotFoundException('Pairing session not found');
    }

    // Only creator can cancel
    if (session.createdBy !== userId) {
      throw new BadRequestException('Only creator can cancel this session');
    }

    session.status = 'cancelled';
    session.cancelledAt = new Date();
    await this.pairingSessionsRepository.save(session);
  }

  /**
   * Mobile claims a pairing session using code or token
   */
  async claimPairingSession(
    userId: string,
    ipAddress: string,
    dto: ClaimPairingSessionDto,
  ): Promise<ClaimResponseDto> {
    if (!dto.code && !dto.pairingToken) {
      throw new BadRequestException('Either code or pairingToken must be provided');
    }

    // Rate limiting check
    await this.checkRateLimit(userId, ipAddress);

    let session: PairingSession | null = null;

    if (dto.code) {
      session = await this.pairingSessionsRepository.findOne({
        where: { code: dto.code.toUpperCase() },
      });
    } else if (dto.pairingToken) {
      session = await this.pairingSessionsRepository.findOne({
        where: { pairingToken: dto.pairingToken },
      });
    }

    if (!session) {
      await this.recordFailedAttempt(userId, ipAddress);
      return {
        success: false,
        reason: 'Invalid pairing code or token',
      };
    }

    // Check if expired
    if (session.expiresAt.getTime() < Date.now()) {
      await this.recordFailedAttempt(userId, ipAddress);
      return {
        success: false,
        reason: 'Pairing code expired',
      };
    }

    // Check if already claimed (one-time use)
    if (session.claimedAt) {
      await this.recordFailedAttempt(userId, ipAddress);
      return {
        success: false,
        reason: 'Pairing code already used',
      };
    }

    // Claim the session
    session.status = 'claimed';
    session.claimedBy = userId;
    session.claimedAt = new Date();
    session.claimedFromIp = ipAddress;

    await this.pairingSessionsRepository.save(session);

    return {
      success: true,
      homeId: session.homeId,
    };
  }

  /**
   * Check rate limiting for failed attempts
   */
  private async checkRateLimit(userId: string, ipAddress: string): Promise<void> {
    const windowStart = new Date(
      Date.now() - this.FAILED_ATTEMPTS_WINDOW_MINUTES * 60 * 1000,
    );

    const failedCount = await this.pairingSessionsRepository
      .createQueryBuilder()
      .where(
        '(claimed_by = :userId OR claimed_from_ip = :ipAddress) AND claimed_at IS NULL AND expires_at < NOW() AND created_at > :windowStart',
        {
          userId,
          ipAddress,
          windowStart,
        },
      )
      .getCount();

    if (failedCount >= this.MAX_FAILED_ATTEMPTS) {
      throw new HttpException(
        `Too many failed attempts. Try again in ${this.FAILED_ATTEMPTS_WINDOW_MINUTES} minutes.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /**
   * Record a failed claim attempt for rate limiting
   */
  private async recordFailedAttempt(userId: string, ipAddress: string): Promise<void> {
    // Create a temporary failed record for rate limiting
    // (This could be moved to a separate table if needed)
    const failedSession = this.pairingSessionsRepository.create({
      code: `FAILED-${Date.now()}`,
      pairingToken: uuidv4(),
      homeId: 'temp',
      status: 'expired',
      expiresAt: new Date(Date.now() - 1),
      createdBy: userId,
      claimedBy: userId,
      claimedFromIp: ipAddress,
      claimedAt: new Date(),
    });
    await this.pairingSessionsRepository.save(failedSession);
  }

  /**
   * Clean up expired pairing sessions (should be called via cron job)
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.pairingSessionsRepository.delete({
      expiresAt: MoreThan(new Date()),
      status: 'pending',
    });
    return result.affected || 0;
  }
}
