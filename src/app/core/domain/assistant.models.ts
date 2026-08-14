export type AssistantRole = 'user' | 'assistant';

export interface AssistantMessage {
  readonly role: AssistantRole;
  readonly content: string;
}

export interface AssistantReply {
  readonly answer: string;
}

export interface ContactSubmission {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly website: string;
  readonly confirmed: boolean;
}

export const PORTFOLIO_CONTACT = Object.freeze({
  email: 'billot.vivien@gmail.com',
  phone: '06 23 85 77 32',
  linkedin: 'https://www.linkedin.com/in/vivien-billot-a86b2557/',
});

export const PORTFOLIO_PUBLIC_IDENTITY = Object.freeze({
  name: 'Vivien Billot',
  headline: 'Senior Software Engineer · architecte logiciel · freelance',
  location: 'Île-de-France',
  birthDateIso: '1988-03-05',
});

export function formatPublicBirthDate(locale: 'fr' | 'en'): string {
  const birthDate = readPublicBirthDate();

  if (!birthDate) {
    return '';
  }

  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(birthDate);
}

export function calculatePublicAge(referenceDate = new Date()): number | undefined {
  const birthDate = readPublicBirthDate();

  if (!birthDate) {
    return undefined;
  }

  let age = referenceDate.getUTCFullYear() - birthDate.getUTCFullYear();
  const birthdayThisYear = Date.UTC(
    referenceDate.getUTCFullYear(),
    birthDate.getUTCMonth(),
    birthDate.getUTCDate(),
  );

  if (referenceDate.getTime() < birthdayThisYear) {
    age -= 1;
  }

  return age;
}

function readPublicBirthDate(): Date | undefined {
  if (!PORTFOLIO_PUBLIC_IDENTITY.birthDateIso) {
    return undefined;
  }

  const birthDate = new Date(`${PORTFOLIO_PUBLIC_IDENTITY.birthDateIso}T00:00:00.000Z`);

  return Number.isNaN(birthDate.getTime()) ? undefined : birthDate;
}
