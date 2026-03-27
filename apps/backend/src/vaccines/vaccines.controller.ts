import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VaccinesService } from './vaccines.service';
import { RecordVaccineDto } from './dto/record-vaccine.dto';
import { GenerateScheduleDto } from './dto/generate-schedule.dto';
import { UpdateVaccineStatusDto } from './dto/update-vaccine-status.dto';

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
  getBabyVaccines(@Param('babyId') babyId: string, @Request() req: { user: { id: string } }) {
    return this.vaccinesService.getBabyVaccinesForUser(req.user.id, babyId);
  }

  @Post('baby/:babyId/generate-schedule')
  @ApiOperation({ summary: 'Generate vaccine schedule for baby' })
  generateSchedule(
    @Param('babyId') babyId: string,
    @Body() dto: GenerateScheduleDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.vaccinesService.generateBabyScheduleForUser(
      req.user.id,
      babyId,
      dto.birthDate,
      dto.countryCode,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Record a vaccine application' })
  record(@Body() dto: RecordVaccineDto, @Request() req: { user: { id: string } }) {
    return this.vaccinesService.recordForOwner(req.user.id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update vaccine status' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVaccineStatusDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.vaccinesService.updateVaccineStatusForOwner(req.user.id, id, dto.status, dto.appliedDate);
  }
}
