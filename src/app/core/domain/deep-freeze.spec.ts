import { deepFreeze } from './deep-freeze';

describe('deepFreeze', () => {
  it('freezes an aggregate and every nested value', () => {
    const aggregate = deepFreeze({
      name: 'Portfolio',
      capabilities: [{ name: 'Architecture', tags: ['DDD'] }],
    });

    expect(Object.isFrozen(aggregate)).toBe(true);
    expect(Object.isFrozen(aggregate.capabilities)).toBe(true);
    expect(Object.isFrozen(aggregate.capabilities[0])).toBe(true);
    expect(Object.isFrozen(aggregate.capabilities[0]?.tags)).toBe(true);
  });

  it('preserves primitives and handles cycles safely', () => {
    const cyclic: { self?: object } = {};
    cyclic.self = cyclic;

    expect(deepFreeze('domain')).toBe('domain');
    expect(() => deepFreeze(cyclic)).not.toThrow();
    expect(Object.isFrozen(cyclic)).toBe(true);
  });
});
