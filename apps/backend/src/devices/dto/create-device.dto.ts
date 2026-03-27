import { IsObject, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty()
  @IsUUID()
  homeId: string;

  @ApiProperty()
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ example: 'light' })
  @IsString()
  @Length(1, 100)
  deviceType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  protocol?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  currentState?: Record<string, unknown>;
}
