import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with parenting assistant (server-side API keys)' })
  chat(@Body() dto: ChatDto) {
    const messages = (dto.messages || [])
      .filter(
        (m): m is { role: 'user' | 'assistant'; content: string } =>
          typeof m === 'object' &&
          m !== null &&
          (m as { role?: string }).role !== undefined &&
          typeof (m as { content?: unknown }).content === 'string',
      )
      .map((m) => ({
        role: (m as { role: 'user' | 'assistant' }).role,
        content: (m as { content: string }).content,
      }));
    return this.aiService.chat({
      messages,
      babyName: dto.babyName,
      ageMonths: dto.ageMonths,
      provider: dto.provider,
    });
  }
}
