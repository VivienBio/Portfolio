import { InjectionToken } from '@angular/core';
import { Portfolio, PortfolioLocale } from '../domain/portfolio.models';

export interface PortfolioRepository {
  getPortfolio(locale?: PortfolioLocale): Portfolio;
}

export const PORTFOLIO_REPOSITORY = new InjectionToken<PortfolioRepository>('PORTFOLIO_REPOSITORY');
