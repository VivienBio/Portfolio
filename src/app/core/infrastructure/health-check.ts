import { Request, Response } from 'express';

export interface HealthCheckRouter {
  get(path: string, handler: (request: Request, response: Response) => void): unknown;
}

export function registerHealthCheck(router: HealthCheckRouter): void {
  router.get('/healthz', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });
}
