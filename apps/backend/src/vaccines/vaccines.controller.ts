import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VaccinesService } from './vaccines.service';

@ApiTags('vaccines')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('vaccines')
export class VaccinesController {
  constructor(private vaccinesService: VaccinesService) {}

  @Get('catalog')
  @ApiOperation({ summary: 'Get vaccine catalog (default: Chile)' })
  getCatalog(@Query('country') country?: string) {
    return this.vaccinesService.getCatalog(country || 'CL');
  }

  @Get('baby/:babyId')
  @ApiOperation({ summary: 'Get vaccine records for baby' })
  getBabyVaccines(@Param('babyId') babyId: string) {
    return this.vaccinesService.getBabyVaccines(babyId);
  }

  @Post('baby/:babyId/generate-schedule')
  @ApiOperation({ summary: 'Generate vaccine schedule for baby' })
  generateSchedule(
    @Param('babyId') babyId: string,
    @Body() body: { birthDate: string; countryCode?: string },
  ) {
    return this.vaccinesService.generateBabySchedule(babyId, body.birthDate, body.countryCode);
  }

  @Post()
  @ApiOperation({ summary: 'Record a vaccine application' })
  record(@Body() body: any) {
    return this.vaccinesService.recordVaccine(body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update vaccine status' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string; appliedDate?: string }) {
    return this.vaccinesService.updateVaccineStatus(id, body.status, body.appliedDate);
  }
}
