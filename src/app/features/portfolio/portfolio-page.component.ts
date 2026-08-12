import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PORTFOLIO_REPOSITORY } from '../../core/application/portfolio.repository';
import {
  PORTFOLIO_PUBLIC_IDENTITY,
  calculatePublicAge,
  formatPublicBirthDate,
} from '../../core/domain/assistant.models';
import { PortfolioLocale } from '../../core/domain/portfolio.models';
import { LocalPortfolioRepository } from '../../core/infrastructure/local-portfolio.repository';
import { PreferencesService } from '../../core/services/preferences.service';
import { PortfolioAssistantComponent } from '../assistant/portfolio-assistant.component';
import { ProjectsGridComponent } from '../projects/projects-grid.component';
import { PORTFOLIO_PAGE_COPY } from './portfolio-page.copy';

@Component({
  selector: 'app-portfolio-page',
  imports: [NgOptimizedImage, PortfolioAssistantComponent, ProjectsGridComponent],
  host: {
    '(window:scroll)': 'updateScrollProgress()',
  },
  providers: [{ provide: PORTFOLIO_REPOSITORY, useClass: LocalPortfolioRepository }],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.scss',
})
export class PortfolioPageComponent {
  private readonly repository = inject(PORTFOLIO_REPOSITORY);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute, { optional: true });
  protected readonly preferences = inject(PreferencesService);
  protected readonly locale: PortfolioLocale =
    this.route?.snapshot.data['locale'] === 'en' ? 'en' : 'fr';
  protected readonly copy = PORTFOLIO_PAGE_COPY[this.locale];
  protected readonly portfolio = this.repository.getPortfolio(this.locale);
  readonly identityName = PORTFOLIO_PUBLIC_IDENTITY.name;
  readonly identityMeta = (() => {
    const age = calculatePublicAge();
    const birthDate = formatPublicBirthDate(this.locale);

    if (age === undefined || !birthDate) {
      return '';
    }

    return this.locale === 'en'
      ? `${age} years · ${birthDate} · Freelance`
      : `${age} ans · ${birthDate} · Freelance`;
  })();
  protected readonly themeLabel = computed(() =>
    this.preferences.theme() === 'dark' ? this.copy.theme.light : this.copy.theme.dark,
  );
  protected readonly year = new Date().getFullYear();
  protected readonly scrollProgress = signal(0);

  constructor() {
    this.document.documentElement.lang = this.locale;
  }

  protected updateScrollProgress(): void {
    const element = this.document.documentElement;
    const availableHeight = element.scrollHeight - element.clientHeight;
    this.scrollProgress.set(availableHeight > 0 ? (element.scrollTop / availableHeight) * 100 : 0);
  }
}
