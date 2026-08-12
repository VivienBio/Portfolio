import express, { Express, Request } from 'express';
import { ContactGateway } from '../application/contact.gateway';
import {
  validateContactSubmission,
  ContactValidationError,
} from '../application/contact-submission';
import { AssistantInputError, PortfolioAssistant } from '../application/portfolio-assistant';
import { AssistantMessage } from '../domain/assistant.models';
import { PortfolioLocale } from '../domain/portfolio.models';
import { FixedWindowRateLimiter } from './fixed-window-rate-limiter';

export interface PortfolioApiDependencies {
  readonly assistant: PortfolioAssistant | undefined;
  readonly assistantForLocale?: (locale: PortfolioLocale) => PortfolioAssistant | undefined;
  readonly contactGateway: ContactGateway | undefined;
}

export function registerPortfolioApi(app: Express, dependencies: PortfolioApiDependencies): void {
  const assistantRateLimiter = new FixedWindowRateLimiter(12, 60_000);
  const contactRateLimiter = new FixedWindowRateLimiter(3, 15 * 60_000);
  const parseJson = express.json({ limit: '8kb', type: 'application/json' });

  app.post('/api/assistant', parseJson, async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');

    if (!assistantRateLimiter.allow(clientIdentifier(request))) {
      response.status(429).json({ error: 'Trop de demandes. Réessayez dans une minute.' });
      return;
    }

    const assistant =
      dependencies.assistantForLocale?.(readLocale(request.body)) ?? dependencies.assistant;
    if (!assistant) {
      response.status(503).json({ error: 'L’assistant IA est momentanément indisponible.' });
      return;
    }

    try {
      const reply = await assistant.reply(readMessages(request.body));
      response.status(200).json(reply);
    } catch (error: unknown) {
      if (error instanceof AssistantInputError) {
        response.status(400).json({ error: error.message });
        return;
      }

      logOperationalError('assistant_failed', error);
      response.status(502).json({ error: 'L’assistant ne peut pas répondre pour le moment.' });
    }
  });

  app.post('/api/contact', parseJson, async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');

    if (!contactRateLimiter.allow(clientIdentifier(request))) {
      response.status(429).json({ error: 'Trop de messages. Réessayez plus tard.' });
      return;
    }

    if (!dependencies.contactGateway) {
      response.status(503).json({ error: 'L’envoi de message est momentanément indisponible.' });
      return;
    }

    try {
      const submission = validateContactSubmission(request.body);
      await dependencies.contactGateway.send(submission);
      response.status(202).json({ delivered: true });
    } catch (error: unknown) {
      if (error instanceof ContactValidationError) {
        response.status(400).json({ error: error.message });
        return;
      }

      logOperationalError('contact_delivery_failed', error);
      response.status(502).json({ error: 'Le message n’a pas pu être transmis.' });
    }
  });
}

function readMessages(body: unknown): readonly AssistantMessage[] {
  if (!isRecord(body) || !Array.isArray(body['messages'])) {
    throw new AssistantInputError('Une conversation est requise.');
  }

  return body['messages'].map((message: unknown) => {
    if (!isRecord(message)) {
      throw new AssistantInputError('Le message est invalide.');
    }

    const role = message['role'];
    const content = message['content'];
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      throw new AssistantInputError('Le message est invalide.');
    }

    return { role, content };
  });
}

function readLocale(body: unknown): PortfolioLocale {
  return isRecord(body) && body['locale'] === 'en' ? 'en' : 'fr';
}

function clientIdentifier(request: Request): string {
  return request.ip || request.socket.remoteAddress || 'unknown';
}

function logOperationalError(code: string, error: unknown): void {
  const errorName = error instanceof Error ? error.name : 'UnknownError';
  console.error(JSON.stringify({ severity: 'ERROR', code, errorName }));
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
