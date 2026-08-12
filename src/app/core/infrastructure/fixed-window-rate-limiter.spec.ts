import { describe, expect, it } from 'vitest';
import { FixedWindowRateLimiter } from './fixed-window-rate-limiter';

describe('FixedWindowRateLimiter', () => {
  it('blocks attempts over the configured limit', () => {
    const limiter = new FixedWindowRateLimiter(2, 1_000, () => 100);

    expect(limiter.allow('visitor')).toBe(true);
    expect(limiter.allow('visitor')).toBe(true);
    expect(limiter.allow('visitor')).toBe(false);
    expect(limiter.allow('another-visitor')).toBe(true);
  });

  it('starts a new window after expiration', () => {
    let now = 100;
    const limiter = new FixedWindowRateLimiter(1, 1_000, () => now);

    expect(limiter.allow('visitor')).toBe(true);
    expect(limiter.allow('visitor')).toBe(false);
    now = 1_100;
    expect(limiter.allow('visitor')).toBe(true);
  });
});
