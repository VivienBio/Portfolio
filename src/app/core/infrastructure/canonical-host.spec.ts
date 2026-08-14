import { canonicalRedirectTarget } from './canonical-host';

describe('canonicalRedirectTarget', () => {
  it('redirects alternate public hosts to the canonical domain', () => {
    expect(canonicalRedirectTarget('portfolio-kun3lpbdca-ew.a.run.app', '/fr/work/betclic?ref=test')).toBe(
      undefined,
    );
  });

  it('keeps the canonical host and local hosts untouched', () => {
    expect(canonicalRedirectTarget('portfolio-kun3lpbdca-ew.a.run.app', '/fr')).toBeUndefined();
    expect(canonicalRedirectTarget('localhost', '/fr')).toBeUndefined();
    expect(canonicalRedirectTarget('127.0.0.1', '/fr')).toBeUndefined();
  });

  it('does not redirect health or api routes used by operations', () => {
    expect(canonicalRedirectTarget('portfolio-kun3lpbdca-ew.a.run.app', '/healthz')).toBeUndefined();
    expect(canonicalRedirectTarget('portfolio-kun3lpbdca-ew.a.run.app', '/api/healthz')).toBeUndefined();
    expect(canonicalRedirectTarget('portfolio-kun3lpbdca-ew.a.run.app', '/api/assistant')).toBeUndefined();
  });
});