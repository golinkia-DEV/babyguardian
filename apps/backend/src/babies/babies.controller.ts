import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppJwtAuthGuard } from '../auth/app-jwt-auth.guard';
import { BabiesService } from './babies.service';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';

@ApiTags('babies')
@ApiBearerAuth()
@UseGuards(AppJwtAuthGuard)
@Controller('babies')
export class BabiesController {
  constructor(private babiesService: BabiesService) {}

  @Get('home/:homeId')
  @ApiOperation({ summary: 'Get babies by home' })
  findByHome(@Param('homeId') homeId: string, @Request() req: { user: { id: string } }) {
    return this.babiesService.findByHomeForOwner(req.user.id, homeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get baby by ID' })
  findOne(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.babiesService.findOneForOwner(req.user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create baby profile' })
  create(@Body() dto: CreateBabyDto, @Request() req: { user: { id: string } }) {
    return this.babiesService.createForOwner(req.user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update baby profile' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBabyDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.babiesService.updateForOwner(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete baby profile' })
  delete(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.babiesService.deleteForOwner(req.user.id, id);
  }
}
