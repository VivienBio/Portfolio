import OpenAI from 'openai';
import { AssistantGateway, AssistantGatewayRequest } from '../application/assistant.gateway';

export interface OpenAiGatewayConfig {
  readonly apiKey: string;
  readonly model: string;
}

export class OpenAiResponsesGateway implements AssistantGateway {
  private readonly client: OpenAI;

  constructor(private readonly config: OpenAiGatewayConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      maxRetries: 1,
      timeout: 15_000,
    });
  }

  async answer(request: AssistantGatewayRequest): Promise<string> {
    const response = await this.client.responses.create({
      model: this.config.model,
      instructions: request.instructions,
      input: request.messages.map(({ role, content }) => ({ role, content })),
      max_output_tokens: 500,
      reasoning: { effort: 'low' },
      store: false,
      text: { verbosity: 'medium' },
    });

    return response.output_text;
  }
}
