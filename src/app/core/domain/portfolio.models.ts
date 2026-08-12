export interface Expertise {
  readonly title: string;
  readonly description: string;
  readonly technologies: readonly string[];
  readonly index: string;
}

export type PortfolioLocale = 'fr' | 'en';

export interface Experience {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly summary: string;
  readonly achievements: readonly string[];
  readonly technologies: readonly string[];
}

export interface PortfolioProject {
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly proof: string;
  readonly technologies: readonly string[];
  readonly url: string;
}

export type WorkingStyleKind = 'strength' | 'vigilance';

export interface WorkingStyleItem {
  readonly index: string;
  readonly kind: WorkingStyleKind;
  readonly title: string;
  readonly description: string;
  readonly practice: string;
}

export interface Portfolio {
  readonly expertises: readonly Expertise[];
  readonly experiences: readonly Experience[];
  readonly projects: readonly PortfolioProject[];
  readonly workingStyle: readonly WorkingStyleItem[];
  readonly certifications: readonly string[];
}
