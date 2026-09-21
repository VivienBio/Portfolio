import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';

const COPY = {
  fr: {
    title: 'Page introuvable · Vivien Billot',
    heading: 'Cette page n’existe pas.',
    hint: 'Le lien a peut-être changé. Retrouvez mon parcours depuis le portfolio.',
    navigation: 'Navigation de la page introuvable',
    home: 'Retour au portfolio',
    homePath: '/fr',
    alternate: 'English version',
    alternatePath: '/',
    privacy: 'Confidentialité',
  },
  en: {
    title: 'Page not found · Vivien Billot',
    heading: 'This page does not exist.',
    hint: 'The link may have changed. Explore my background from the portfolio.',
    navigation: 'Not found navigation',
    home: 'Back to the portfolio',
    homePath: '/',
    alternate: 'Version française',
    alternatePath: '/fr',
    privacy: 'Privacy',
  },
} as const;

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <main class="not-found">
      <p class="code" aria-hidden="true">404</p>
      <h1>{{ copy().heading }}</h1>
      <p class="hint">{{ copy().hint }}</p>
      <nav [attr.aria-label]="copy().navigation">
        <a [routerLink]="copy().homePath">{{ copy().home }}</a>
        <a [routerLink]="copy().alternatePath">{{ copy().alternate }}</a>
      </nav>
      @if (analytics.available()) {
        <button class="privacy-settings" type="button" (click)="analytics.openPreferences()">
          {{ copy().privacy }}
        </button>
      }
    </main>
  `,
  styles: `
    .not-found {
      display: grid;
      align-content: center;
      justify-items: start;
      gap: 0.6rem;
      min-height: 100svh;
      max-width: 1240px;
      padding: 2rem;
      margin-inline: auto;
    }

    .code {
      margin: 0;
      color: var(--accent);
      font: 800 0.9rem monospace;
      letter-spacing: 0.2em;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.2rem, 6vw, 4rem);
      letter-spacing: -0.05em;
    }

    .hint {
      margin: 0;
      color: var(--muted);
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 1.6rem;
      margin-top: 1.4rem;
    }

    a {
      display: inline-flex;
      align-items: center;
      min-height: 48px;
      color: var(--ink);
      border-bottom: 1px solid var(--accent);
      font-weight: 700;
      text-decoration: none;
      padding-bottom: 0.25rem;
    }
  `,
})
export class NotFoundComponent {
  protected readonly analytics = inject(AnalyticsService);
  private readonly route = inject(ActivatedRoute);
  private readonly segments = toSignal(this.route.url, { initialValue: this.route.snapshot.url });
  private readonly locale = computed(() => (this.segments()[0]?.path === 'fr' ? 'fr' : 'en'));
  protected readonly copy = computed(() => COPY[this.locale()]);

  constructor() {
    const document = inject(DOCUMENT);
    const title = inject(Title);
    const meta = inject(Meta);
    effect(() => {
      document.documentElement.lang = this.locale();
      title.setTitle(this.copy().title);
      meta.updateTag({ name: 'robots', content: 'noindex' });
    });
  }
}
