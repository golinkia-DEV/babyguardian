import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppJwtAuthGuard } from '../auth/app-jwt-auth.guard';
import { HomesService } from './homes.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

@ApiTags('homes')
@ApiBearerAuth()
@UseGuards(AppJwtAuthGuard)
@Controller('homes')
export class HomesController {
  constructor(private homesService: HomesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a home' })
  create(@Body() dto: CreateHomeDto, @Request() req: { user: { id: string } }) {
    return this.homesService.create({
      name: dto.name,
      countryCode: dto.countryCode,
      timezone: dto.timezone,
      ownerId: req.user.id,
    });
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get homes owned by current user' })
  findMine(@Request() req: { user: { id: string } }) {
    return this.homesService.findByOwner(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get home by ID' })
  findOne(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.homesService.findOneForUser(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update home' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHomeDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.homesService.updateForUser(req.user.id, id, dto);
  }
}
