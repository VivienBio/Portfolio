import { PortfolioLocale } from '../domain/portfolio.models';

export const SITE_URL = 'https://www.vivienbillot.dev';

export interface SeoAlternate {
  readonly hreflang: string;
  readonly path: string;
}

export interface SeoPage {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly locale: PortfolioLocale;
  readonly alternates: readonly SeoAlternate[];
  readonly ogType: 'website' | 'article' | 'profile';
}

export function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

export function ogLocale(locale: PortfolioLocale): string {
  return locale === 'fr' ? 'fr_FR' : 'en_US';
}
