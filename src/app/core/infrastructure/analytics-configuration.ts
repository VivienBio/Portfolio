import type { Express } from 'express';
import { SITE_URL } from './site';

/** A public tag ID only; no credentials or visitor data cross this endpoint. */
export function registerAnalyticsConfiguration(
  app: Express,
  measurementId: string | undefined,
): void {
  app.get('/api/analytics/config', (_request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    // The browser checks its own hostname; Firebase's proxy can rewrite the server Host.
    response.json({
      measurementId: measurementId ?? null,
      allowedHostname: new URL(SITE_URL).hostname,
    });
  });
}
