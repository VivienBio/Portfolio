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

function buildContentSecurityPolicy(
  scriptHashes: readonly string[],
  analyticsEnabled: boolean,
): string {
  const scriptSources = [
    "'self'",
    ...scriptHashes.map((hash) => `'${hash}'`),
    ...(analyticsEnabled ? ['https://www.googletagmanager.com'] : []),
  ].join(' ');
  const analyticsConnections = analyticsEnabled
    ? ' https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com'
    : '';
  const analyticsImages = analyticsEnabled
    ? ' https://www.googletagmanager.com https://*.google-analytics.com'
    : '';

  return [
    "default-src 'self'",
    "base-uri 'self'",
    `connect-src 'self'${analyticsConnections}`,
    "font-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    `img-src 'self' data:${analyticsImages}`,
    "object-src 'none'",
    `script-src ${scriptSources}`,
    "style-src 'self' 'unsafe-inline'",
    'upgrade-insecure-requests',
  ].join('; ');
}

export function buildSecurityHeaders(
  scriptHashes: readonly string[] = [],
  analyticsEnabled = false,
): RequestHandler {
  const contentSecurityPolicy = buildContentSecurityPolicy(scriptHashes, analyticsEnabled);

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
