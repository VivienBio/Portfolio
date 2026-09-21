import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AnalyticsService } from '../../core/services/analytics.service';

const COPY = {
  fr: {
    title: 'Votre choix de confidentialité',
    description:
      'Avec votre accord, Google Analytics 4 utilise des cookies pour mesurer les visites et les interactions avec le CV. Aucun message de conversation ni coordonnée saisie n’est envoyé à Analytics.',
    retention: 'Votre choix est conservé 180 jours et reste modifiable via « Confidentialité ».',
    policy: 'Comment vos données sont utilisées',
    policyPath: '/fr/confidentialite',
    accept: 'Accepter',
    reject: 'Refuser',
    close: 'Fermer les préférences',
    granted: 'Mesure d’audience autorisée. Refuser retire votre accord et recharge la page.',
    denied: 'Mesure d’audience désactivée.',
  },
  en: {
    title: 'Your privacy choice',
    description:
      'With your permission, Google Analytics 4 uses cookies to measure visits and resume interactions. No chat messages or contact details you enter are sent to Analytics.',
    retention: 'Your choice is kept for 180 days. You can change it anytime under “Privacy”.',
    policy: 'How your data is used',
    policyPath: '/privacy',
    accept: 'Accept',
    reject: 'Reject',
    close: 'Close preferences',
    granted: 'Audience measurement is enabled. Reject withdraws your consent and reloads the page.',
    denied: 'Audience measurement is disabled.',
  },
} as const;

@Component({
  selector: 'app-analytics-consent',
  templateUrl: './analytics-consent.component.html',
  styleUrl: './analytics-consent.component.scss',
})
export class AnalyticsConsentComponent {
  protected readonly analytics = inject(AnalyticsService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly router = inject(Router);
  private readonly notice = viewChild<ElementRef<HTMLElement>>('notice');
  private readonly path = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly locale = computed(() => (/^\/fr(?:[/?#]|$)/.test(this.path()) ? 'fr' : 'en'));
  protected readonly copy = computed(() => COPY[this.locale()]);
  protected readonly visible = computed(
    () =>
      this.analytics.available() &&
      (this.analytics.consent() === 'pending' || this.analytics.preferencesOpen()),
  );
  private returnFocus: HTMLElement | null = null;

  constructor() {
    effect((onCleanup) => {
      const notice = this.notice()?.nativeElement;
      if (!this.isBrowser || !notice) {
        return;
      }

      const root = this.document.documentElement;
      const updateOffset = () =>
        root.style.setProperty(
          '--analytics-consent-height',
          `${Math.ceil(notice.getBoundingClientRect().height) + 24}px`,
        );
      updateOffset();
      const observer =
        typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateOffset);
      observer?.observe(notice);

      const reopened = this.analytics.preferencesOpen();
      const active = this.document.activeElement;
      if (reopened && active instanceof HTMLElement && !notice.contains(active)) {
        this.returnFocus = active;
      }
      const timer = reopened
        ? globalThis.setTimeout(() => notice.focus({ preventScroll: true }))
        : null;

      onCleanup(() => {
        observer?.disconnect();
        if (timer !== null) {
          globalThis.clearTimeout(timer);
        }
        root.style.removeProperty('--analytics-consent-height');
      });
    });
  }

  protected accept(): void {
    this.analytics.accept();
    this.restoreFocus();
  }

  protected reject(): void {
    this.analytics.reject();
    this.restoreFocus();
  }

  protected close(): void {
    this.analytics.closePreferences();
    this.restoreFocus();
  }

  private restoreFocus(): void {
    const target = this.returnFocus;
    this.returnFocus = null;
    if (target?.isConnected) {
      target.focus({ preventScroll: true });
    }
  }
}
