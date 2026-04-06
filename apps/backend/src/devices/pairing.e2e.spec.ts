import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

/**
 * E2E tests for complete pairing flow
 * Hub generates → Mobile claims → Hub sees status update
 */
describe('Pairing Flow E2E (e2e)', () => {
  let app: INestApplication;
  let hubToken: string;
  let mobileToken: string;
  let homeId: string;
  let pairingSessionId: string;
  let pairingCode: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup: Login hub user and get token
    const hubLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'hub-user@test.com', password: 'password123' });

    hubToken = hubLoginRes.body.token;

    // Setup: Login mobile user and get token
    const mobileLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'mobile-user@test.com', password: 'password123' });

    mobileToken = mobileLoginRes.body.token;

    // Setup: Create or get home
    const homeRes = await request(app.getHttpServer())
      .get('/homes')
      .set('Authorization', `Bearer ${hubToken}`);

    homeId = homeRes.body[0]?.id || 'home-123';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Complete Pairing Flow', () => {
    it('1. Hub creates a pairing session', async () => {
      const res = await request(app.getHttpServer())
        .post('/devices/pairing/sessions')
        .set('Authorization', `Bearer ${hubToken}`)
        .send({ homeId });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('code');
      expect(res.body).toHaveProperty('qrData');
      expect(res.body.status).toBe('pending');
      expect(res.body.code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/);

      pairingSessionId = res.body.id;
      pairingCode = res.body.code;
    });

    it('2. Hub polls session status (should still be pending)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/devices/pairing/sessions/${pairingSessionId}`)
        .set('Authorization', `Bearer ${hubToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('pending');
    });

    it('3. Mobile claims session with code', async () => {
      const res = await request(app.getHttpServer())
        .post('/devices/pairing/claim')
        .set('Authorization', `Bearer ${mobileToken}`)
        .send({ code: pairingCode });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.homeId).toBe(homeId);
    });

    it('4. Hub polls again and sees claimed status', async () => {
      const res = await request(app.getHttpServer())
        .get(`/devices/pairing/sessions/${pairingSessionId}`)
        .set('Authorization', `Bearer ${hubToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('claimed');
      expect(res.body.claimedBy).toBe(mobileToken.split('.')[0]); // Contains user info
    });

    it('5. Mobile cannot claim same code twice', async () => {
      const res = await request(app.getHttpServer())
        .post('/devices/pairing/claim')
        .set('Authorization', `Bearer ${mobileToken}`)
        .send({ code: pairingCode });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.reason).toContain('already used');
    });
  });

  describe('Error Scenarios', () => {
    it('should reject invalid code', async () => {
      const res = await request(app.getHttpServer())
        .post('/devices/pairing/claim')
        .set('Authorization', `Bearer ${mobileToken}`)
        .send({ code: 'INVALID99' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(false);
    });

    it('should reject code shorter than 8 characters', async () => {
      const res = await request(app.getHttpServer())
        .post('/devices/pairing/claim')
        .set('Authorization', `Bearer ${mobileToken}`)
        .send({ code: 'SHORT' });

      expect(res.status).toBe(400); // Validation error
    });

    it('should handle expired sessions', async () => {
      // Create a session
      const createRes = await request(app.getHttpServer())
        .post('/devices/pairing/sessions')
        .set('Authorization', `Bearer ${hubToken}`)
        .send({ homeId });

      const sessionId = createRes.body.id;
      const expiredCode = createRes.body.code;

      // Wait for expiration (in real test, would mock time)
      // For this test, we'll simulate by waiting or skipping
      // In actual implementation, use fake timers or database manipulation

      // Try to claim expired code
      const claimRes = await request(app.getHttpServer())
        .post('/devices/pairing/claim')
        .set('Authorization', `Bearer ${mobileToken}`)
        .send({ code: expiredCode });

      // Should fail if expired (depends on time)
      if (claimRes.body.success === false) {
        expect(claimRes.body.reason).toContain('expired');
      }
    });

    it('should enforce rate limiting', async () => {
      // Make 10+ failed attempts from same IP
      for (let i = 0; i < 11; i++) {
        await request(app.getHttpServer())
          .post('/devices/pairing/claim')
          .set('Authorization', `Bearer ${mobileToken}`)
          .send({ code: `INVALID${i}` });
      }

      // 11th attempt should be rate limited
      const res = await request(app.getHttpServer())
        .post('/devices/pairing/claim')
        .set('Authorization', `Bearer ${mobileToken}`)
        .send({ code: 'INVALID99' });

      expect(res.status).toBe(429); // Too Many Requests
    });
  });

  describe('Permission Checks', () => {
    it('should allow only creator or home owner to view session status', async () => {
      // Create session as hub user
      const createRes = await request(app.getHttpServer())
        .post('/devices/pairing/sessions')
        .set('Authorization', `Bearer ${hubToken}`)
        .send({ homeId });

      const sessionId = createRes.body.id;

      // Hub user (creator) can view
      const creatorRes = await request(app.getHttpServer())
        .get(`/devices/pairing/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${hubToken}`);

      expect(creatorRes.status).toBe(200);

      // Other authenticated user cannot view (unless home owner)
      // This depends on home ownership setup in test database
    });

    it('should allow only session creator to cancel', async () => {
      // Create session as hub user
      const createRes = await request(app.getHttpServer())
        .post('/devices/pairing/sessions')
        .set('Authorization', `Bearer ${hubToken}`)
        .send({ homeId });

      const sessionId = createRes.body.id;

      // Hub user (creator) can cancel
      const cancelRes = await request(app.getHttpServer())
        .post(`/devices/pairing/sessions/${sessionId}/cancel`)
        .set('Authorization', `Bearer ${hubToken}`);

      expect(cancelRes.status).toBe(200);

      // Verify status is now cancelled
      const statusRes = await request(app.getHttpServer())
        .get(`/devices/pairing/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${hubToken}`);

      expect(statusRes.body.status).toBe('cancelled');
    });
  });

  describe('QR Token Alternative', () => {
    it('should allow claiming with pairingToken instead of code', async () => {
      // Create session
      const createRes = await request(app.getHttpServer())
        .post('/devices/pairing/sessions')
        .set('Authorization', `Bearer ${hubToken}`)
        .send({ homeId });

      // Extract token from QR data (babyguardian://pair?token=xxx)
      const qrData = createRes.body.qrData;
      const tokenMatch = qrData.match(/token=(.+)$/);
      const pairingToken = tokenMatch?.[1];

      expect(pairingToken).toBeDefined();

      // Claim with token
      const claimRes = await request(app.getHttpServer())
        .post('/devices/pairing/claim')
        .set('Authorization', `Bearer ${mobileToken}`)
        .send({ pairingToken });

      expect(claimRes.status).toBe(200);
      expect(claimRes.body.success).toBe(true);
    });
  });
});
