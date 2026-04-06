import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, Ip } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppJwtAuthGuard } from '../auth/app-jwt-auth.guard';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DiscoverDeviceDto } from './dto/discover-device.dto';
import { PairingTokenDto } from './dto/pairing-token.dto';
import { PairingConfirmDto } from './dto/pairing-confirm.dto';
import { CreatePairingSessionDto } from './dto/create-pairing-session.dto';
import { ClaimPairingSessionDto } from './dto/claim-pairing-session.dto';
import { PairingSessionResponseDto, ClaimResponseDto, PairingStatusResponseDto } from './dto/pairing-session-response.dto';

@ApiTags('devices')
@ApiBearerAuth()
@UseGuards(AppJwtAuthGuard)
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

  @Post('pairing/sessions')
  @ApiOperation({
    summary: 'Create pairing session (hub generates code)',
    description: 'Hub creates a new pairing session. Returns code and QR payload for mobile to claim.',
  })
  @ApiResponse({
    status: 201,
    description: 'Pairing session created',
    type: PairingSessionResponseDto,
  })
  createPairingSession(
    @Body() dto: CreatePairingSessionDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.devicesService.createPairingSessionForUser(req.user.id, dto);
  }

  @Get('pairing/sessions/:sessionId')
  @ApiOperation({
    summary: 'Get pairing session status',
    description: 'Poll for session status. Only creator or home owner can view.',
  })
  @ApiResponse({
    status: 200,
    description: 'Session status',
    type: PairingStatusResponseDto,
  })
  getPairingSessionStatus(
    @Param('sessionId') sessionId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.devicesService.getPairingSessionStatus(req.user.id, sessionId);
  }

  @Post('pairing/sessions/:sessionId/cancel')
  @ApiOperation({
    summary: 'Cancel pairing session',
    description: 'Only creator can cancel.',
  })
  cancelPairingSession(
    @Param('sessionId') sessionId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.devicesService.cancelPairingSession(req.user.id, sessionId);
  }

  @Post('pairing/claim')
  @ApiOperation({
    summary: 'Claim pairing session (mobile)',
    description: 'Mobile claims session using code or pairingToken. Links mobile user to home.',
  })
  @ApiResponse({
    status: 200,
    description: 'Claim result',
    type: ClaimResponseDto,
  })
  claimPairingSession(
    @Body() dto: ClaimPairingSessionDto,
    @Request() req: { user: { id: string } },
    @Ip() ipAddress: string,
  ) {
    return this.devicesService.claimPairingSession(req.user.id, ipAddress, dto);
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
