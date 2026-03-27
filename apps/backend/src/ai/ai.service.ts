import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type Provider = 'groq' | 'openai' | 'anthropic';

@Injectable()
export class AiService {
  constructor(private configService: ConfigService) {}

  async chat(params: {
    messages: { role: 'user' | 'assistant'; content: string }[];
    babyName?: string;
    ageMonths?: number;
    provider?: Provider;
  }): Promise<{ content: string; provider: string }> {
    const provider = params.provider || 'groq';
    const system = this.buildSystemPrompt(params.babyName, params.ageMonths);

    if (provider === 'groq') {
      const key = this.configService.get<string>('ai.groqApiKey');
      if (!key) {
        throw new ServiceUnavailableException('GROQ_API_KEY no configurada en el servidor');
      }
      const model = this.configService.get<string>('ai.defaultModelGroq');
      const content = await this.callGroq(key, model, system, params.messages);
      return { content, provider: 'groq' };
    }

    if (provider === 'openai') {
      const key = this.configService.get<string>('ai.openaiApiKey');
      if (!key) {
        throw new ServiceUnavailableException('OPENAI_API_KEY no configurada en el servidor');
      }
      const model = this.configService.get<string>('ai.defaultModelOpenai');
      const content = await this.callOpenAI(key, model, system, params.messages);
      return { content, provider: 'openai' };
    }

    const key = this.configService.get<string>('ai.anthropicApiKey');
    if (!key) {
      throw new ServiceUnavailableException('ANTHROPIC_API_KEY no configurada en el servidor');
    }
    const model = this.configService.get<string>('ai.defaultModelAnthropic');
    const content = await this.callAnthropic(key, model, system, params.messages);
    return { content, provider: 'anthropic' };
  }

  private buildSystemPrompt(babyName?: string, ageMonths?: number): string {
    const name = babyName || 'tu bebé';
    const age =
      typeof ageMonths === 'number' && !Number.isNaN(ageMonths)
        ? `${ageMonths} meses`
        : 'edad no indicada';
    return [
      `Eres un asistente de crianza para la familia de ${name}.`,
      `${name} tiene ${age} de edad aproximada.`,
      'Responde siempre en español (Chile), con empatía y tono calmado.',
      'No eres médico: para urgencias o decisiones médicas, recomienda contactar al pediatra.',
      'No recomiendes medicamentos ni dosis.',
    ].join(' ');
  }

  private async callGroq(
    apiKey: string,
    model: string,
    system: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
  ): Promise<string> {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new ServiceUnavailableException(`Groq error: ${err}`);
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  private async callOpenAI(
    apiKey: string,
    model: string,
    system: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
  ): Promise<string> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new ServiceUnavailableException(`OpenAI error: ${err}`);
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  private async callAnthropic(
    apiKey: string,
    model: string,
    system: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
  ): Promise<string> {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        system,
        max_tokens: 1024,
        messages: messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new ServiceUnavailableException(`Anthropic error: ${err}`);
    }
    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const block = data.content?.[0];
    return block?.type === 'text' ? block.text?.trim() || '' : '';
  }
}
