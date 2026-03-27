import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CamerasService } from './cameras.service';

@ApiTags('cameras')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cameras')
export class CamerasController {
  constructor(private camerasService: CamerasService) {}

  @Post()
  @ApiOperation({ summary: 'Register camera in home' })
  create(@Body() body: any) {
    return this.camerasService.create({
      homeId: body.homeId,
      name: body.name,
      brand: body.brand,
      model: body.model,
      ipAddress: body.ipAddress,
      port: body.port || 554,
      username: body.username,
      passwordEncrypted: body.password || body.verifyCode || null,
    });
  }

  @Get('home/:homeId')
  @ApiOperation({ summary: 'Get cameras by home' })
  byHome(@Param('homeId') homeId: string) {
    return this.camerasService.byHome(homeId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove camera' })
  remove(@Param('id') id: string) {
    return this.camerasService.remove(id);
  }
}
