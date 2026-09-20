import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import {
  AssistantMessage,
  AssistantReply,
  ContactSubmission,
} from '../../core/domain/assistant.models';
import { PortfolioLocale } from '../../core/domain/portfolio.models';

@Service()
export class PortfolioAssistantApiService {
  private readonly http = inject(HttpClient);

  ask(messages: readonly AssistantMessage[], locale: PortfolioLocale): Promise<AssistantReply> {
    return firstValueFrom(
      this.http.post<AssistantReply>('/api/assistant', { messages, locale }).pipe(timeout(45_000)),
    );
  }

  deliverContact(submission: ContactSubmission): Promise<{ readonly delivered: boolean }> {
    return firstValueFrom(
      this.http.post<{ readonly delivered: boolean }>('/api/contact', submission),
    );
  }
}
