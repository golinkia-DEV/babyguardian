import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DevicesService } from './devices.service';

@ApiTags('devices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Get('home/:homeId')
  @ApiOperation({ summary: 'Get smart devices by home' })
  findByHome(@Param('homeId') homeId: string) {
    return this.devicesService.findByHome(homeId);
  }

  @Post()
  @ApiOperation({ summary: 'Register smart device' })
  create(@Body() body: any) {
    return this.devicesService.create(body);
  }

  @Post('discover')
  @ApiOperation({ summary: 'Discover local network devices by type' })
  discover(@Body() body: { deviceType: 'camera' | 'light' | 'router' | 'sensor'; subnet?: string }) {
    return this.devicesService.discover(body.deviceType, body.subnet);
  }

  @Post('pairing-token')
  @ApiOperation({ summary: 'Create tablet pairing token (5 min)' })
  createPairingToken(@Body() body: { homeId: string }, @Request() req) {
    return this.devicesService.createPairingToken(body.homeId, req.user.id);
  }

  @Get('pairing-status/:code')
  @ApiOperation({ summary: 'Get pairing status by code' })
  getPairingStatus(@Param('code') code: string) {
    return this.devicesService.getPairingStatus(code);
  }

  @Post('pairing-confirm')
  @ApiOperation({ summary: 'Confirm pairing from hub' })
  confirmPairing(@Body() body: { code: string }, @Request() req) {
    return this.devicesService.confirmPairing(body.code, req.user.id);
  }

  @Patch(':id/state')
  @ApiOperation({ summary: 'Update device state' })
  updateState(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.devicesService.updateState(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove device' })
  delete(@Param('id') id: string) {
    return this.devicesService.delete(id);
  }
}
