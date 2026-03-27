import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
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
