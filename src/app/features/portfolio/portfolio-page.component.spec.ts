import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PortfolioPageComponent } from './portfolio-page.component';

describe('PortfolioPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PortfolioPageComponent],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(PortfolioPageComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a single, recruiter-focused page title', () => {
    const element = render();
    const headings = element.querySelectorAll('h1');

    expect(element.querySelector('.brand-identity')?.textContent).toContain('Vivien Billot');
    expect(element.querySelector<HTMLImageElement>('.brand-photo img')?.getAttribute('ngsrc')).toBe(
      '/vivien-billot-linkedin.jpg',
    );
    expect(element.querySelector('.brand-identity')?.textContent).toContain('38 ans');
    expect(element.querySelector('.brand-identity')?.textContent).toContain('05 mars 1988');
    expect(element.querySelector('.brand-identity')?.textContent).toContain(
      'Senior Software Engineer / Tech Lead · Betclic Group · Freelance',
    );
    expect(element.querySelector('.brand-identity')?.textContent).toContain('Freelance');
    expect(headings).toHaveLength(1);
    expect(headings[0]?.textContent).toContain('Résoudre les problèmes');
    expect(headings[0]?.textContent).toContain('métier complexes');
    expect(element.querySelector('.hero .lead')?.textContent).toContain('ROI durable');
    expect(element.querySelector('.hero .lead')?.textContent).toContain('dette technique');
  });

  it('renders every expertise and professional experience from the repository', () => {
    const element = render();

    expect(element.querySelectorAll('.expertise-grid article')).toHaveLength(4);
    expect(element.querySelectorAll('.timeline article')).toHaveLength(6);
    expect(element.textContent).toContain('Betclic Group');
    expect(element.textContent).toContain('Groupe TF1');
    expect(element.textContent).toContain('Rent A Car');
    expect(element.textContent).toContain('Stago');
    expect(element.textContent).toContain('Total');
  });

  it('presents an exhaustive impact matrix', () => {
    const element = render();
    const cases = element.querySelectorAll('.impact-matrix article');

    expect(cases).toHaveLength(6);
    expect(element.textContent).toContain('Contribution structurante');
    expect(element.textContent).toContain('Impact recherché');
    expect(element.textContent).toContain('BENTLEY SYSTEMS');
    expect(element.textContent).toContain('TOTAL');
    for (const caseStudy of cases) {
      expect(caseStudy.querySelector('h3')?.textContent?.trim()).toBeTruthy();
      expect(caseStudy.querySelectorAll('.impact-list li').length).toBeGreaterThanOrEqual(2);
      expect(caseStudy.querySelectorAll('.impact-tags li').length).toBeGreaterThanOrEqual(5);
    }
  });

  it('highlights quantitative work, multi-team leadership, and LinkedIn recommendations', () => {
    const element = render();

    expect(element.textContent).toContain('Monte-Carlo');
    expect(element.textContent).toContain('GPU');
    expect(element.textContent).toContain('Dagger');
    expect(element.textContent).toContain('deux équipes');
    expect(element.textContent).toContain('11 projets');
    expect(element.textContent).toContain('500+');
    expect(
      element.querySelector('a[href="https://www.linkedin.com/in/vivien-billot-a86b2557/"]')
        ?.textContent,
    ).toContain('recommandations');
  });

  it('presents strengths alongside managed points of vigilance', () => {
    const element = render();
    const items = element.querySelectorAll('.working-style-grid article');

    expect(items).toHaveLength(6);
    expect(element.textContent).toContain('Voir le système dans son ensemble');
    expect(element.textContent).toContain('Point de vigilance');
    expect(element.textContent).toContain('Mon garde-fou');
  });

  it('shows personal projects and the portfolio assistant', () => {
    const element = render();
    const learning = element.querySelector('#formation');
    const projects = element.querySelector('#projets');
    const contact = element.querySelector('#contact');

    expect(element.querySelectorAll('.projects-grid article')).toHaveLength(5);
    expect(element.textContent).toContain('TicTacToe Solver');
    expect(element.querySelector('app-portfolio-assistant')).toBeTruthy();
    expect(Boolean(learning && projects && learning.compareDocumentPosition(projects) & 4)).toBe(
      true,
    );
    expect(Boolean(projects && contact && projects.compareDocumentPosition(contact) & 4)).toBe(
      true,
    );
  });

  it('uses the expected semantic landmarks and accessible navigation', () => {
    const element = render();

    expect(element.querySelector('header')).toBeTruthy();
    expect(element.querySelector('main#contenu')).toBeTruthy();
    expect(element.querySelector('footer')).toBeTruthy();
    expect(element.querySelector('.footer-cta')).toBeNull();
    expect(element.querySelector('.footer-directory')).toBeNull();
    expect(element.querySelector('.contact-directory')?.getAttribute('aria-label')).toBe(
      'Coordonnées et liens utiles',
    );
    expect(element.querySelector('section#contact')?.getAttribute('aria-labelledby')).toBe(
      'contact-title',
    );
    expect(element.querySelector('section#contact')?.textContent).toContain('cadrer vite');
    expect(element.querySelector('a[href="#contact"]')?.textContent).toContain('Contact');
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe('Navigation principale');
    expect(element.querySelector('.skip-link')?.getAttribute('href')).toBe('#contenu');
  });

  it('puts direct recruiter contact paths and the CV PDF in the page', () => {
    const element = render();
    const cvLinks = element.querySelectorAll<HTMLAnchorElement>(
      'a[href="/assets/CV-Vivien-Billot-FR.pdf"]',
    );
    const englishCvLink = element.querySelector<HTMLAnchorElement>(
      'section#contact a[href="/assets/CV-Vivien-Billot-EN.pdf"]',
    );
    const languageSwitch = element.querySelector<HTMLAnchorElement>('.language-switch');

    expect(element.querySelector<HTMLAnchorElement>('a[href^="mailto:"]')?.href).toContain(
      'billot.vivien@gmail.com',
    );
    expect(element.querySelector<HTMLAnchorElement>('a[href^="tel:"]')?.getAttribute('href')).toBe(
      'tel:+33623857732',
    );
    expect(cvLinks.length).toBeGreaterThanOrEqual(2);
    expect(cvLinks[0]?.getAttribute('download')).toBe('CV-Vivien-Billot-FR.pdf');
    expect(cvLinks[0]?.getAttribute('aria-label')).toContain('Télécharger le CV français');
    expect(englishCvLink?.getAttribute('download')).toBe('CV-Vivien-Billot-EN.pdf');
    expect(element.querySelector('section#contact')?.textContent).toContain(
      'billot.vivien@gmail.com',
    );
    expect(element.querySelector('section#contact')?.textContent).toContain('06 23 85 77 32');
    expect(element.querySelector('footer')?.textContent).not.toContain('billot.vivien@gmail.com');
    expect(languageSwitch?.textContent).toContain('FR');
    expect(languageSwitch?.textContent).toContain('EN');
    expect(languageSwitch?.getAttribute('href')).toBe('/en');
  });

  it('gives controls and non-decorative regions accessible names', () => {
    const element = render();
    const themeButton = element.querySelector<HTMLButtonElement>('.theme-button');
    const labelledRegions = element.querySelectorAll('[aria-label]');

    expect(themeButton?.getAttribute('aria-label')).toBe('Activer le thème sombre');
    expect(themeButton?.getAttribute('title')).toBe('Activer le thème sombre');
    expect(labelledRegions.length).toBeGreaterThanOrEqual(6);
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

    button?.click();
    TestBed.flushEffects();

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(button?.getAttribute('aria-label')).toBe('Activer le thème clair');
  });
});
