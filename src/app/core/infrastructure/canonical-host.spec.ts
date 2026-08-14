import { canonicalRedirectTarget } from './canonical-host';

describe('canonicalRedirectTarget', () => {
  it('keeps the technical Cloud Run host unchanged for the Firebase proxy', () => {
    expect(
      canonicalRedirectTarget('portfolio-kun3lpbdca-ew.a.run.app', '/fr/work/betclic?ref=test'),
    ).toBeUndefined();
  });

  it('keeps the canonical host and local hosts untouched', () => {
    expect(canonicalRedirectTarget('vivien-billot.web.app', '/fr')).toBeUndefined();
    expect(canonicalRedirectTarget('localhost', '/fr')).toBeUndefined();
    expect(canonicalRedirectTarget('127.0.0.1', '/fr')).toBeUndefined();
  });

  it('redirects other public hosts to Firebase Hosting', () => {
    expect(canonicalRedirectTarget('portfolio.example.com', '/fr?ref=test')).toBe(
      'https://vivien-billot.web.app/fr?ref=test',
    );
  });

  it('does not redirect health or api routes used by operations', () => {
    expect(
      canonicalRedirectTarget('portfolio-kun3lpbdca-ew.a.run.app', '/healthz'),
    ).toBeUndefined();
    expect(
      canonicalRedirectTarget('portfolio-kun3lpbdca-ew.a.run.app', '/api/healthz'),
    ).toBeUndefined();
    expect(
      canonicalRedirectTarget('portfolio-kun3lpbdca-ew.a.run.app', '/api/assistant'),
    ).toBeUndefined();
  });
});
