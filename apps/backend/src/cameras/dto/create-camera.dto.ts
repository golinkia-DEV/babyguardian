import { IsInt, IsOptional, IsString, IsUUID, Length, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCameraDto {
  @ApiProperty()
  @IsUUID()
  homeId: string;

  @ApiProperty()
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  brand?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  model?: string;

  @ApiPropertyOptional({ description: 'IPv4' })
  @IsOptional()
  @IsString()
  @Length(7, 45)
  ipAddress?: string;

  @ApiPropertyOptional({ default: 554 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  port?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ description: 'Código RTSP EZVIZ (ej.)' })
  @IsOptional()
  @IsString()
  verifyCode?: string;
}
