import express from 'express';
import type { AddressInfo } from 'node:net';
import { securityHeaders } from './security-headers';

describe('securityHeaders', () => {
  it('adds defensive browser headers to every response', async () => {
    const app = express();
    app.use(securityHeaders);
    app.get('/probe', (_request, response) => response.sendStatus(204));
    const server = app.listen(0);

    try {
      await new Promise<void>((resolve) => server.once('listening', resolve));
      const { port } = server.address() as AddressInfo;
      const response = await fetch(`http://127.0.0.1:${port}/probe`);

      expect(response.headers.get('x-content-type-options')).toBe('nosniff');
      expect(response.headers.get('x-frame-options')).toBe('DENY');
      expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
      expect(response.headers.get('cross-origin-resource-policy')).toBe('same-origin');
      expect(response.headers.get('origin-agent-cluster')).toBe('?1');
      expect(response.headers.get('permissions-policy')).toContain('camera=()');
      expect(response.headers.get('strict-transport-security')).toContain('max-age=31536000');
      expect(response.headers.get('x-permitted-cross-domain-policies')).toBe('none');
      expect(response.headers.get('content-security-policy')).toContain("default-src 'self'");
      expect(response.headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
});
