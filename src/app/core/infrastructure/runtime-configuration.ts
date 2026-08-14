const DEFAULT_OPENAI_MODEL = 'gpt-5.6-terra';

export interface RuntimeConfiguration {
  readonly openAiApiKey: string | undefined;
  readonly openAiModel: string;
  readonly contactFormEndpoint: string | undefined;
}

export function readRuntimeConfiguration(env: NodeJS.ProcessEnv): RuntimeConfiguration {
  return {
    openAiApiKey: readOptionalEnvironmentValue(env, 'OPENAI_API_KEY'),
    openAiModel: readOptionalEnvironmentValue(env, 'OPENAI_MODEL') ?? DEFAULT_OPENAI_MODEL,
    contactFormEndpoint: readOptionalEnvironmentValue(env, 'CONTACT_FORM_ENDPOINT'),
  };
}

function readOptionalEnvironmentValue(
  env: NodeJS.ProcessEnv,
  name: keyof NodeJS.ProcessEnv,
): string | undefined {
  const value = env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}
