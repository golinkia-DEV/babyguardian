import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BabiesService } from './babies.service';

@ApiTags('babies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('babies')
export class BabiesController {
  constructor(private babiesService: BabiesService) {}

  @Get('home/:homeId')
  @ApiOperation({ summary: 'Get babies by home' })
  findByHome(@Param('homeId') homeId: string) {
    return this.babiesService.findByHome(homeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get baby by ID' })
  findOne(@Param('id') id: string) {
    return this.babiesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create baby profile' })
  create(@Body() body: any) {
    return this.babiesService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update baby profile' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.babiesService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete baby profile' })
  delete(@Param('id') id: string) {
    return this.babiesService.delete(id);
  }
}
