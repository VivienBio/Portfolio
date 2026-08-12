import { resolveAllowedHosts } from './allowed-hosts';

describe('resolveAllowedHosts', () => {
  it('allows local visual checks and Cloud Run by default', () => {
    expect(resolveAllowedHosts()).toEqual(['localhost', '127.0.0.1', '*.run.app']);
  });

  it('adds normalized custom domains without duplicates', () => {
    expect(resolveAllowedHosts(' portfolio.example.com, localhost, www.example.com ')).toEqual([
      'localhost',
      '127.0.0.1',
      '*.run.app',
      'portfolio.example.com',
      'www.example.com',
    ]);
  });
});
