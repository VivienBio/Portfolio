import { DOCUMENT } from '@angular/common';
import { Service, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'portfolio-theme';

@Service()
export class PreferencesService {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<Theme>(this.readTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const nextTheme: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(nextTheme);
    this.applyTheme(nextTheme);
    this.document.defaultView?.localStorage?.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  private readTheme(): Theme {
    const savedTheme = this.document.defaultView?.localStorage?.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
