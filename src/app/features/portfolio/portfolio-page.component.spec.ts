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
      '/vivien-billot-avatar.webp',
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

  it('groups expertise, principles and working style in one approach section', () => {
    const element = render();
    const approach = element.querySelector('#approche');

    expect(approach?.querySelectorAll('.expertise-grid > li')).toHaveLength(6);
    expect(approach?.querySelectorAll('.principles-grid > li')).toHaveLength(6);
    expect(approach?.textContent).toContain('Simplicity before sophistication');
    expect(approach?.textContent).toContain('Tests are a design tool');
    expect(approach?.textContent).toContain('Distributed systems & messaging');
    expect(approach?.textContent).toContain('Technical leadership');
    expect(approach?.querySelector('#expertise')).toBeTruthy();
    expect(approach?.querySelector('#principes')).toBeTruthy();
  });

  it('tells the career once, from the case studies to the internships', () => {
    const element = render();
    const career = element.querySelector('#work #parcours');

    for (const company of [
      'Betclic Group',
      'TF1 Group',
      'Rent A Car',
      'Stago',
      'Bentley Systems',
      'Total',
    ]) {
      expect(career?.textContent).toContain(company);
    }
    expect(element.querySelector('.metrics')?.textContent).toContain('11');
    expect(element.querySelector('.metrics')?.textContent).toContain('500+');
    expect(element.querySelector('.timeline')).toBeNull();
    expect(career?.querySelector('a.work-cv')?.getAttribute('href')).toBe(
      '/assets/CV-Vivien-Billot-EN.pdf',
    );
  });

  it('offers three kinds of missions backed by facts, with practical details', () => {
    const element = render();
    const missions = element.querySelector('#missions');
    const practical = missions?.querySelector('.missions-practical');

    expect(missions?.querySelectorAll('.missions-list > li')).toHaveLength(3);
    expect(missions?.querySelectorAll('.mission-proof')).toHaveLength(3);
    expect(practical?.textContent).toContain('Betclic');
    expect(practical?.textContent).toContain('Paris region');
    expect(practical?.textContent).toContain('hybrid or remote');
    expect(practical?.querySelector('a')?.getAttribute('href')).toBe(
      'mailto:billot.vivien@gmail.com?subject=Mission%20proposal',
    );
  });

  it('presents strengths alongside managed points of vigilance', () => {
    const element = render();
    const columns = element.querySelectorAll('.working-style-column');

    expect(columns).toHaveLength(2);
    expect(columns[0]?.querySelectorAll('li')).toHaveLength(3);
    expect(columns[1]?.querySelectorAll('li')).toHaveLength(3);
    expect(columns[0]?.textContent).toContain('Seeing the whole system');
    expect(columns[1]?.textContent).toContain('What I watch');
    expect(columns[1]?.textContent).toContain('My safeguard');
  });

  it('quotes attributed LinkedIn recommendations and links to all of them', () => {
    const element = render();
    const section = element.querySelector('#recommandations');
    const quotes = section?.querySelectorAll('figure') ?? [];
    const links = section?.querySelectorAll<HTMLAnchorElement>('a') ?? [];

    expect(quotes).toHaveLength(3);
    for (const quote of quotes) {
      expect(quote.querySelector('blockquote')?.textContent?.trim().length).toBeGreaterThan(40);
      expect(quote.querySelector('figcaption strong')?.textContent?.trim()).toBeTruthy();
    }
    expect(section?.textContent).toContain('Apoorva Deshmukh');
    expect(section?.textContent).toContain('Translated from French');
    expect(links).toHaveLength(1);
    expect(links[0]?.href).toBe(
      'https://www.linkedin.com/in/vivien-billot/details/recommendations/',
    );
  });

  it('shows personal projects, recommendations, and the portfolio assistant', () => {
    const element = render();
    const projects = element.querySelector('#projets');
    const contact = element.querySelector('#contact');

    expect(element.querySelectorAll('#projets .project')).toHaveLength(5);
    expect(element.querySelector('#projets #formation')).toBeTruthy();
    expect(element.textContent).toContain('TicTacToe Solver');
    expect(element.querySelector('app-portfolio-assistant')).toBeTruthy();
    expect(
      element.querySelector('a[href="https://www.linkedin.com/in/vivien-billot/"]'),
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
    expect(element.querySelector('a[href="/#work"]')?.textContent).toContain('Work');
    expect(element.querySelector('a[href="/#contact"]')?.textContent).toContain('Contact');
    expect(element.querySelector('.skip-link')?.getAttribute('href')).toBe('/#contenu');
    expect(element.querySelector('section#contact')?.getAttribute('aria-labelledby')).toBe(
      'contact-title',
    );
    expect(element.querySelectorAll('nav a')).toHaveLength(4);
    expect(element.querySelector('.menu-toggle')?.getAttribute('aria-controls')).toBe('site-nav');
    expect(element.querySelector('nav#site-nav')).toBeTruthy();
  });

  it('opens the small-screen menu and closes it on Escape, outside clicks and navigation', () => {
    const fixture = TestBed.createComponent(PortfolioPageComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const toggle = element.querySelector<HTMLButtonElement>('.menu-toggle')!;
    const header = element.querySelector('.site-header')!;

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(header.classList).toContain('menu-open');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);

    toggle.click();
    fixture.detectChanges();
    element.querySelector<HTMLElement>('#missions')!.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    fixture.detectChanges();
    element.querySelector<HTMLAnchorElement>('nav a[href="/#contact"]')!.click();
    fixture.detectChanges();
    expect(header.classList).not.toContain('menu-open');
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
    expect(headerCv?.hasAttribute('aria-label')).toBe(false);
    expect(headerCv?.textContent).toContain('Resume PDF');
    expect(headerCv?.textContent).toContain('English resume');
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
    expect(document.title).toContain('Senior Software Engineer');
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://vivien-billot.web.app/',
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
