import { apiClient } from './apiClient';

export interface ChatMessagePayload {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessagePayload[];
  babyName?: string;
  ageMonths?: number;
  provider?: 'groq' | 'openai' | 'anthropic';
}

export interface ChatResponse {
  content: string;
  provider: string;
}

export const aiApi = {
  async chat(body: ChatRequest): Promise<ChatResponse> {
    const { data } = await apiClient.post<ChatResponse>('/ai/chat', body);
    return data;
  },
};
