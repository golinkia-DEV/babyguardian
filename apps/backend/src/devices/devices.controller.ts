import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DiscoverDeviceDto } from './dto/discover-device.dto';
import { PairingTokenDto } from './dto/pairing-token.dto';
import { PairingConfirmDto } from './dto/pairing-confirm.dto';

@ApiTags('devices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Get('home/:homeId')
  @ApiOperation({ summary: 'Get smart devices by home' })
  findByHome(@Param('homeId') homeId: string, @Request() req: { user: { id: string } }) {
    return this.devicesService.findByHomeForUser(req.user.id, homeId);
  }

  @Post()
  @ApiOperation({ summary: 'Register smart device' })
  create(@Body() dto: CreateDeviceDto, @Request() req: { user: { id: string } }) {
    return this.devicesService.createForUser(req.user.id, dto);
  }

  @Post('discover')
  @ApiOperation({ summary: 'Discover local network devices by type' })
  discover(@Body() dto: DiscoverDeviceDto) {
    return this.devicesService.discover(dto);
  }

  @Post('pairing-token')
  @ApiOperation({ summary: 'Create tablet pairing token (5 min)' })
  createPairingToken(@Body() dto: PairingTokenDto, @Request() req: { user: { id: string } }) {
    return this.devicesService.createPairingTokenForUser(req.user.id, dto.homeId);
  }

  @Get('pairing-status/:code')
  @ApiOperation({ summary: 'Get pairing status (solo creador del token o dueño del hogar)' })
  getPairingStatus(@Param('code') code: string, @Request() req: { user: { id: string } }) {
    return this.devicesService.getPairingStatusForUser(req.user.id, code);
  }

  @Post('pairing-confirm')
  @ApiOperation({ summary: 'Confirm pairing from hub' })
  confirmPairing(@Body() dto: PairingConfirmDto, @Request() req: { user: { id: string } }) {
    return this.devicesService.confirmPairing(dto.code, req.user.id);
  }

  @Patch(':id/state')
  @ApiOperation({ summary: 'Update device state' })
  updateState(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Request() req: { user: { id: string } },
  ) {
    return this.devicesService.updateStateForUser(req.user.id, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove device' })
  delete(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.devicesService.deleteForUser(req.user.id, id);
  }
}
