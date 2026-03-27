import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FeedingService } from './feeding.service';

@ApiTags('feeding')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('feeding')
export class FeedingController {
  constructor(private feedingService: FeedingService) {}

  @Post()
  @ApiOperation({ summary: 'Log a feeding record' })
  create(@Body() body: any, @Request() req) {
    return this.feedingService.create({ ...body, recordedBy: req.user.id });
  }

  @Get('baby/:babyId')
  @ApiOperation({ summary: 'Get feeding history for baby' })
  findByBaby(
    @Param('babyId') babyId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.feedingService.findByBaby(babyId, limit, offset);
  }

  @Get('baby/:babyId/last')
  @ApiOperation({ summary: 'Get last feeding for baby' })
  getLastFeeding(@Param('babyId') babyId: string) {
    return this.feedingService.getLastFeeding(babyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feeding record' })
  delete(@Param('id') id: string) {
    return this.feedingService.delete(id);
  }
}
