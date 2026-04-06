import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevicesService } from './devices.service';
import { SmartDevice } from './smart-device.entity';
import { InviteToken } from './invite-token.entity';
import { PairingSession } from './pairing-session.entity';
import { HomesService } from '../homes/homes.service';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

describe('DevicesService - Pairing Flow', () => {
  let service: DevicesService;
  let pairingSessionsRepository: Repository<PairingSession>;
  let homesService: HomesService;

  const testUserId = 'user-123';
  const testHomeId = 'home-123';
  const testIpAddress = '192.168.1.100';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: getRepositoryToken(SmartDevice),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(InviteToken),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PairingSession),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: HomesService,
          useValue: {
            assertOwner: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
    pairingSessionsRepository = module.get<Repository<PairingSession>>(
      getRepositoryToken(PairingSession),
    );
    homesService = module.get<HomesService>(HomesService);
  });

  describe('createPairingSessionForUser', () => {
    it('should create a pairing session with valid code format', async () => {
      const dto = { homeId: testHomeId };

      jest.spyOn(homesService, 'assertOwner').mockResolvedValue(undefined);
      jest.spyOn(pairingSessionsRepository, 'create').mockReturnValue({
        id: 'session-123',
        code: 'K7M4P2Q9',
        pairingToken: 'token-123',
        homeId: testHomeId,
        status: 'pending',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        createdBy: testUserId,
      } as PairingSession);

      jest.spyOn(pairingSessionsRepository, 'save').mockResolvedValue({
        id: 'session-123',
        code: 'K7M4P2Q9',
        pairingToken: 'token-123',
        homeId: testHomeId,
        status: 'pending',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        createdBy: testUserId,
      } as PairingSession);

      const result = await service.createPairingSessionForUser(testUserId, dto);

      expect(result.code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/);
      expect(result.qrData).toContain('babyguardian://pair?token=');
      expect(result.status).toBe('pending');
    });

    it('should verify home ownership before creating session', async () => {
      const dto = { homeId: testHomeId };

      jest.spyOn(homesService, 'assertOwner').mockRejectedValue(new Error('Not owner'));

      await expect(
        service.createPairingSessionForUser(testUserId, dto),
      ).rejects.toThrow();
    });

    it('should generate codes without ambiguous characters', async () => {
      const dto = { homeId: testHomeId };

      jest.spyOn(homesService, 'assertOwner').mockResolvedValue(undefined);

      for (let i = 0; i < 20; i++) {
        jest.spyOn(pairingSessionsRepository, 'create').mockReturnValue({
          id: `session-${i}`,
          code: '',
          pairingToken: 'token',
          homeId: testHomeId,
          status: 'pending',
          expiresAt: new Date(),
          createdBy: testUserId,
        } as PairingSession);

        jest.spyOn(pairingSessionsRepository, 'save').mockImplementation((entity: any) => {
          return Promise.resolve(entity);
        });

        const result = await service.createPairingSessionForUser(testUserId, dto);

        // Verify no ambiguous characters
        expect(result.code).not.toMatch(/[0OIl1]/);
      }
    });
  });

  describe('claimPairingSession', () => {
    it('should claim session with valid code', async () => {
      const session: Partial<PairingSession> = {
        id: 'session-123',
        code: 'K7M4P2Q9',
        pairingToken: 'token-123',
        homeId: testHomeId,
        status: 'pending',
        expiresAt: new Date(Date.now() + 60000),
        createdBy: testUserId,
        claimedAt: null,
      };

      jest
        .spyOn(pairingSessionsRepository, 'findOne')
        .mockResolvedValue(session as PairingSession);
      jest
        .spyOn(pairingSessionsRepository, 'createQueryBuilder')
        .mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(0),
        } as any);
      jest
        .spyOn(pairingSessionsRepository, 'save')
        .mockResolvedValue({ ...session, status: 'claimed', claimedBy: testUserId } as PairingSession);

      const result = await service.claimPairingSession(testUserId, testIpAddress, {
        code: 'K7M4P2Q9',
      });

      expect(result.success).toBe(true);
      expect(result.homeId).toBe(testHomeId);
    });

    it('should reject expired code', async () => {
      const session: Partial<PairingSession> = {
        id: 'session-123',
        code: 'K7M4P2Q9',
        expiresAt: new Date(Date.now() - 1000), // expired
      };

      jest
        .spyOn(pairingSessionsRepository, 'findOne')
        .mockResolvedValue(session as PairingSession);
      jest
        .spyOn(pairingSessionsRepository, 'createQueryBuilder')
        .mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(0),
        } as any);

      const result = await service.claimPairingSession(testUserId, testIpAddress, {
        code: 'K7M4P2Q9',
      });

      expect(result.success).toBe(false);
      expect(result.reason).toContain('expired');
    });

    it('should reject already-used code (one-time use)', async () => {
      const session: Partial<PairingSession> = {
        id: 'session-123',
        code: 'K7M4P2Q9',
        expiresAt: new Date(Date.now() + 60000),
        claimedAt: new Date(), // Already claimed
      };

      jest
        .spyOn(pairingSessionsRepository, 'findOne')
        .mockResolvedValue(session as PairingSession);
      jest
        .spyOn(pairingSessionsRepository, 'createQueryBuilder')
        .mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(0),
        } as any);

      const result = await service.claimPairingSession(testUserId, testIpAddress, {
        code: 'K7M4P2Q9',
      });

      expect(result.success).toBe(false);
      expect(result.reason).toContain('already used');
    });

    it('should enforce rate limiting on failed attempts', async () => {
      jest
        .spyOn(pairingSessionsRepository, 'createQueryBuilder')
        .mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(10), // Already at limit
        } as any);

      await expect(
        service.claimPairingSession(testUserId, testIpAddress, { code: 'INVALID' }),
      ).rejects.toThrow(HttpException);
    });

    it('should require either code or pairingToken', async () => {
      jest
        .spyOn(pairingSessionsRepository, 'createQueryBuilder')
        .mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(0),
        } as any);

      await expect(
        service.claimPairingSession(testUserId, testIpAddress, {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should support claiming by pairingToken as alternative to code', async () => {
      const token = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const session: Partial<PairingSession> = {
        id: 'session-123',
        pairingToken: token,
        homeId: testHomeId,
        status: 'pending',
        expiresAt: new Date(Date.now() + 60000),
        claimedAt: null,
      };

      jest
        .spyOn(pairingSessionsRepository, 'findOne')
        .mockResolvedValue(session as PairingSession);
      jest
        .spyOn(pairingSessionsRepository, 'createQueryBuilder')
        .mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(0),
        } as any);
      jest
        .spyOn(pairingSessionsRepository, 'save')
        .mockResolvedValue({ ...session, status: 'claimed' } as PairingSession);

      const result = await service.claimPairingSession(testUserId, testIpAddress, {
        pairingToken: token,
      });

      expect(result.success).toBe(true);
      expect(result.homeId).toBe(testHomeId);
    });
  });

  describe('getPairingSessionStatus', () => {
    it('should return status for session creator', async () => {
      const session: Partial<PairingSession> = {
        id: 'session-123',
        createdBy: testUserId,
        homeId: testHomeId,
        status: 'pending',
        expiresAt: new Date(Date.now() + 60000),
      };

      jest
        .spyOn(pairingSessionsRepository, 'findOne')
        .mockResolvedValue(session as PairingSession);
      jest.spyOn(homesService, 'assertOwner').mockRejectedValue(new Error('Not owner'));

      const result = await service.getPairingSessionStatus(testUserId, 'session-123');

      expect(result.status).toBe('pending');
    });

    it('should return status for home owner', async () => {
      const session: Partial<PairingSession> = {
        id: 'session-123',
        createdBy: 'other-user',
        homeId: testHomeId,
        status: 'pending',
        expiresAt: new Date(Date.now() + 60000),
      };

      jest
        .spyOn(pairingSessionsRepository, 'findOne')
        .mockResolvedValue(session as PairingSession);
      jest.spyOn(homesService, 'assertOwner').mockResolvedValue(undefined);

      const result = await service.getPairingSessionStatus(testUserId, 'session-123');

      expect(result.status).toBe('pending');
    });

    it('should mark expired session as expired', async () => {
      const session: Partial<PairingSession> = {
        id: 'session-123',
        createdBy: testUserId,
        expiresAt: new Date(Date.now() - 1000), // Expired
      };

      jest
        .spyOn(pairingSessionsRepository, 'findOne')
        .mockResolvedValue(session as PairingSession);

      const result = await service.getPairingSessionStatus(testUserId, 'session-123');

      expect(result.status).toBe('expired');
    });
  });

  describe('cancelPairingSession', () => {
    it('should allow session creator to cancel', async () => {
      const session: Partial<PairingSession> = {
        id: 'session-123',
        createdBy: testUserId,
        status: 'pending',
      };

      jest
        .spyOn(pairingSessionsRepository, 'findOne')
        .mockResolvedValue(session as PairingSession);
      jest
        .spyOn(pairingSessionsRepository, 'save')
        .mockResolvedValue({ ...session, status: 'cancelled' } as PairingSession);

      await service.cancelPairingSession(testUserId, 'session-123');

      expect(pairingSessionsRepository.save).toHaveBeenCalled();
    });

    it('should prevent non-creator from canceling', async () => {
      const session: Partial<PairingSession> = {
        id: 'session-123',
        createdBy: 'other-user',
        status: 'pending',
      };

      jest
        .spyOn(pairingSessionsRepository, 'findOne')
        .mockResolvedValue(session as PairingSession);

      await expect(
        service.cancelPairingSession(testUserId, 'session-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should delete expired pending sessions', async () => {
      jest
        .spyOn(pairingSessionsRepository, 'delete')
        .mockResolvedValue({ affected: 5 } as any);

      const result = await service.cleanupExpiredSessions();

      expect(result).toBe(5);
      expect(pairingSessionsRepository.delete).toHaveBeenCalled();
    });
  });
});
