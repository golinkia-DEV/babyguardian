import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHomeDto {
  @ApiProperty({ example: 'Hogar González' })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiPropertyOptional({ default: 'CL' })
  @IsOptional()
  @IsString()
  @Length(2, 10)
  countryCode?: string;

  @ApiPropertyOptional({ default: 'America/Santiago' })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  timezone?: string;
}
