import { DOCUMENT } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioLocale } from '../../core/domain/portfolio.models';
import { AnalyticsService } from '../../core/services/analytics.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeoService } from '../../core/services/seo.service';
import { PRIVACY_COPY } from './privacy.copy';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly analytics = inject(AnalyticsService);
  protected readonly preferences = inject(PreferencesService);
  protected readonly locale: PortfolioLocale =
    this.route.snapshot.data['locale'] === 'fr' ? 'fr' : 'en';
  protected readonly copy = PRIVACY_COPY[this.locale];
  protected readonly themeLabel = computed(() =>
    this.preferences.theme() === 'dark' ? this.copy.themeToLight : this.copy.themeToDark,
  );

  constructor() {
    inject(DOCUMENT).documentElement.lang = this.locale;
    inject(SeoService).apply({
      title: `${this.copy.title} · Vivien Billot`,
      description: this.copy.description,
      path: this.copy.path,
      locale: this.locale,
      ogType: 'website',
      alternates: [
        { hreflang: 'en', path: '/privacy' },
        { hreflang: 'fr', path: '/fr/confidentialite' },
        { hreflang: 'x-default', path: '/privacy' },
      ],
    });
  }

  protected toggleTheme(): void {
    this.preferences.toggleTheme();
    this.analytics.track('theme_change', { theme: this.preferences.theme() });
  }
}
