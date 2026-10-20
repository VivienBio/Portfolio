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

  it('links both case studies from the career timeline', () => {
    const element = render();
    const links = element.querySelectorAll<HTMLAnchorElement>('#work .case-link');

    expect(links).toHaveLength(2);
    expect(links[0]?.getAttribute('href')).toBe('/work/betclic');
    expect(links[1]?.getAttribute('href')).toBe('/work/tf1');
    expect(links[0]?.textContent).toContain('real-time sports odds');
    expect(links[1]?.textContent).toContain('modernizing');
    expect(element.querySelectorAll('.timeline-step.is-major')).toHaveLength(2);
    expect(element.querySelector('.timeline-step.is-current')?.textContent).toContain('Betclic');
  });

  it('tells the career once, in order, from the current mission to the internships', () => {
    const element = render();
    const career = element.querySelector('#work ol#parcours');
    const years = Array.from(career?.querySelectorAll('.timeline-year') ?? []).map((year) =>
      year.textContent?.trim(),
    );

    expect(years).toEqual(['2025', '2022', '2017', '2012', '2011']);
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
    expect(career?.textContent).toContain('11 projects shipped');
    expect(career?.textContent).toContain('500+ branches');
    expect(career?.textContent).toContain('Easy Péage');
    expect(element.querySelector('.metrics')).toBeNull();
    expect(element.querySelector('#work a.work-cv')?.getAttribute('href')).toBe(
      '/assets/CV-Vivien-Billot-EN.pdf',
    );
  });

  it('shows a labelled market replay in the hero, with its events as text', () => {
    const element = render();
    const replay = element.querySelector('.hero figure.replay');
    const events = replay?.querySelectorAll('.replay-log li') ?? [];

    expect(replay?.querySelector('figcaption')?.textContent).toContain('Illustration');
    expect(replay?.querySelectorAll('svg[role="img"][aria-label]')).toHaveLength(2);
    expect(events).toHaveLength(3);
    expect(events[0]?.querySelector('.replay-time')?.textContent).toBe('62:14.208');
  });

  it('offers three kinds of missions backed by facts, with practical details', () => {
    const element = render();
    const missions = element.querySelector('#missions');
    const practical = missions?.querySelector('dl.practical');

    expect(missions?.querySelectorAll('.missions-list > li')).toHaveLength(3);
    expect(missions?.querySelectorAll('.mission-proof')).toHaveLength(3);
    expect(practical?.querySelectorAll('dt')).toHaveLength(4);
    expect(practical?.textContent).toContain('Betclic');
    expect(practical?.textContent).toContain('Paris region');
    expect(practical?.textContent).toContain('hybrid or remote');
    expect(missions?.querySelector('a.missions-action')?.getAttribute('href')).toBe(
      'mailto:billot.vivien@gmail.com?subject=Mission%20proposal',
    );
    expect(element.querySelector('.hero a.primary')?.getAttribute('href')).toBe(
      'mailto:billot.vivien@gmail.com?subject=Mission%20proposal',
    );
  });

  it('groups principles, stack and points of vigilance in one approach section', () => {
    const element = render();
    const approach = element.querySelector('#approche');

    expect(approach?.querySelectorAll('#principes > li')).toHaveLength(6);
    expect(approach?.querySelectorAll('#expertise .stack > div')).toHaveLength(6);
    expect(approach?.querySelectorAll('.vigilance > li')).toHaveLength(3);
    expect(approach?.textContent).toContain('Simplicity before sophistication');
    expect(approach?.textContent).toContain('Tests are a design tool');
    expect(approach?.textContent).toContain('Distributed systems & messaging');
    expect(approach?.textContent).toContain('Technical leadership');
    expect(approach?.textContent).toContain('High standards for quality');
    expect(approach?.textContent).toContain('I timebox the analysis');
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
    expect(element.querySelector('section#formation')?.textContent).toContain('Education');
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
    expect(element.querySelector('nav a[href="/#work"]')?.textContent).toContain('Career');
    expect(element.querySelector('nav a[href="/#missions"]')?.textContent).toContain('Services');
    expect(element.querySelector('a[href="/#contact"]')?.textContent).toContain('Contact');
    expect(element.querySelector('.skip-link')?.getAttribute('href')).toBe('/#contenu');
    expect(element.querySelector('section#contact')?.getAttribute('aria-labelledby')).toBe(
      'contact-title',
    );
    expect(element.querySelectorAll('nav a')).toHaveLength(5);
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
