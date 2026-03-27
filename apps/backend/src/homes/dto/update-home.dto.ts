import { IsOptional, IsString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHomeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 10)
  countryCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 100)
  timezone?: string;
}
