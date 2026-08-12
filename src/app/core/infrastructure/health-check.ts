import { Request, Response } from 'express';

export interface HealthCheckRouter {
  get(path: string, handler: (request: Request, response: Response) => void): unknown;
}

export function registerHealthCheck(router: HealthCheckRouter): void {
  const handler = (_request: Request, response: Response) => {
    response.status(200).json({ status: 'ok' });
  };

  router.get('/healthz', handler);
  router.get('/api/healthz', handler);
}
