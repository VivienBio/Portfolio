import { SITE_URL } from './site';

const CANONICAL_HOST = new URL(SITE_URL).hostname;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);
const EXCLUDED_PREFIXES = ['/api/', '/assets/'];
const EXCLUDED_PATHS = new Set(['/healthz', '/api/healthz']);

export function canonicalRedirectTarget(hostname: string | undefined, originalUrl: string): string | undefined {
  const normalizedHost = hostname?.trim().toLowerCase();

  if (!normalizedHost || LOCAL_HOSTS.has(normalizedHost) || normalizedHost === CANONICAL_HOST) {
    return undefined;
  }

  const path = readPathname(originalUrl);
  if (EXCLUDED_PATHS.has(path) || EXCLUDED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return undefined;
  }

  return `${SITE_URL}${originalUrl === '/' ? '/' : originalUrl}`;
}

function readPathname(originalUrl: string): string {
  try {
    return new URL(originalUrl, SITE_URL).pathname;
  } catch {
    return originalUrl;
  }
}