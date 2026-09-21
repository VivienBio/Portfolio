import { DOCUMENT } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Event as RouterEvent, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AnalyticsEvent, AnalyticsParameters, AnalyticsService } from './analytics.service';

const KEY = 'portfolio-analytics-consent';
const ID = 'G-TEST123456';
const ORIGIN = 'https://vivien-billot.web.app';

interface TestBrowser {
  location: {
    href: string;
    origin: string;
    hostname: string;
    protocol: string;
    reload: () => void;
  };
  localStorage: Storage;
  innerHeight: number;
  scrollY: number;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  'ga-disable-G-TEST123456'?: boolean;
}

describe('AnalyticsService', () => {
  let document: Document;
  let browser: TestBrowser;
  let events: Subject<RouterEvent>;
  let listeners: Map<string, EventListener>;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    events = new Subject<RouterEvent>();
    listeners = new Map();
    browser = {
      location: {
        href: `${ORIGIN}/fr?email=private%40example.com#contact`,
        origin: ORIGIN,
        hostname: 'vivien-billot.web.app',
        protocol: 'https:',
        reload: vi.fn(),
      },
      localStorage,
      innerHeight: 800,
      scrollY: 0,
    };
    Object.assign(browser, {
      addEventListener: (name: string, listener: EventListener) => listeners.set(name, listener),
      removeEventListener: (name: string) => listeners.delete(name),
      setTimeout: vi.fn(() => 1),
      clearTimeout: vi.fn(),
    });
    document = window.document.implementation.createHTMLDocument('Untrusted document title');
    Object.defineProperty(document, 'defaultView', { value: browser });
    Object.defineProperty(document, 'referrer', {
      value: 'https://www.linkedin.com/in/private-person/?email=private@example.com',
    });
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DOCUMENT, useValue: document },
        { provide: Router, useValue: { events } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  function initialize(
    config: Record<string, unknown> | null = {
      measurementId: ID,
      allowedHostname: 'vivien-billot.web.app',
    },
  ): AnalyticsService {
    const service = TestBed.inject(AnalyticsService);
    http.expectOne('/api/analytics/config').flush(config);
    return service;
  }

  function commands(): unknown[][] {
    return (browser.dataLayer ?? []).map((entry) => Array.from(entry as IArguments));
  }

  function measurements(name: string): unknown[][] {
    return commands().filter((entry) => entry[0] === 'event' && entry[1] === name);
  }

  function saveChoice(value: 'granted' | 'denied', expiresAt = Date.now() + 86_400_000): void {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, value, expiresAt }));
  }

  it('loads only first-party configuration before an explicit choice', () => {
    const service = initialize();
    service.track('assistant_send', { locale: 'fr' });
    events.next(new NavigationEnd(1, '/fr/work/tf1', '/fr/work/tf1'));

    expect(service.available()).toBe(true);
    expect(service.consent()).toBe('pending');
    expect(browser.dataLayer).toBeUndefined();
    expect(browser.gtag).toBeUndefined();
    expect(document.querySelectorAll('script, link[rel="preconnect"]')).toHaveLength(0);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it.each([
    null,
    {},
    { measurementId: null },
    { measurementId: 'G-bad' },
    { measurementId: 'G-X<evil>' },
  ])('stays entirely disabled for invalid or missing configuration %j', (config) => {
    const service = initialize(config);
    service.accept();
    service.openPreferences();

    expect(service.available()).toBe(false);
    expect(service.preferencesOpen()).toBe(false);
    expect(service.consent()).toBe('pending');
    expect(document.scripts).toHaveLength(0);
    expect(browser.dataLayer).toBeUndefined();
  });

  it('fails closed when fetching configuration fails', () => {
    const service = TestBed.inject(AnalyticsService);
    http
      .expectOne('/api/analytics/config')
      .flush('unavailable', { status: 503, statusText: 'Unavailable' });
    service.accept();
    expect(service.available()).toBe(false);
    expect(document.scripts).toHaveLength(0);
  });

  it('does not load the production tag on localhost or an unapproved preview host', () => {
    browser.location.hostname = 'localhost';
    const service = initialize();
    service.accept();
    expect(service.available()).toBe(false);
    expect(document.scripts).toHaveLength(0);
  });

  it('permits a local test origin only when configuration explicitly names it', () => {
    browser.location.hostname = 'localhost';
    const service = initialize({ measurementId: ID, allowedHostname: 'localhost' });
    service.accept();
    expect(service.available()).toBe(true);
    expect(document.scripts).toHaveLength(1);
  });

  it('persists acceptance for 180 days and queues only sanitized measurement context', () => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const service = initialize();
    service.openPreferences();
    service.accept();

    expect(service.consent()).toBe('granted');
    expect(service.preferencesOpen()).toBe(false);
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      version: 1,
      value: 'granted',
      expiresAt: now + 180 * 86_400_000,
    });
    expect(document.querySelector('script')?.getAttribute('src')).toBe(
      `https://www.googletagmanager.com/gtag/js?id=${ID}`,
    );
    expect(document.querySelector('script')?.referrerPolicy).toBe('no-referrer');
    expect(measurements('page_view')).toEqual([
      [
        'event',
        'page_view',
        {
          page_location: `${ORIGIN}/fr`,
          page_title: 'Vivien Billot — Portfolio français',
          page_referrer: 'https://www.linkedin.com',
          locale: 'fr',
        },
      ],
    ]);
    expect(JSON.stringify(commands())).not.toMatch(/private|Untrusted|email=|#contact/);
    expect(commands().find((entry) => entry[0] === 'config')).toEqual([
      'config',
      ID,
      expect.objectContaining({
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_update: false,
      }),
    ]);
    expect(commands().filter((entry) => entry[0] === 'consent')).toEqual([
      [
        'consent',
        'default',
        expect.objectContaining({ analytics_storage: 'denied', ad_storage: 'denied' }),
      ],
      [
        'consent',
        'update',
        {
          analytics_storage: 'granted',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        },
      ],
    ]);
  });

  it('restores a valid grant only after configuration has been validated', () => {
    saveChoice('granted');
    const service = TestBed.inject(AnalyticsService);
    expect(document.scripts).toHaveLength(0);
    http
      .expectOne('/api/analytics/config')
      .flush({ measurementId: ID, allowedHostname: 'vivien-billot.web.app' });

    expect(service.consent()).toBe('granted');
    expect(document.scripts).toHaveLength(1);
    service.accept();
    expect(document.scripts).toHaveLength(1);
    expect(measurements('page_view')).toHaveLength(1);
  });

  it('remembers refusal without ever loading or queueing a Google tag', () => {
    const service = initialize();
    service.reject();
    service.track('file_download', { cv_language: 'fr' });

    expect(service.consent()).toBe('denied');
    expect(JSON.parse(localStorage.getItem(KEY)!)).toMatchObject({ value: 'denied' });
    expect(browser.dataLayer).toBeUndefined();
    expect(document.scripts).toHaveLength(0);
    expect(browser.location.reload).not.toHaveBeenCalled();
  });

  it('restores refusal and treats expired or malformed consent as pending', () => {
    saveChoice('denied');
    expect(initialize().consent()).toBe('denied');
  });

  it.each([
    'invalid-json',
    JSON.stringify({ version: 1, value: 'granted', expiresAt: 0 }),
    JSON.stringify({ version: 2, value: 'granted', expiresAt: Date.now() + 86_400_000 }),
    JSON.stringify({ version: 1, value: 'granted', expiresAt: Date.now() + 365 * 86_400_000 }),
  ])('does not restore an expired, excessive, or invalid stored grant', (raw) => {
    localStorage.setItem(KEY, raw);
    const service = initialize();
    expect(service.consent()).toBe('pending');
    expect(document.scripts).toHaveLength(0);
  });

  it('deduplicates anchors and queries, but measures language and route changes once', () => {
    const service = initialize();
    service.accept();
    events.next(new NavigationEnd(1, '/fr?secret=one', '/fr?secret=one'));
    events.next(new NavigationEnd(2, '/fr#contact', '/fr#contact'));
    events.next(new NavigationEnd(3, '/', '/'));
    events.next(new NavigationEnd(4, '/work/tf1', '/work/tf1'));
    events.next(new NavigationEnd(5, '/work/tf1#result', '/work/tf1#result'));

    expect(measurements('page_view')).toHaveLength(3);
    expect(measurements('page_view')[1]?.[2]).toMatchObject({
      page_location: `${ORIGIN}/`,
      locale: 'en',
    });
    expect(measurements('project_view')).toHaveLength(1);
    expect(measurements('project_view')[0]?.[2]).toMatchObject({ target: 'tf1', locale: 'en' });
    const lastSet = commands()
      .filter((entry) => entry[0] === 'set')
      .at(-1);
    expect(lastSet?.[1]).toMatchObject({ page_location: `${ORIGIN}/work/tf1` });
  });

  it('uses the preceding sanitized page as the SPA referrer and preserves it for that view', () => {
    const service = initialize();
    service.accept();
    expect(measurements('page_view')[0]?.[2]).toMatchObject({
      page_location: `${ORIGIN}/fr`,
      page_referrer: 'https://www.linkedin.com',
    });

    events.next(
      new NavigationEnd(1, '/fr?email=private@example.com', '/fr?email=private@example.com'),
    );
    events.next(
      new NavigationEnd(
        2,
        '/fr/work/tf1?email=private@example.com',
        '/fr/work/tf1?email=private@example.com',
      ),
    );
    service.track('assistant_open');
    events.next(new NavigationEnd(3, '/fr/work/tf1#contact', '/fr/work/tf1#contact'));
    service.track('assistant_send');

    expect(measurements('page_view')).toHaveLength(2);
    for (const name of ['page_view', 'project_view', 'assistant_open', 'assistant_send']) {
      expect(measurements(name).at(-1)?.[2]).toMatchObject({
        page_location: `${ORIGIN}/fr/work/tf1`,
        page_referrer: `${ORIGIN}/fr`,
      });
    }
    expect(
      commands()
        .filter((entry) => entry[0] === 'set')
        .at(-1)?.[1],
    ).toMatchObject({
      page_location: `${ORIGIN}/fr/work/tf1`,
      page_referrer: `${ORIGIN}/fr`,
    });

    events.next(new NavigationEnd(4, '/fr/work/betclic', '/fr/work/betclic'));
    expect(measurements('page_view').at(-1)?.[2]).toMatchObject({
      page_location: `${ORIGIN}/fr/work/betclic`,
      page_referrer: `${ORIGIN}/fr/work/tf1`,
    });
    expect(JSON.stringify(commands())).not.toMatch(/private|email=|#contact/);
  });

  it('redacts unknown routes and forwards only runtime-validated enum parameters', () => {
    const service = initialize();
    service.accept();
    events.next(
      new NavigationEnd(1, '/fr/private@example.com', '/fr/private@example.com?message=secret'),
    );
    service.track('assistant_send', {
      locale: 'fr',
      channel: 'private@example.com',
      message: 'Secret conversation',
    } as unknown as AnalyticsParameters);
    service.track('private_event' as AnalyticsEvent);

    expect(measurements('page_view').at(-1)?.[2]).toMatchObject({
      page_location: `${ORIGIN}/fr/404`,
    });
    expect(measurements('assistant_send')[0]?.[2]).toEqual(
      expect.objectContaining({ locale: 'fr' }),
    );
    expect(JSON.stringify(commands())).not.toMatch(/private|Secret|message=|secret/);
    expect(measurements('private_event')).toHaveLength(0);
  });

  it('retains only the documented campaign labels, separate from the stripped URL', () => {
    browser.location.href = `${ORIGIN}/fr?utm_source=linkedin&utm_medium=social&utm_campaign=cv&utm_content=private@example.com`;
    const service = initialize();
    service.accept();

    expect(commands().find((entry) => entry[0] === 'set')?.[1]).toMatchObject({
      campaign_source: 'linkedin',
      campaign_medium: 'social',
      campaign_name: 'cv',
    });
    expect(JSON.stringify(commands())).not.toContain('utm_');
    expect(JSON.stringify(commands())).not.toContain('private@example.com');
  });

  it('does not forward arbitrary campaign values or override referral attribution', () => {
    browser.location.href = `${ORIGIN}/?utm_source=private@example.com&utm_medium=email&utm_campaign=secret`;
    const service = initialize();
    service.accept();
    const set = commands().find((entry) => entry[0] === 'set')?.[1];
    expect(set).not.toHaveProperty('campaign_source');
    expect(set).not.toHaveProperty('campaign_medium');
    expect(set).not.toHaveProperty('campaign_name');
    expect(set).toHaveProperty('page_referrer', 'https://www.linkedin.com');
    expect(JSON.stringify(commands())).not.toMatch(/private|secret/);
  });

  it('records a 90 percent scroll once per page, never before consent or for short pages', () => {
    const service = initialize();
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2_000,
      configurable: true,
    });
    browser.scrollY = 1_000;
    listeners.get('scroll')?.(new Event('scroll'));
    expect(browser.dataLayer).toBeUndefined();
    service.accept();
    listeners.get('scroll')?.(new Event('scroll'));
    listeners.get('scroll')?.(new Event('scroll'));
    expect(measurements('scroll')).toHaveLength(1);
    expect(measurements('scroll')[0]?.[2]).toMatchObject({ percent_scrolled: 90 });

    events.next(new NavigationEnd(1, '/', '/'));
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 600 });
    listeners.get('scroll')?.(new Event('scroll'));
    expect(measurements('scroll')).toHaveLength(1);
  });

  it('withdraws consent, clears GA cookies, suppresses future events, and reloads', () => {
    const service = initialize();
    service.accept();
    vi.spyOn(document, 'cookie', 'get').mockReturnValue(
      '_ga=client; _ga_TEST123456=session; portfolio-theme=dark',
    );
    const cookies = vi.spyOn(document, 'cookie', 'set').mockImplementation(() => {});
    service.reject();

    expect(service.consent()).toBe('denied');
    expect(browser['ga-disable-G-TEST123456']).toBe(true);
    expect(document.scripts).toHaveLength(0);
    expect(cookies).toHaveBeenCalledWith('_ga=; Max-Age=0; path=/; SameSite=Lax');
    expect(cookies.mock.calls.flat().join(' ')).not.toContain('portfolio-theme');
    expect(browser.location.reload).toHaveBeenCalledOnce();
    service.track('assistant_send');
    expect(measurements('assistant_send')).toHaveLength(0);
  });

  it('applies withdrawal from another tab without waiting for a new page interaction', () => {
    const service = initialize();
    service.accept();
    saveChoice('denied');
    listeners.get('storage')?.(
      new StorageEvent('storage', { key: KEY, newValue: localStorage.getItem(KEY) }),
    );

    expect(service.consent()).toBe('denied');
    expect(browser['ga-disable-G-TEST123456']).toBe(true);
    expect(browser.location.reload).toHaveBeenCalledOnce();
    expect(document.scripts).toHaveLength(0);
  });

  it('handles blocked storage without breaking consent controls', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const service = initialize();
    expect(() => service.accept()).not.toThrow();
    expect(service.consent()).toBe('granted');
    expect(() => service.reject()).not.toThrow();
    expect(service.consent()).toBe('denied');
    expect(browser['ga-disable-G-TEST123456']).toBe(true);
  });

  it('does not reload into a stale stored grant when withdrawal persistence fails', () => {
    saveChoice('granted');
    const service = initialize();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('full');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    service.reject();

    expect(service.consent()).toBe('denied');
    expect(browser['ga-disable-G-TEST123456']).toBe(true);
    expect(browser.location.reload).not.toHaveBeenCalled();
    expect(document.scripts).toHaveLength(0);
  });

  it('expires an active grant and never records an event after expiry', () => {
    const expiresAt = Date.now() + 1_000;
    saveChoice('granted', expiresAt);
    const service = initialize();
    vi.spyOn(Date, 'now').mockReturnValue(expiresAt + 1);
    service.track('assistant_open');

    expect(service.consent()).toBe('pending');
    expect(browser['ga-disable-G-TEST123456']).toBe(true);
    expect(browser.location.reload).toHaveBeenCalledOnce();
    expect(measurements('assistant_open')).toHaveLength(0);
  });

  it('performs no request, storage operation or tag injection during SSR', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DOCUMENT, useValue: document },
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    const read = vi.spyOn(Storage.prototype, 'getItem');
    const service = TestBed.inject(AnalyticsService);

    expect(service.available()).toBe(false);
    expect(read).not.toHaveBeenCalled();
    expect(document.scripts).toHaveLength(0);
    http.expectNone('/api/analytics/config');
  });
});
