import { DOCUMENT, NgOptimizedImage, ViewportScroller } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { PORTFOLIO_REPOSITORY } from '../../core/application/portfolio.repository';
import { PORTFOLIO_CONTACT, PORTFOLIO_PUBLIC_IDENTITY } from '../../core/domain/assistant.models';
import { PortfolioLocale } from '../../core/domain/portfolio.models';
import { LocalPortfolioRepository } from '../../core/infrastructure/local-portfolio.repository';
import { PreferencesService } from '../../core/services/preferences.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { observeHeaderOffset } from '../../core/services/observe-header-offset';
import { PortfolioAssistantComponent } from '../assistant/portfolio-assistant.component';
import { ProjectsGridComponent } from '../projects/projects-grid.component';
import { PORTFOLIO_PAGE_COPY } from './portfolio-page.copy';

@Component({
  selector: 'app-portfolio-page',
  imports: [NgOptimizedImage, PortfolioAssistantComponent, ProjectsGridComponent, RouterLink],
  host: {
    '(window:scroll)': 'updateScrollProgress()',
    '(document:keydown.escape)': 'closeMenuFromKeyboard($event)',
    '(document:click)': 'closeMenuOnOutsideClick($event)',
  },
  providers: [{ provide: PORTFOLIO_REPOSITORY, useClass: LocalPortfolioRepository }],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.scss',
})
export class PortfolioPageComponent {
  private readonly repository = inject(PORTFOLIO_REPOSITORY);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly route = inject(ActivatedRoute, { optional: true });
  protected readonly preferences = inject(PreferencesService);
  protected readonly analytics = inject(AnalyticsService);
  private readonly seo = inject(SeoService);
  protected readonly locale: PortfolioLocale =
    this.route?.snapshot.data['locale'] === 'fr' ? 'fr' : 'en';
  protected readonly homePath = this.locale === 'fr' ? '/fr' : '/';
  protected readonly copy = PORTFOLIO_PAGE_COPY[this.locale];
  protected readonly portfolio = this.repository.getPortfolio(this.locale);
  protected readonly contact = PORTFOLIO_CONTACT;
  protected readonly vigilances = this.portfolio.workingStyle.filter(
    (item) => item.kind === 'vigilance',
  );
  protected readonly stack = this.portfolio.expertises.map(({ title, technologies }) => ({
    title,
    technologies: technologies.join(', '),
  }));
  readonly identityName = PORTFOLIO_PUBLIC_IDENTITY.name;
  readonly identityMeta = 'Freelance Senior Software Engineer';
  protected readonly themeLabel = computed(() =>
    this.preferences.theme() === 'dark' ? this.copy.theme.light : this.copy.theme.dark,
  );
  protected readonly year = new Date().getFullYear();
  protected readonly scrollProgress = signal(0);
  /** Small screens fold the navigation behind a button; wider layouts always show it. */
  protected readonly menuOpen = signal(false);
  private readonly siteHeader = viewChild.required<ElementRef<HTMLElement>>('siteHeader');
  private readonly siteNavigation = viewChild.required<ElementRef<HTMLElement>>('siteNavigation');
  private readonly menuToggle = viewChild.required<ElementRef<HTMLButtonElement>>('menuToggle');

  constructor() {
    const destroyRef = inject(DestroyRef);
    const scroller = inject(ViewportScroller);
    afterNextRender(() =>
      observeHeaderOffset(this.document, this.siteHeader().nativeElement, destroyRef, scroller),
    );
    this.document.documentElement.lang = this.locale;
    this.seo.apply({
      title: this.copy.seo.title,
      description: this.copy.seo.description,
      path: this.homePath,
      locale: this.locale,
      ogType: 'profile',
      image: this.locale === 'fr' ? '/og-image-fr.jpg' : '/og-image.jpg',
      modified: '2026-10-20',
      alternates: [
        { hreflang: 'en', path: '/' },
        { hreflang: 'fr', path: '/fr' },
        { hreflang: 'x-default', path: '/' },
      ],
    });
  }

  protected updateScrollProgress(): void {
    const element = this.document.documentElement;
    const availableHeight = element.scrollHeight - element.clientHeight;
    this.scrollProgress.set(availableHeight > 0 ? (element.scrollTop / availableHeight) * 100 : 0);
  }

  protected toggleTheme(): void {
    this.preferences.toggleTheme();
    this.analytics.track('theme_change', { theme: this.preferences.theme() });
  }

  protected toggleMenu(): void {
    const open = !this.menuOpen();
    this.menuOpen.set(open);
    if (open) {
      // Move into the list that just appeared, so keyboard and screen-reader users land on it.
      afterNextRender(() => this.siteNavigation().nativeElement.querySelector('a')?.focus(), {
        injector: this.injector,
      });
    }
  }

  protected closeMenuAfterNavigation(event: MouseEvent): void {
    if (event.target instanceof Element && event.target.closest('a')) {
      this.menuOpen.set(false);
    }
  }

  protected closeMenuFromKeyboard(event: Event): void {
    if (!this.menuOpen()) return;
    // The assistant dialog handles its own Escape key and focus return.
    if (event.target instanceof Element && event.target.closest('[role="dialog"]')) return;
    this.menuOpen.set(false);
    this.menuToggle().nativeElement.focus();
  }

  protected closeMenuOnOutsideClick(event: MouseEvent): void {
    if (!this.menuOpen()) return;
    if (event.target instanceof Node && this.siteHeader().nativeElement.contains(event.target)) {
      return;
    }
    this.menuOpen.set(false);
  }

  protected trackCv(language: PortfolioLocale, placement: 'header' | 'contact' | 'work'): void {
    this.analytics.track('file_download', {
      file_name: language === 'fr' ? 'CV-Vivien-Billot-FR.pdf' : 'CV-Vivien-Billot-EN.pdf',
      file_extension: 'pdf',
      cv_language: language,
      placement,
    });
  }
}
