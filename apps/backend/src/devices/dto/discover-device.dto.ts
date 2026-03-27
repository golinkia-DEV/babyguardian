import { IsIn, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DiscoverDeviceDto {
  @ApiProperty({ enum: ['camera', 'light', 'router', 'sensor'] })
  @IsString()
  @IsIn(['camera', 'light', 'router', 'sensor'])
  deviceType: 'camera' | 'light' | 'router' | 'sensor';

  @ApiPropertyOptional({ example: '192.168.1' })
  @IsOptional()
  @IsString()
  @Matches(/^(\d{1,3}\.){2}\d{1,3}$|^(\d{1,3}\.){3}\d{1,3}$/, {
    message: 'subnet debe ser tipo 192.168.1 o 192.168.1.0',
  })
  subnet?: string;
}
