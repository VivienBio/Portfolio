import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <main class="not-found">
      <p class="code" aria-hidden="true">404</p>
      <h1>This page does not exist.</h1>
      <p class="hint">Cette page n'existe pas.</p>
      <nav aria-label="Not found navigation">
        <a routerLink="/">Back to the portfolio</a>
        <a routerLink="/fr">Version française</a>
      </nav>
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
      gap: 1.6rem;
      margin-top: 1.4rem;
    }

    a {
      color: var(--ink);
      border-bottom: 1px solid var(--accent);
      font-weight: 700;
      text-decoration: none;
      padding-bottom: 0.25rem;
    }
  `,
})
export class NotFoundComponent {}
