import express from 'express';
import type { AddressInfo } from 'node:net';
import { vi } from 'vitest';
import { ContactGateway } from '../application/contact.gateway';
import { PortfolioAssistant } from '../application/portfolio-assistant';
import { registerPortfolioApi } from './portfolio-api';

describe('registerPortfolioApi', () => {
  it('returns a grounded assistant response through the HTTP boundary', async () => {
    const assistant = new PortfolioAssistant(
      { answer: vi.fn().mockResolvedValue('Je suis Senior Software Engineer chez Betclic.') },
      '{"company":"Betclic Group"}',
    );
    const { origin, close } = await startApi({ assistant, contactGateway: undefined });

    try {
      const response = await fetch(`${origin}/api/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Quel est ton rôle chez Betclic ?' }],
        }),
      });

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        answer: 'Je suis Senior Software Engineer chez Betclic.',
      });
      expect(response.headers.get('cache-control')).toBe('no-store');
    } finally {
      await close();
    }
  });

  it('rejects a contact message without explicit confirmation', async () => {
    const contactGateway: ContactGateway = { send: vi.fn() };
    const { origin, close } = await startApi({ assistant: undefined, contactGateway });

    try {
      const response = await fetch(`${origin}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          message: 'Bonjour Vivien, échangeons au sujet de notre équipe technique.',
          website: '',
          confirmed: false,
        }),
      });

      expect(response.status).toBe(400);
      expect(contactGateway.send).not.toHaveBeenCalled();
    } finally {
      await close();
    }
  });

  it('selects an English assistant when the locale is English', async () => {
    const frenchAssistant = new PortfolioAssistant(
      { answer: vi.fn().mockResolvedValue('French response') },
      '{"company":"Betclic Group"}',
    );
    const englishAssistant = new PortfolioAssistant(
      { answer: vi.fn().mockResolvedValue('English response') },
      '{"company":"Betclic Group"}',
      'en',
    );
    const { origin, close } = await startApi({
      assistant: frenchAssistant,
      assistantForLocale: (locale) => (locale === 'en' ? englishAssistant : frenchAssistant),
      contactGateway: undefined,
    });

    try {
      const response = await fetch(`${origin}/api/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: 'en',
          messages: [{ role: 'user', content: 'What is your role at Betclic?' }],
        }),
      });

      await expect(response.json()).resolves.toEqual({ answer: 'English response' });
    } finally {
      await close();
    }
  });

  it('delivers a validated and confirmed contact message', async () => {
    const contactGateway: ContactGateway = { send: vi.fn().mockResolvedValue(undefined) };
    const { origin, close } = await startApi({ assistant: undefined, contactGateway });

    try {
      const response = await fetch(`${origin}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          message: 'Bonjour Vivien, échangeons au sujet de notre équipe technique.',
          website: '',
          confirmed: true,
        }),
      });

      expect(response.status).toBe(202);
      expect(contactGateway.send).toHaveBeenCalledOnce();
    } finally {
      await close();
    }
  });
});

async function startApi(dependencies: Parameters<typeof registerPortfolioApi>[1]): Promise<{
  readonly origin: string;
  readonly close: () => Promise<void>;
}> {
  const app = express();
  registerPortfolioApi(app, dependencies);
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;

  return {
    origin: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  };
}
