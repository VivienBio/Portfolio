import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';

describe('Localized not-found navigation', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient()],
    }),
  );

  it('keeps French on a missing page and clears noindex when returning home', async () => {
    const harness = await RouterTestingHarness.create('/fr/page-introuvable');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe(
      'Cette page n’existe pas.',
    );
    expect(document.documentElement.lang).toBe('fr');
    expect(harness.routeNativeElement?.querySelector('a')?.getAttribute('href')).toBe('/fr');
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex',
    );

    await harness.navigateByUrl('/fr/autre-page-introuvable');
    expect(document.title).toBe('Page introuvable · Vivien Billot');

    await harness.navigateByUrl('/fr');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
      'Des systèmes où l’erreur',
    );
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it('updates the locale when the wildcard route is reused', async () => {
    const harness = await RouterTestingHarness.create('/fr/page-introuvable');
    await harness.navigateByUrl('/missing-page');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe(
      'This page does not exist.',
    );
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toContain('Page not found');
  });
});
