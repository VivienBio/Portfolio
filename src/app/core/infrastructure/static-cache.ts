/** Angular bundles carry an 8-character content hash, e.g. main-4AEEHI4M.js or chunk-B-ssC9QO.js. */
const HASHED_BUNDLE_PATTERN = /-[A-Za-z0-9_-]{8}\.(?:js|mjs|css)$/;

const IMMUTABLE = 'public, max-age=31536000, immutable';
const ONE_MONTH = 'public, max-age=2592000';
const ONE_DAY = 'public, max-age=86400';

/** Cache-Control for a file served from the browser build. */
export function staticCacheControl(filePath: string): string {
  const path = filePath.replaceAll('\\', '/');

  if (HASHED_BUNDLE_PATTERN.test(path)) {
    return IMMUTABLE;
  }

  return path.includes('/fonts/') ? ONE_MONTH : ONE_DAY;
}
