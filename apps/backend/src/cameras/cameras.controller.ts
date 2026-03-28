import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppJwtAuthGuard } from '../auth/app-jwt-auth.guard';
import { CamerasService } from './cameras.service';
import { CreateCameraDto } from './dto/create-camera.dto';

@ApiTags('cameras')
@ApiBearerAuth()
@UseGuards(AppJwtAuthGuard)
@Controller('cameras')
export class CamerasController {
  constructor(private camerasService: CamerasService) {}

  @Post()
  @ApiOperation({ summary: 'Register camera in home' })
  create(@Body() dto: CreateCameraDto, @Request() req: { user: { id: string } }) {
    return this.camerasService.create(req.user.id, dto);
  }

  @Get('home/:homeId')
  @ApiOperation({ summary: 'Get cameras by home' })
  byHome(@Param('homeId') homeId: string, @Request() req: { user: { id: string } }) {
    return this.camerasService.byHome(req.user.id, homeId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove camera' })
  remove(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.camerasService.remove(req.user.id, id);
  }
}
