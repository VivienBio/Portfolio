const DEFAULT_OPENAI_MODEL = 'gpt-5.6-terra';

export interface RuntimeConfiguration {
  readonly openAiApiKey: string | undefined;
  readonly openAiModel: string;
  readonly contactFormEndpoint: string | undefined;
  readonly ga4MeasurementId: string | undefined;
}

export function readRuntimeConfiguration(env: NodeJS.ProcessEnv): RuntimeConfiguration {
  return {
    openAiApiKey: readOptionalEnvironmentValue(env, 'OPENAI_API_KEY'),
    openAiModel: readOptionalEnvironmentValue(env, 'OPENAI_MODEL') ?? DEFAULT_OPENAI_MODEL,
    contactFormEndpoint: readOptionalEnvironmentValue(env, 'CONTACT_FORM_ENDPOINT'),
    ga4MeasurementId: readGa4MeasurementId(env),
  };
}

function readGa4MeasurementId(env: NodeJS.ProcessEnv): string | undefined {
  const value = readOptionalEnvironmentValue(env, 'GA4_MEASUREMENT_ID');
  return value && /^G-[A-Z0-9]{6,20}$/.test(value) ? value : undefined;
}

function readOptionalEnvironmentValue(
  env: NodeJS.ProcessEnv,
  name: keyof NodeJS.ProcessEnv,
): string | undefined {
  const value = env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}
