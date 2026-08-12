import { describe, expect, it } from 'vitest';
import { validateContactSubmission } from './contact-submission';

const validSubmission = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Bonjour Vivien, échangeons au sujet de notre équipe technique.',
  website: '',
  confirmed: true,
};

describe('validateContactSubmission', () => {
  it('normalizes a confirmed submission', () => {
    expect(validateContactSubmission({ ...validSubmission, email: ' ADA@EXAMPLE.COM ' })).toEqual({
      ...validSubmission,
      email: 'ada@example.com',
    });
  });

  it('requires explicit confirmation', () => {
    expect(() => validateContactSubmission({ ...validSubmission, confirmed: false })).toThrow(
      'confirmation',
    );
  });

  it('rejects invalid email addresses', () => {
    expect(() => validateContactSubmission({ ...validSubmission, email: 'not-an-email' })).toThrow(
      'email',
    );
  });

  it('rejects honeypot submissions', () => {
    expect(() =>
      validateContactSubmission({ ...validSubmission, website: 'spam.example' }),
    ).toThrow('invalide');
  });
});
