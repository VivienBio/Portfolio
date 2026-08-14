import { NextFunction, Request, RequestHandler, Response } from 'express';

const STATIC_HEADERS = {
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Origin-Agent-Cluster': '?1',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Permitted-Cross-Domain-Policies': 'none',
} as const;

function buildContentSecurityPolicy(scriptHashes: readonly string[]): string {
  const scriptSources = ["'self'", ...scriptHashes.map((hash) => `'${hash}'`)].join(' ');

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self'",
    "font-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "object-src 'none'",
    `script-src ${scriptSources}`,
    "style-src 'self' 'unsafe-inline'",
    'upgrade-insecure-requests',
  ].join('; ');
}

export function buildSecurityHeaders(scriptHashes: readonly string[] = []): RequestHandler {
  const contentSecurityPolicy = buildContentSecurityPolicy(scriptHashes);

  return (_request: Request, response: Response, next: NextFunction): void => {
    response.setHeader('Content-Security-Policy', contentSecurityPolicy);
    for (const [name, value] of Object.entries(STATIC_HEADERS)) {
      response.setHeader(name, value);
    }
    next();
  };
}

export const securityHeaders = buildSecurityHeaders();

export function extractInlineScriptHashes(
  html: string,
  hash: (content: string) => string,
): string[] {
  const scripts = html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g);

  return [...scripts]
    .map(([, content]) => content ?? '')
    .filter((content) => content.trim() !== '')
    .map((content) => `sha256-${hash(content)}`);
}
