import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const PREFIX = 'enc:v1:';

/**
 * Cifrado AES-256-GCM para secretos en reposo (p. ej. credenciales RTSP).
 * Si no hay CAMERA_ENCRYPTION_KEY, deriva clave de JWT_SECRET (solo desarrollo).
 */
@Injectable()
export class FieldEncryptionService {
  constructor(private configService: ConfigService) {}

  private getKey(): Buffer {
    const explicit = this.configService.get<string>('camera.encryptionKey');
    const fallback = this.configService.get<string>('jwt.secret');
    const raw = explicit || fallback || 'dev-only-insecure';
    return createHash('sha256').update(raw, 'utf8').digest();
  }

  encrypt(plain: string | null | undefined): string | null {
    if (plain == null || plain === '') return null;
    const key = this.getKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    const payload = Buffer.concat([iv, tag, enc]).toString('base64');
    return `${PREFIX}${payload}`;
  }

  decrypt(stored: string | null | undefined): string | null {
    if (stored == null || stored === '') return null;
    if (!stored.startsWith(PREFIX)) {
      return stored;
    }
    const raw = Buffer.from(stored.slice(PREFIX.length), 'base64');
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const data = raw.subarray(28);
    const key = this.getKey();
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  }
}
