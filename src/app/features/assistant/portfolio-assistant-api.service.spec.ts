import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PortfolioAssistantApiService } from './portfolio-assistant-api.service';

describe('PortfolioAssistantApiService', () => {
  let service: PortfolioAssistantApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PortfolioAssistantApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('sends the selected locale together with the conversation', async () => {
    const messages = [{ role: 'user' as const, content: 'Votre parcours ?' }];
    const reply = service.ask(messages, 'fr');
    const request = http.expectOne('/api/assistant');
    expect(request.request.body).toEqual({ messages, locale: 'fr' });
    request.flush({ answer: 'Voici mon parcours.' });
    await expect(reply).resolves.toEqual({ answer: 'Voici mon parcours.' });
  });

  it('releases a stalled request so that the visitor can retry', async () => {
    vi.useFakeTimers();
    const reply = service.ask([{ role: 'user', content: 'Your background?' }], 'en');
    const request = http.expectOne('/api/assistant');
    const rejection = expect(reply).rejects.toMatchObject({ name: 'TimeoutError' });

    await vi.advanceTimersByTimeAsync(45_000);
    await rejection;
    expect(request.cancelled).toBe(true);
  });
});
