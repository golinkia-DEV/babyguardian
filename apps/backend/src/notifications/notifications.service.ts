import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private configService: ConfigService) {}

  async sendEventNotification(event: any): Promise<void> {
    const fcmKey = this.configService.get('fcm.serverKey');
    if (!fcmKey) {
      this.logger.warn('FCM key not configured, skipping push notification');
      return;
    }

    try {
      const title = this.getEventTitle(event.eventType);
      const body = this.getEventBody(event);

      this.logger.log(`Sending push notification: ${title} for event ${event.id}`);

      // FCM HTTP v1 API integration
      // In production: use firebase-admin to send to registered device tokens
      // filtered by event.homeId
    } catch (error) {
      this.logger.error('Failed to send push notification', error);
    }
  }

  private getEventTitle(eventType: string): string {
    const titles: Record<string, string> = {
      cry_detected: 'El bebe esta llorando',
      security_alert: 'Alerta de seguridad',
      unknown_face: 'Persona desconocida detectada',
      person_detected: 'Persona detectada',
      motion_detected: 'Movimiento detectado',
      feeding_reminder: 'Recordatorio de alimentacion',
      vaccine_reminder: 'Recordatorio de vacuna',
    };
    return titles[eventType] || 'Alerta BabyGuardian';
  }

  private getEventBody(event: any): string {
    if (event.eventType === 'cry_detected') {
      const confidence = event.confidence ? Math.round(event.confidence * 100) : 0;
      return `Llanto detectado con ${confidence}% de confianza`;
    }
    return 'Toca para ver los detalles';
  }
}
