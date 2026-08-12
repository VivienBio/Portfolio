import { ContactSubmission } from '../domain/assistant.models';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

export class ContactValidationError extends Error {}

export function validateContactSubmission(input: unknown): ContactSubmission {
  if (!isRecord(input)) {
    throw new ContactValidationError('Le formulaire est invalide.');
  }

  const submission: ContactSubmission = {
    name: readText(input, 'name', 2, 80),
    email: readText(input, 'email', 5, 160).toLocaleLowerCase('fr'),
    message: readText(input, 'message', 20, 2_000),
    website: readOptionalText(input, 'website', 200),
    confirmed: input['confirmed'] === true,
  };

  if (!EMAIL_PATTERN.test(submission.email)) {
    throw new ContactValidationError('L’adresse email est invalide.');
  }

  if (submission.website) {
    throw new ContactValidationError('Le formulaire est invalide.');
  }

  if (!submission.confirmed) {
    throw new ContactValidationError('La confirmation est requise avant l’envoi.');
  }

  return submission;
}

function readText(
  input: Readonly<Record<string, unknown>>,
  key: string,
  minimum: number,
  maximum: number,
): string {
  const value = input[key];
  if (typeof value !== 'string') {
    throw new ContactValidationError('Un champ requis est manquant.');
  }

  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new ContactValidationError(`Le champ ${key} est invalide.`);
  }

  return normalized;
}

function readOptionalText(
  input: Readonly<Record<string, unknown>>,
  key: string,
  maximum: number,
): string {
  const value = input[key];
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value !== 'string' || value.length > maximum) {
    throw new ContactValidationError(`Le champ ${key} est invalide.`);
  }

  return value.trim();
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
