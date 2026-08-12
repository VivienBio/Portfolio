export class FixedWindowRateLimiter {
  private readonly attempts = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  allow(identifier: string): boolean {
    const currentTime = this.now();
    const current = this.attempts.get(identifier);

    if (!current || current.resetAt <= currentTime) {
      this.attempts.set(identifier, { count: 1, resetAt: currentTime + this.windowMs });
      this.prune(currentTime);
      return true;
    }

    if (current.count >= this.limit) {
      return false;
    }

    this.attempts.set(identifier, { ...current, count: current.count + 1 });
    return true;
  }

  private prune(currentTime: number): void {
    if (this.attempts.size < 1_000) {
      return;
    }

    for (const [identifier, attempt] of this.attempts) {
      if (attempt.resetAt <= currentTime) {
        this.attempts.delete(identifier);
      }
    }
  }
}
