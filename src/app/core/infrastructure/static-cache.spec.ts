import { staticCacheControl } from './static-cache';

describe('staticCacheControl', () => {
  it.each([
    '/app/dist/browser/main-4AEEHI4M.js',
    '/app/dist/browser/chunk-B-ssC9QO.js',
    '/app/dist/browser/chunk-D58Cst1-.js',
    '/app/dist/browser/styles-5INURTSO.css',
    'C:\\app\\dist\\browser\\chunk-DAlG8MX1.js',
  ])('caches the content-hashed bundle %s for a year', (path) => {
    expect(staticCacheControl(path)).toBe('public, max-age=31536000, immutable');
  });

  it('keeps fonts for a month', () => {
    expect(staticCacheControl('/app/dist/browser/fonts/inter-latin-var.woff2')).toBe(
      'public, max-age=2592000',
    );
  });

  it.each([
    '/app/dist/browser/vivien-billot-avatar.webp',
    '/app/dist/browser/og-case-betclic-en.jpg',
    '/app/dist/browser/assets/CV-Vivien-Billot-FR.pdf',
    '/app/dist/browser/llms.txt',
    '/app/dist/browser/favicon.ico',
  ])('revalidates the unversioned file %s daily', (path) => {
    expect(staticCacheControl(path)).toBe('public, max-age=86400');
  });
});
