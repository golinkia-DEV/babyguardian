import Groq from 'groq-sdk';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export type AIProvider = 'groq' | 'openai' | 'anthropic' | 'gemini';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIClientConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export interface BabyContext {
  babyName: string;
  ageMonths: number;
  recentFeedings?: string[];
  recentEvents?: string[];
  vaccines?: string[];
  milestones?: string[];
}

const SYSTEM_PROMPT = (ctx: BabyContext) => `
Eres un asistente especializado en cuidado de bebés para la familia de ${ctx.babyName}.
${ctx.babyName} tiene ${ctx.ageMonths} meses de vida.

Contexto actual:
- Alimentaciones recientes: ${ctx.recentFeedings?.join(', ') || 'Sin datos'}
- Eventos recientes: ${ctx.recentEvents?.join(', ') || 'Sin eventos'}
- Vacunas pendientes: ${ctx.vaccines?.join(', ') || 'Al día'}
- Hitos en progreso: ${ctx.milestones?.join(', ') || 'Sin datos'}

Responde siempre en español chileno, con empatía y basándote en evidencia médica actualizada.
Para consultas médicas urgentes, siempre recomienda contactar al pediatra.
`.trim();

export class BabyGuardianAIClient {
  private provider: AIProvider;
  private model: string;
  private groq?: Groq;
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor(config: AIClientConfig) {
    this.provider = config.provider;

    switch (config.provider) {
      case 'groq':
        this.groq = new Groq({ apiKey: config.apiKey });
        this.model = config.model || 'llama-3.1-70b-versatile';
        break;
      case 'openai':
        this.openai = new OpenAI({ apiKey: config.apiKey });
        this.model = config.model || 'gpt-4o-mini';
        break;
      case 'anthropic':
        this.anthropic = new Anthropic({ apiKey: config.apiKey });
        this.model = config.model || 'claude-3-5-haiku-20241022';
        break;
      default:
        this.model = config.model || '';
    }
  }

  async chat(
    messages: AIMessage[],
    babyContext: BabyContext,
  ): Promise<string> {
    const systemPrompt = SYSTEM_PROMPT(babyContext);

    switch (this.provider) {
      case 'groq':
        return this.chatGroq(messages, systemPrompt);
      case 'openai':
        return this.chatOpenAI(messages, systemPrompt);
      case 'anthropic':
        return this.chatAnthropic(messages, systemPrompt);
      default:
        throw new Error(`Provider ${this.provider} not implemented`);
    }
  }

  private async chatGroq(messages: AIMessage[], systemPrompt: string): Promise<string> {
    const response = await this.groq!.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });
    return response.choices[0]?.message?.content || '';
  }

  private async chatOpenAI(messages: AIMessage[], systemPrompt: string): Promise<string> {
    const response = await this.openai!.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });
    return response.choices[0]?.message?.content || '';
  }

  private async chatAnthropic(messages: AIMessage[], systemPrompt: string): Promise<string> {
    const response = await this.anthropic!.messages.create({
      model: this.model,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      max_tokens: 1024,
    });
    const block = response.content[0];
    return block.type === 'text' ? block.text : '';
  }
}
