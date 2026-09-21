import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DestroyRef, PLATFORM_ID, Service, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

export type AnalyticsConsent = 'pending' | 'granted' | 'denied';
export type AnalyticsEvent =
  | 'file_download'
  | 'contact_click'
  | 'recommendation_click'
  | 'contact_submit'
  | 'contact_success'
  | 'contact_error'
  | 'assistant_open'
  | 'assistant_send'
  | 'assistant_success'
  | 'assistant_error'
  | 'theme_change'
  | 'language_change'
  | 'project_view';

export interface AnalyticsParameters {
  readonly locale?: 'fr' | 'en';
  readonly cv_language?: 'fr' | 'en';
  readonly file_name?: 'CV-Vivien-Billot-FR.pdf' | 'CV-Vivien-Billot-EN.pdf';
  readonly file_extension?: 'pdf';
  readonly placement?:
    'hero' | 'header' | 'footer' | 'contact' | 'assistant' | 'project' | 'recommendations';
  readonly channel?: 'email' | 'linkedin' | 'phone';
  readonly theme?: 'light' | 'dark';
  readonly target?: 'betclic' | 'tf1';
}

interface StoredConsent {
  readonly version: 1;
  readonly value: Exclude<AnalyticsConsent, 'pending'>;
  readonly expiresAt: number;
}

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
} & { [key: `ga-disable-${string}`]: boolean | undefined };

const STORAGE_KEY = 'portfolio-analytics-consent';
const SCRIPT_ID = 'portfolio-google-analytics';
const CONSENT_LIFETIME_MS = 180 * 24 * 60 * 60 * 1_000;
const MEASUREMENT_ID = /^G-[A-Z0-9]{6,20}$/;
const DENIED_CONSENT = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;
const PAGE_TITLES: Readonly<Record<string, string>> = {
  '/': 'Vivien Billot — Portfolio',
  '/fr': 'Vivien Billot — Portfolio français',
  '/privacy': 'Vivien Billot — Privacy',
  '/fr/confidentialite': 'Vivien Billot — Confidentialité',
  '/work/betclic': 'Vivien Billot — Betclic case study',
  '/work/tf1': 'Vivien Billot — TF1 case study',
  '/fr/work/betclic': 'Vivien Billot — Étude de cas Betclic',
  '/fr/work/tf1': 'Vivien Billot — Étude de cas TF1',
};
const EVENT_NAMES = new Set<AnalyticsEvent>([
  'file_download',
  'contact_click',
  'recommendation_click',
  'contact_submit',
  'contact_success',
  'contact_error',
  'assistant_open',
  'assistant_send',
  'assistant_success',
  'assistant_error',
  'theme_change',
  'language_change',
  'project_view',
]);
const PARAMETER_VALUES: Readonly<Record<keyof AnalyticsParameters, readonly string[]>> = {
  locale: ['fr', 'en'],
  cv_language: ['fr', 'en'],
  file_name: ['CV-Vivien-Billot-FR.pdf', 'CV-Vivien-Billot-EN.pdf'],
  file_extension: ['pdf'],
  placement: ['hero', 'header', 'footer', 'contact', 'assistant', 'project', 'recommendations'],
  channel: ['email', 'linkedin', 'phone'],
  theme: ['light', 'dark'],
  target: ['betclic', 'tf1'],
};

