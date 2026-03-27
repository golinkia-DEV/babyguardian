import { IsDateString, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateScheduleDto {
  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional({ default: 'CL' })
  @IsOptional()
  @IsString()
  @Length(2, 10)
  countryCode?: string;
}
