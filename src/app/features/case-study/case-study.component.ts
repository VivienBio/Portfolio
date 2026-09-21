import { DOCUMENT, NgOptimizedImage, ViewportScroller } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioLocale } from '../../core/domain/portfolio.models';
import { SeoService } from '../../core/services/seo.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { observeHeaderOffset } from '../../core/services/observe-header-offset';
import { CASE_STUDIES, CaseStudySlug } from './case-studies.copy';

const CHROME_COPY = {
  en: {
    back: '← Portfolio',
    homePath: '/',
    languageLabel: 'Lire en français',
    languageTarget: 'FR',
    cvLabel: 'Resume PDF',
    cvHref: '/assets/CV-Vivien-Billot-EN.pdf',
    cvFileName: 'CV-Vivien-Billot-EN.pdf',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
  },
  fr: {
    back: '← Portfolio',
    homePath: '/fr',
    languageLabel: 'Read in English',
    languageTarget: 'EN',
    cvLabel: 'CV PDF',
    cvHref: '/assets/CV-Vivien-Billot-FR.pdf',
    cvFileName: 'CV-Vivien-Billot-FR.pdf',
    themeToLight: 'Activer le thème clair',
    themeToDark: 'Activer le thème sombre',
  },
} as const;

@Component({
  selector: 'app-case-study',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './case-study.component.html',
  styleUrl: './case-study.component.scss',
})
export class CaseStudyComponent {
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly document = inject(DOCUMENT);
  private readonly seo = inject(SeoService);
  protected readonly preferences = inject(PreferencesService);
  protected readonly analytics = inject(AnalyticsService);

  protected readonly locale: PortfolioLocale =
    this.route?.snapshot.data['locale'] === 'fr' ? 'fr' : 'en';
  protected readonly slug: CaseStudySlug =
    this.route?.snapshot.data['slug'] === 'tf1' ? 'tf1' : 'betclic';
  protected readonly copy = CASE_STUDIES[this.locale][this.slug];
  protected readonly chrome = CHROME_COPY[this.locale];
  protected readonly alternatePath =
    this.locale === 'fr' ? `/work/${this.slug}` : `/fr/work/${this.slug}`;
  protected readonly themeLabel = computed(() =>
    this.preferences.theme() === 'dark' ? this.chrome.themeToLight : this.chrome.themeToDark,
  );

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destroyRef = inject(DestroyRef);
    const scroller = inject(ViewportScroller);
    afterNextRender(() =>
      observeHeaderOffset(
        this.document,
        host.nativeElement.querySelector('.case-header'),
        destroyRef,
        scroller,
      ),
    );
    this.document.documentElement.lang = this.locale;
    const path = this.locale === 'fr' ? `/fr/work/${this.slug}` : `/work/${this.slug}`;
    const enPath = `/work/${this.slug}`;
    const frPath = `/fr/work/${this.slug}`;
    this.seo.apply({
      title: this.copy.metaTitle,
      description: this.copy.metaDescription,
      path,
      locale: this.locale,
      ogType: 'article',
      alternates: [
        { hreflang: 'en', path: enPath },
        { hreflang: 'fr', path: frPath },
        { hreflang: 'x-default', path: enPath },
      ],
    });
  }

  protected toggleTheme(): void {
    this.preferences.toggleTheme();
    this.analytics.track('theme_change', { theme: this.preferences.theme() });
  }

  protected trackCv(): void {
    this.analytics.track('file_download', {
      file_name: this.locale === 'fr' ? 'CV-Vivien-Billot-FR.pdf' : 'CV-Vivien-Billot-EN.pdf',
      file_extension: 'pdf',
      cv_language: this.locale,
      placement: 'header',
    });
  }
}
