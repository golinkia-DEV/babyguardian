import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AppJwtAuthGuard } from '../auth/app-jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('events')
@ApiBearerAuth()
@UseGuards(AppJwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create event (from hub device)' })
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Get('home/:homeId')
  @ApiOperation({ summary: 'Get events by home' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  findByHome(
    @Param('homeId') homeId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.eventsService.findByHome(homeId, limit, offset);
  }

  @Patch(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge an event' })
  acknowledge(@Param('id') id: string, @Request() req) {
    return this.eventsService.acknowledge(id, req.user.id);
  }
}
