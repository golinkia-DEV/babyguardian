import { IsDateString, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBabyDto {
  @ApiProperty()
  @IsUUID()
  homeId: string;

  @ApiProperty()
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional({ default: 'CL' })
  @IsOptional()
  @IsString()
  @Length(2, 10)
  countryCode?: string;

  @ApiPropertyOptional({ enum: ['male', 'female', 'other'] })
  @IsOptional()
  @IsString()
  gender?: string;
}
