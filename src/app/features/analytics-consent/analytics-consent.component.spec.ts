import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { AnalyticsConsent, AnalyticsService } from '../../core/services/analytics.service';
import { AnalyticsConsentComponent } from './analytics-consent.component';

describe('AnalyticsConsentComponent', () => {
  let fixture: ComponentFixture<AnalyticsConsentComponent>;
  let navigation: Subject<NavigationEnd>;
  const analytics = {
    available: signal(false),
    consent: signal<AnalyticsConsent>('pending'),
    preferencesOpen: signal(false),
    accept: vi.fn(() => {
      analytics.consent.set('granted');
      analytics.preferencesOpen.set(false);
    }),
    reject: vi.fn(() => {
      analytics.consent.set('denied');
      analytics.preferencesOpen.set(false);
    }),
    closePreferences: vi.fn(() => analytics.preferencesOpen.set(false)),
  };

  beforeEach(async () => {
    analytics.available.set(false);
    analytics.consent.set('pending');
    analytics.preferencesOpen.set(false);
    vi.clearAllMocks();
    navigation = new Subject<NavigationEnd>();
    await TestBed.configureTestingModule({
      imports: [AnalyticsConsentComponent],
      providers: [
        { provide: AnalyticsService, useValue: analytics },
        { provide: Router, useValue: { url: '/fr', events: navigation } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AnalyticsConsentComponent);
    fixture.detectChanges();
  });

  it('stays absent when analytics is not configured', () => {
    expect(fixture.nativeElement.querySelector('.analytics-consent')).toBeNull();
    expect(analytics.accept).not.toHaveBeenCalled();
    expect(analytics.reject).not.toHaveBeenCalled();
  });

  it('offers a nonmodal French cookie notice with direct accept and reject actions', () => {
    analytics.available.set(true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[role="region"]')?.getAttribute('lang')).toBe('fr');
    expect(element.querySelector('[aria-modal]')).toBeNull();
    expect(element.textContent).toContain('utilise des cookies');
    expect(element.textContent).toContain('180 jours');
    expect(element.querySelector('.consent-reject')?.textContent).toBe('Refuser');
    expect(element.querySelector('.consent-accept')?.textContent).toBe('Accepter');
    element.querySelector<HTMLButtonElement>('.consent-reject')?.click();
    fixture.detectChanges();
    expect(analytics.reject).toHaveBeenCalledOnce();
    expect(element.querySelector('.analytics-consent')).toBeNull();
  });

  it('updates the notice language after SPA navigation without changing the choice', () => {
    analytics.available.set(true);
    navigation.next(new NavigationEnd(1, '/', '/'));
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[role="region"]')?.getAttribute('lang')).toBe('en');
    expect(element.textContent).toContain('uses cookies');
    expect(element.querySelector('.consent-reject')?.textContent).toBe('Reject');
    expect(analytics.consent()).toBe('pending');
  });

  it('lets an existing opt-in be withdrawn from reopened preferences', () => {
    analytics.available.set(true);
    analytics.consent.set('granted');
    analytics.preferencesOpen.set(true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Refuser retire votre accord');
    expect(element.querySelector('.consent-close')).toBeTruthy();
    element.querySelector<HTMLButtonElement>('.consent-reject')?.click();
    fixture.detectChanges();
    expect(analytics.consent()).toBe('denied');
    expect(analytics.preferencesOpen()).toBe(false);
  });

  it('closes reopened preferences without silently changing consent', () => {
    analytics.available.set(true);
    analytics.consent.set('denied');
    analytics.preferencesOpen.set(true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.consent-close')?.click();
    fixture.detectChanges();
    expect(analytics.closePreferences).toHaveBeenCalledOnce();
    expect(analytics.consent()).toBe('denied');
    expect(analytics.accept).not.toHaveBeenCalled();
    expect(analytics.reject).not.toHaveBeenCalled();
  });

  it('removes its layout offset when the visitor accepts', () => {
    analytics.available.set(true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.consent-accept')?.click();
    fixture.detectChanges();
    expect(analytics.accept).toHaveBeenCalledOnce();
    expect(document.documentElement.style.getPropertyValue('--analytics-consent-height')).toBe('');
  });
});
