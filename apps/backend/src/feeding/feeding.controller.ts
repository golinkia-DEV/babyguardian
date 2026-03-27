import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FeedingService } from './feeding.service';
import { CreateFeedingDto } from './dto/create-feeding.dto';

@ApiTags('feeding')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('feeding')
export class FeedingController {
  constructor(private feedingService: FeedingService) {}

  @Post()
  @ApiOperation({ summary: 'Log a feeding record' })
  create(@Body() dto: CreateFeedingDto, @Request() req: { user: { id: string } }) {
    return this.feedingService.createForUser(req.user.id, dto);
  }

  @Get('baby/:babyId')
  @ApiOperation({ summary: 'Get feeding history for baby' })
  findByBaby(
    @Param('babyId') babyId: string,
    @Request() req: { user: { id: string } },
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const l = limit != null ? Math.min(100, Math.max(1, parseInt(limit, 10) || 20)) : 20;
    const o = offset != null ? Math.max(0, parseInt(offset, 10) || 0) : 0;
    return this.feedingService.findByBabyForUser(req.user.id, babyId, l, o);
  }

  @Get('baby/:babyId/last')
  @ApiOperation({ summary: 'Get last feeding for baby' })
  getLastFeeding(@Param('babyId') babyId: string, @Request() req: { user: { id: string } }) {
    return this.feedingService.getLastFeedingForUser(req.user.id, babyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feeding record' })
  delete(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.feedingService.deleteForUser(req.user.id, id);
  }
}
