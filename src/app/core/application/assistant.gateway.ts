import { AssistantMessage } from '../domain/assistant.models';

export interface AssistantGatewayRequest {
  readonly instructions: string;
  readonly messages: readonly AssistantMessage[];
}

export interface AssistantGateway {
  answer(request: AssistantGatewayRequest): Promise<string>;
}
