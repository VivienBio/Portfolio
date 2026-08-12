import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { PreferencesService } from './preferences.service';

describe('PreferencesService', () => {
  let document: Document;

  beforeEach(() => {
    localStorage.clear();
    document = TestBed.inject(DOCUMENT);
    delete document.documentElement.dataset['theme'];
  });

  afterEach(() => TestBed.resetTestingModule());

  it('uses and applies the light theme by default', () => {
    const service = TestBed.inject(PreferencesService);

    expect(service.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('toggles, applies and persists the dark theme', () => {
    const service = TestBed.inject(PreferencesService);

    service.toggleTheme();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');
  });

  it('restores a previously selected dark theme', () => {
    localStorage.setItem('portfolio-theme', 'dark');

    const service = TestBed.inject(PreferencesService);

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('ignores an invalid stored preference', () => {
    localStorage.setItem('portfolio-theme', 'unsupported');

    expect(TestBed.inject(PreferencesService).theme()).toBe('light');
  });

  it('works during SSR when browser storage is unavailable', () => {
    TestBed.resetTestingModule();
    const setAttribute = vi.fn();
    const serverDocument = {
      documentElement: { setAttribute },
      defaultView: {},
    } as unknown as Document;
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: serverDocument }],
    });

    const service = TestBed.inject(PreferencesService);

    expect(service.theme()).toBe('light');
    expect(setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(() => service.toggleTheme()).not.toThrow();
  });
});
