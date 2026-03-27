import { IsDateString, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeedingDto {
  @ApiProperty()
  @IsUUID()
  babyId: string;

  @ApiProperty({ example: 'breastfeeding' })
  @IsString()
  feedingType: string;

  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(240)
  durationMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(500)
  amountMl?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  breastSide?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