/** Consent-gated GA4 only; GA4 owns its session and engagement calculations. */
@Service()
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly platform = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient, { optional: true });
  private readonly router = inject(Router, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private readonly browser = this.document.defaultView as AnalyticsWindow | null;
  private measurementId: string | null = null;
  private readonly landingUrl = this.browser?.location.href ?? '/';
  private currentUrl = this.landingUrl;
  private lastPage: string | null = null;
  private currentPageReferrer: string | null = null;
  private scrollRecorded = false;
  private tagStarted = false;
  private consentExpiresAt = 0;
  private expiryTimer: number | undefined;

  readonly available = signal(false);
  readonly consent = signal<AnalyticsConsent>('pending');
  readonly preferencesOpen = signal(false);

  constructor() {
    if (!isPlatformBrowser(this.platform) || !this.browser || !this.http) return;

    const stored = this.readStoredConsent();
    this.consent.set(stored?.value ?? 'pending');
    this.consentExpiresAt = stored?.expiresAt ?? 0;

    const navigation = this.router?.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        this.trackPage();
      }
    });
    const onStorage = (event: StorageEvent): void => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      const choice = this.parseStoredConsent(event.newValue);
      this.consent.set(choice?.value ?? 'pending');
      this.consentExpiresAt = choice?.expiresAt ?? 0;
      this.preferencesOpen.set(false);
      if (choice?.value === 'granted') this.startTag();
      else this.stopTag(true);
      this.scheduleExpiry();
    };
    this.browser.addEventListener('storage', onStorage);
    const onScroll = (): void => {
      if (this.scrollRecorded || !this.canMeasure() || !this.browser) return;
      const height = this.document.documentElement.scrollHeight;
      const viewport = this.browser.innerHeight;
      if (height <= viewport || (this.browser.scrollY + viewport) / height < 0.9) return;
      this.scrollRecorded = true;
      this.browser.gtag?.('event', 'scroll', { ...this.pageContext(), percent_scrolled: 90 });
    };
    this.browser.addEventListener('scroll', onScroll, { passive: true });

    const config = this.http.get<unknown>('/api/analytics/config').subscribe({
      next: (value) => {
        if (
          !isRecord(value) ||
          typeof value['measurementId'] !== 'string' ||
          !MEASUREMENT_ID.test(value['measurementId']) ||
          typeof value['allowedHostname'] !== 'string' ||
          value['allowedHostname'] !== this.browser?.location.hostname
        ) {
          return;
        }
        // A valid server response explicitly enables this origin, including local test servers.
        this.measurementId = value['measurementId'];
        this.available.set(true);
        if (this.consent() === 'granted') this.startTag();
        this.scheduleExpiry();
      },
      error: () => {
        // An unavailable or unconfigured analytics service must never break the portfolio.
      },
    });

    this.destroyRef.onDestroy(() => {
      navigation?.unsubscribe();
      config.unsubscribe();
      this.browser?.removeEventListener('storage', onStorage);
      this.browser?.removeEventListener('scroll', onScroll);
      this.browser?.clearTimeout(this.expiryTimer);
    });
  }

  openPreferences(): void {
    if (this.available()) this.preferencesOpen.set(true);
  }

  closePreferences(): void {
    this.preferencesOpen.set(false);
  }

  accept(): void {
    if (!this.available()) return;
    this.setChoice('granted');
    this.startTag();
  }

  reject(): void {
    if (!this.available()) return;
    this.setChoice('denied');
    this.stopTag(true);
  }

  track(name: AnalyticsEvent, parameters: AnalyticsParameters = {}): void {
    if (!this.canMeasure() || !EVENT_NAMES.has(name)) return;
    const safeParameters: Record<string, string> = {};
    for (const key of Object.keys(PARAMETER_VALUES) as (keyof AnalyticsParameters)[]) {
      const value = parameters[key];
      if (typeof value === 'string' && PARAMETER_VALUES[key].includes(value)) {
        safeParameters[key] = value;
      }
    }
    this.browser?.gtag?.('event', name, { ...this.pageContext(), ...safeParameters });
  }

  private setChoice(value: StoredConsent['value']): void {
    this.consentExpiresAt = Date.now() + CONSENT_LIFETIME_MS;
    this.consent.set(value);
    this.preferencesOpen.set(false);
    try {
      this.browser?.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, value, expiresAt: this.consentExpiresAt }),
      );
    } catch {
      // The current choice still applies for this page when storage is blocked or full.
      if (value === 'denied') {
        try {
          this.browser?.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // If even removal is forbidden, stopTag keeps this document opted out.
        }
      }
    }
    this.scheduleExpiry();
  }

  private startTag(): void {
    const browser = this.browser;
    const id = this.measurementId;
    if (!browser || !id || this.tagStarted || this.consent() !== 'granted') return;
    if (this.consentExpiresAt <= Date.now()) {
      this.expireChoice();
      return;
    }

    browser[`ga-disable-${id}`] = false;
    browser.dataLayer = browser.dataLayer ?? [];
    browser.gtag = function (..._args: unknown[]): void {
      browser.dataLayer?.push(arguments);
    };
    browser.gtag('consent', 'default', DENIED_CONSENT);
    browser.gtag('consent', 'update', { ...DENIED_CONSENT, analytics_storage: 'granted' });
    browser.gtag('js', new Date());
    browser.gtag('set', {
      ...this.pageContext(),
      ...this.campaignContext(),
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    browser.gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: 'none',
      cookie_path: '/',
      cookie_expires: CONSENT_LIFETIME_MS / 1_000,
      cookie_update: false,
      cookie_flags: `SameSite=Lax${browser.location.protocol === 'https:' ? ';Secure' : ''}`,
    });

    this.tagStarted = true;
    this.lastPage = null;
    this.currentPageReferrer = null;
    this.trackPage();
    const script = this.document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    this.document.head.appendChild(script);
  }

  private trackPage(): void {
    if (!this.canMeasure()) return;
    const context = this.pageContext();
    if (context.page_location === this.lastPage) return;
    this.currentPageReferrer = this.lastPage ?? context.page_referrer;
    context.page_referrer = this.currentPageReferrer;
    this.lastPage = context.page_location;
    this.scrollRecorded = false;
    // Global overrides also sanitize GA4's automatic session/engagement events.
    this.browser?.gtag?.('set', context);
    this.browser?.gtag?.('event', 'page_view', context);
    if (context.page_location.endsWith('/work/betclic')) {
      this.track('project_view', { target: 'betclic' });
    } else if (context.page_location.endsWith('/work/tf1')) {
      this.track('project_view', { target: 'tf1' });
    }
  }

  private pageContext(): {
    page_location: string;
    page_title: string;
    page_referrer: string;
    locale: 'fr' | 'en';
  } {
    const origin = this.browser?.location.origin ?? 'https://vivien-billot.web.app';
    let path = '/404';
    try {
      const url = new URL(this.currentUrl, origin);
      const normalized = url.pathname.replace(/\/+$/, '') || '/';
      path = Object.hasOwn(PAGE_TITLES, normalized)
        ? normalized
        : normalized === '/fr' || normalized.startsWith('/fr/')
          ? '/fr/404'
          : '/404';
    } catch {
      // Invalid URLs are reduced to the same generic not-found page.
    }
    let referrer = '';
    try {
      const url = new URL(this.document.referrer);
      if (url.protocol === 'https:' || url.protocol === 'http:') referrer = url.origin;
    } catch {
      // No referrer is normal for direct visits.
    }
    return {
      page_location: `${origin}${path}`,
      page_title: PAGE_TITLES[path] ?? 'Vivien Billot — Page not found',
      page_referrer: this.currentPageReferrer ?? referrer,
      locale: path === '/fr' || path.startsWith('/fr/') ? 'fr' : 'en',
    };
  }

  private campaignContext(): Record<string, string> {
    try {
      const params = new URL(this.landingUrl).searchParams;
      const source = params.get('utm_source');
      const medium = params.get('utm_medium');
      const campaign = params.get('utm_campaign');
      const safe: Record<string, string> = {};
      // Only documented public campaign labels may leave the browser.
      if (source && ['linkedin', 'github', 'email', 'qrcode'].includes(source)) {
        safe['campaign_source'] = source;
        if (medium && ['social', 'referral', 'email', 'qr'].includes(medium)) {
          safe['campaign_medium'] = medium;
        }
        if (campaign && ['portfolio', 'candidature', 'cv'].includes(campaign)) {
          safe['campaign_name'] = campaign;
        }
      }
      return safe;
    } catch {
      return {};
    }
  }

  private canMeasure(): boolean {
    if (this.consent() !== 'granted' || !this.tagStarted) return false;
    if (this.consentExpiresAt <= Date.now()) {
      this.expireChoice();
      return false;
    }
    return true;
  }

  private stopTag(reload: boolean): void {
    const browser = this.browser;
    const wasStarted = this.tagStarted;
    this.tagStarted = false;
    this.lastPage = null;
    this.currentPageReferrer = null;
    if (!browser) return;
    if (this.measurementId) browser[`ga-disable-${this.measurementId}`] = true;
    if (wasStarted) {
      // Opt out before removing the script; loaded JavaScript cannot be unloaded by DOM removal.
      browser.gtag = () => {};
      if (browser.dataLayer) browser.dataLayer.length = 0;
    }
    this.document.getElementById(SCRIPT_ID)?.remove();
    this.clearAnalyticsCookies();
    // If storage writes fail but an older grant remains readable, keep the opt-out flag in this
    // document. Reloading in that situation could restore the older grant and restart collection.
    if (reload && wasStarted && this.readStoredConsent()?.value !== 'granted') {
      browser.location.reload();
    }
  }

  private clearAnalyticsCookies(): void {
    try {
      const domains = this.browser?.location.hostname.split('.') ?? [];
      for (const item of this.document.cookie.split(';')) {
        const name = item.trim().split('=')[0];
        if (!name || !/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
        const expired = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
        this.document.cookie = expired;
        for (let index = 0; index < domains.length; index++) {
          const domain = domains.slice(index).join('.');
          this.document.cookie = `${expired}; domain=${domain}`;
          this.document.cookie = `${expired}; domain=.${domain}`;
        }
      }
    } catch {
      // Cookies can be unavailable in hardened browsers; the GA opt-out still applies.
    }
  }

  private readStoredConsent(): StoredConsent | null {
    try {
      return this.parseStoredConsent(this.browser?.localStorage.getItem(STORAGE_KEY) ?? null);
    } catch {
      return null;
    }
  }

  private parseStoredConsent(raw: string | null): StoredConsent | null {
    if (!raw) return null;
    try {
      const value: unknown = JSON.parse(raw);
      if (
        isRecord(value) &&
        value['version'] === 1 &&
        (value['value'] === 'granted' || value['value'] === 'denied') &&
        typeof value['expiresAt'] === 'number' &&
        Number.isFinite(value['expiresAt']) &&
        value['expiresAt'] > Date.now() &&
        value['expiresAt'] <= Date.now() + CONSENT_LIFETIME_MS
      ) {
        return { version: 1, value: value['value'], expiresAt: value['expiresAt'] };
      }
    } catch {
      // Malformed or obsolete preferences are treated as no consent.
    }
    return null;
  }

  private scheduleExpiry(): void {
    this.browser?.clearTimeout(this.expiryTimer);
    if (!this.browser || !this.consentExpiresAt) return;
    const remaining = this.consentExpiresAt - Date.now();
    if (remaining <= 0) {
      this.expireChoice();
      return;
    }
    this.expiryTimer = this.browser.setTimeout(
      () => this.scheduleExpiry(),
      Math.min(remaining, 2_147_483_647),
    );
  }

  private expireChoice(): void {
    this.consentExpiresAt = 0;
    this.consent.set('pending');
    this.stopTag(true);
  }
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
