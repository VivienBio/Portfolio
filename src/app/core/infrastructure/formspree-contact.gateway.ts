import { ContactGateway } from '../application/contact.gateway';
import { ContactSubmission } from '../domain/assistant.models';

export class FormspreeContactGateway implements ContactGateway {
  private readonly endpoint: URL;

  constructor(endpoint: string) {
    this.endpoint = new URL(endpoint);
    if (this.endpoint.protocol !== 'https:' || this.endpoint.hostname !== 'formspree.io') {
      throw new Error('CONTACT_FORM_ENDPOINT must be an HTTPS formspree.io URL.');
    }
  }

  async send(submission: ContactSubmission): Promise<void> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: submission.name,
        email: submission.email,
        message: submission.message,
        _replyto: submission.email,
        _subject: `Portfolio — message de ${submission.name}`,
      }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      throw new Error(`Contact provider rejected the submission with status ${response.status}.`);
    }
  }
}
