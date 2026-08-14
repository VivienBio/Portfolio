import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should expose the router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('lazy-loads every page and renders a not-found route for unknown URLs', () => {
    expect(routes[0]?.path).toBe('');
    expect(routes[0]?.data).toMatchObject({ locale: 'en' });
    expect(routes.map(({ path }) => path)).toEqual([
      '',
      'fr',
      'work/betclic',
      'work/tf1',
      'fr/work/betclic',
      'fr/work/tf1',
      '**',
    ]);
    for (const route of routes) {
      expect(route.loadComponent).toBeTypeOf('function');
    }
  });
});
