import { readRuntimeConfiguration } from './runtime-configuration';

describe('readRuntimeConfiguration', () => {
  it('allows local development fallback without production secrets', () => {
    const configuration = readRuntimeConfiguration({});

    expect(configuration.openAiApiKey).toBeUndefined();
    expect(configuration.contactFormEndpoint).toBeUndefined();
    expect(configuration.openAiModel).toBe('gpt-5.6-terra');
  });

  it('trims configured runtime values', () => {
    const configuration = readRuntimeConfiguration({
      OPENAI_API_KEY: ' sk-test ',
      OPENAI_MODEL: ' gpt-custom ',
      CONTACT_FORM_ENDPOINT: ' https://formspree.io/f/example ',
    });

    expect(configuration).toEqual({
      openAiApiKey: 'sk-test',
      openAiModel: 'gpt-custom',
      contactFormEndpoint: 'https://formspree.io/f/example',
    });
  });

  it('keeps production startup available when optional runtime values are missing', () => {
    const configuration = readRuntimeConfiguration({ NODE_ENV: 'production' });

    expect(configuration.openAiApiKey).toBeUndefined();
    expect(configuration.contactFormEndpoint).toBeUndefined();
    expect(configuration.openAiModel).toBe('gpt-5.6-terra');
  });
});
