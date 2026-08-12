import { ContactSubmission } from '../domain/assistant.models';

export interface ContactGateway {
  send(submission: ContactSubmission): Promise<void>;
}
