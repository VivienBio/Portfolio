import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PortfolioPageComponent } from './portfolio-page.component';

describe('PortfolioPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PortfolioPageComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(PortfolioPageComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the English positioning by default with a single page title', () => {
    const element = render();
    const headings = element.querySelectorAll('h1');

    expect(element.querySelector('.brand-identity')?.textContent).toContain('Vivien Billot');
    expect(element.querySelector<HTMLImageElement>('.brand-photo img')?.getAttribute('ngsrc')).toBe(
      '/vivien-billot-linkedin.jpg',
    );
    expect(headings).toHaveLength(1);
    expect(headings[0]?.textContent).toContain('Systems where wrong answers');
    expect(headings[0]?.textContent).toContain('are expensive.');
    expect(element.querySelector('.hero .lead')?.textContent).toContain('Betclic');
    expect(element.querySelector('.hero .lead')?.textContent).toContain(
      'France’s largest private broadcaster',
    );
    expect(element.querySelector('.hero .lead')?.textContent).toContain('Stago');
  });

  it('links the flagship case studies and keeps the compact rows factual', () => {
    const element = render();
    const cards = element.querySelectorAll<HTMLAnchorElement>('.work-card');
    const rows = element.querySelectorAll('.work-row');

    expect(cards).toHaveLength(2);
    expect(cards[0]?.getAttribute('href')).toBe('/work/betclic');
    expect(cards[1]?.getAttribute('href')).toBe('/work/tf1');
    expect(cards[0]?.textContent).toContain('Real-time sports odds');
    expect(cards[1]?.textContent).toContain('Modernizing');
    expect(rows).toHaveLength(2);
    expect(rows[0]?.textContent).toContain('Rent A Car');
    expect(rows[0]?.textContent).toContain('Easy Péage');
    expect(rows[1]?.textContent).toContain('Stago');
  });

  it('shows six engineering principles and six problem-oriented expertise areas', () => {
    const element = render();

    expect(element.querySelectorAll('.principles-grid article')).toHaveLength(6);
    expect(element.textContent).toContain('Simplicity before sophistication');
    expect(element.textContent).toContain('Tests are a design tool');
    expect(element.querySelectorAll('.expertise-grid article')).toHaveLength(6);
    expect(element.textContent).toContain('Distributed systems & messaging');
    expect(element.textContent).toContain('Technical leadership');
  });

  it('renders every professional experience with verified metrics', () => {
    const element = render();

    expect(element.querySelectorAll('.timeline article')).toHaveLength(6);
    expect(element.textContent).toContain('Betclic Group');
    expect(element.textContent).toContain('Groupe TF1');
    expect(element.textContent).toContain('Total');
    expect(element.textContent).toContain('11');
    expect(element.textContent).toContain('500+');
    expect(element.textContent).toContain('proprietary sports-pricing');
  });

  it('presents strengths alongside managed points of vigilance', () => {
    const element = render();
    const items = element.querySelectorAll('.working-style-grid article');

    expect(items).toHaveLength(6);
    expect(element.textContent).toContain('Seeing the whole system');
    expect(element.textContent).toContain('What I watch');
    expect(element.textContent).toContain('My safeguard');
  });

  it('shows personal projects, recommendations, and the portfolio assistant', () => {
    const element = render();
    const projects = element.querySelector('#projets');
    const contact = element.querySelector('#contact');

    expect(element.querySelectorAll('.projects-grid article')).toHaveLength(5);
    expect(element.textContent).toContain('TicTacToe Solver');
    expect(element.querySelector('app-portfolio-assistant')).toBeTruthy();
    expect(
      element.querySelector('a[href="https://www.linkedin.com/in/vivien-billot-a86b2557/"]'),
    ).toBeTruthy();
    expect(Boolean(projects && contact && projects.compareDocumentPosition(contact) & 4)).toBe(
      true,
    );
  });

  it('uses the expected semantic landmarks and accessible navigation', () => {
    const element = render();

    expect(element.querySelector('header')).toBeTruthy();
    expect(element.querySelector('main#contenu')).toBeTruthy();
    expect(element.querySelector('footer')).toBeTruthy();
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe('Primary navigation');
    expect(element.querySelector('a[href="#work"]')?.textContent).toContain('Work');
    expect(element.querySelector('a[href="#contact"]')?.textContent).toContain('Contact');
    expect(element.querySelector('.skip-link')?.getAttribute('href')).toBe('#contenu');
    expect(element.querySelector('section#contact')?.getAttribute('aria-labelledby')).toBe(
      'contact-title',
    );
  });

  it('puts direct recruiter contact paths and both resumes in the page', () => {
    const element = render();
    const languageSwitch = element.querySelector<HTMLAnchorElement>('.language-switch');
    const headerCv = element.querySelector<HTMLAnchorElement>('.cv-download');

    expect(element.querySelector<HTMLAnchorElement>('a[href^="mailto:"]')?.href).toContain(
      'billot.vivien@gmail.com',
    );
    expect(element.querySelector<HTMLAnchorElement>('a[href^="tel:"]')?.getAttribute('href')).toBe(
      'tel:+33623857732',
    );
    expect(headerCv?.getAttribute('href')).toBe('/assets/CV-Vivien-Billot-EN.pdf');
    expect(headerCv?.getAttribute('aria-label')).toContain('English resume');
    expect(
      element.querySelector('section#contact a[href="/assets/CV-Vivien-Billot-FR.pdf"]'),
    ).toBeTruthy();
    expect(
      element.querySelector('section#contact a[href="/assets/CV-Vivien-Billot-EN.pdf"]'),
    ).toBeTruthy();
    expect(languageSwitch?.getAttribute('href')).toBe('/fr');
    expect(languageSwitch?.textContent).toContain('EN');
    expect(languageSwitch?.textContent).toContain('FR');
  });

  it('applies the SEO metadata for the English home page', () => {
    render();

    expect(document.title).toContain('Vivien Billot');
    expect(document.title).toContain('Tech Lead');
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://www.vivienbillot.dev/',
    );
    expect(
      document.head.querySelectorAll('link[rel="alternate"][hreflang]').length,
    ).toBeGreaterThanOrEqual(3);
    expect(
      document.head.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    ).toContain('og-image.jpg');
    expect(document.getElementById('person-json-ld')?.textContent).toContain('Vivien Billot');
  });

  it('secures every link that opens a new browsing context', () => {
    const links = render().querySelectorAll<HTMLAnchorElement>('a[target="_blank"]');

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.rel).toContain('noopener');
      expect(link.rel).toContain('noreferrer');
      expect(link.href.startsWith('https://')).toBe(true);
    }
  });

  it('does not generate duplicate element identifiers', () => {
    const ids = Array.from(render().querySelectorAll<HTMLElement>('[id]')).map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toggles the theme from the user-facing control', () => {
    const element = render();
    const button = element.querySelector<HTMLButtonElement>('.theme-button');

    expect(button?.getAttribute('aria-label')).toBe('Switch to dark theme');
    button?.click();
    TestBed.flushEffects();

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(button?.getAttribute('aria-label')).toBe('Switch to light theme');
  });
});
