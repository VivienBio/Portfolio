import express from 'express';
import type { AddressInfo } from 'node:net';
import { registerAnalyticsConfiguration } from './analytics-configuration';

describe('analytics runtime configuration', () => {
  it('exposes only the public ID and canonical browser hostname through a reverse proxy', async () => {
    const app = express();
    registerAnalyticsConfiguration(app, 'G-TEST123456');
    const server = app.listen(0);
    try {
      await new Promise<void>((resolve) => server.once('listening', resolve));
      const { port } = server.address() as AddressInfo;
      for (const host of ['vivien-billot.web.app', '127.0.0.1', 'preview.run.app']) {
        const response = await fetch(`http://127.0.0.1:${port}/api/analytics/config`, {
          headers: { host },
        });
        expect(response.headers.get('cache-control')).toBe('no-store');
        expect(await response.json()).toEqual({
          measurementId: 'G-TEST123456',
          allowedHostname: 'vivien-billot.web.app',
        });
      }
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
});
