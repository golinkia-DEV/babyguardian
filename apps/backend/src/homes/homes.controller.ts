import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HomesService } from './homes.service';

@ApiTags('homes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('homes')
export class HomesController {
  constructor(private homesService: HomesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a home' })
  create(@Body() body: any, @Request() req) {
    return this.homesService.create({ ...body, ownerId: req.user.id });
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get homes owned by current user' })
  findMine(@Request() req) {
    return this.homesService.findByOwner(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get home by ID' })
  findOne(@Param('id') id: string) {
    return this.homesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update home' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.homesService.update(id, body);
  }
}
