import express from 'express';
import type { AddressInfo } from 'node:net';
import { registerHealthCheck } from './health-check';

describe('registerHealthCheck', () => {
  it('exposes a lightweight JSON endpoint for Cloud Run', async () => {
    const app = express();
    registerHealthCheck(app);
    const server = app.listen(0);

    try {
      await new Promise<void>((resolve) => server.once('listening', resolve));
      const { port } = server.address() as AddressInfo;
      const paths = ['/healthz', '/api/healthz'];

      for (const path of paths) {
        const response = await fetch(`http://127.0.0.1:${port}${path}`);
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/json');
        await expect(response.json()).resolves.toEqual({ status: 'ok' });
      }
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
});
