import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty({
    description: 'Historial reciente (user/assistant)',
    example: [{ role: 'user', content: 'Hola' }],
  })
  @IsArray()
  messages: Array<Record<string, unknown>>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  babyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  ageMonths?: number;

  @ApiPropertyOptional({ enum: ['groq', 'openai', 'anthropic'] })
  @IsOptional()
  @IsString()
  provider?: 'groq' | 'openai' | 'anthropic';
}
