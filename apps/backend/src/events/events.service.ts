import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(dto);
    const saved = await this.eventsRepository.save(event);

    // Trigger push notifications for critical events
    if (dto.severity === 'critical' || dto.eventType === 'cry_detected') {
      await this.notificationsService.sendEventNotification(saved);
    }

    return saved;
  }

  async findByHome(homeId: string, limit = 50, offset = 0) {
    return this.eventsRepository.find({
      where: { homeId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async acknowledge(id: string, userId: string) {
    await this.eventsRepository.update(id, {
      acknowledgedBy: userId,
      acknowledgedAt: new Date(),
    });
    return this.eventsRepository.findOne({ where: { id } });
  }
}
