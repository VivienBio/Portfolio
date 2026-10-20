import { toMessageParts } from './message-parts';

describe('toMessageParts', () => {
  it('keeps plain text untouched', () => {
    expect(toMessageParts('Je travaille en C# / .NET.')).toEqual([
      { text: 'Je travaille en C# / .NET.' },
    ]);
  });

  it('turns emails, French phone numbers and https URLs into links', () => {
    const parts = toMessageParts(
      'Écrivez-moi à billot.vivien@gmail.com, appelez le 06 23 85 77 32 ou voyez https://www.linkedin.com/in/vivien-billot/.',
    );

    expect(parts).toEqual([
      { text: 'Écrivez-moi à ' },
      { text: 'billot.vivien@gmail.com', href: 'mailto:billot.vivien@gmail.com' },
      { text: ', appelez le ' },
      { text: '06 23 85 77 32', href: 'tel:+33623857732' },
      { text: ' ou voyez ' },
      {
        text: 'https://www.linkedin.com/in/vivien-billot/',
        href: 'https://www.linkedin.com/in/vivien-billot/',
        external: true,
      },
      { text: '.' },
    ]);
  });

  it('accepts international phone numbers and keeps the visible text intact', () => {
    const parts = toMessageParts('Call +33 6 23 85 77 32 (Paris).');

    expect(parts[1]).toEqual({ text: '+33 6 23 85 77 32', href: 'tel:+33623857732' });
    expect(parts.map((part) => part.text).join('')).toBe('Call +33 6 23 85 77 32 (Paris).');
  });

  it('never links non-https schemes', () => {
    const parts = toMessageParts('javascript:alert(1) http://example.com');

    expect(parts).toEqual([{ text: 'javascript:alert(1) http://example.com' }]);
  });
});
