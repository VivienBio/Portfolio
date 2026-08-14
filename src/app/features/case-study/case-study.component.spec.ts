import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CASE_STUDIES } from './case-studies.copy';
import { CaseStudyComponent } from './case-study.component';

describe('CaseStudyComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CaseStudyComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(CaseStudyComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the Betclic case study in English by default', () => {
    const element = render();

    expect(element.querySelector('h1')?.textContent).toContain('Real-time sports odds');
    expect(element.textContent).toContain('Case study · Betclic Group');
    expect(element.textContent).toContain('Monte Carlo');
    expect(element.textContent).toContain('replay');
  });

  it('follows the full case-study narrative structure', () => {
    const element = render();
    const sections = Array.from(element.querySelectorAll('.case-section h2')).map((heading) =>
      heading.textContent?.trim(),
    );

    expect(sections).toEqual([
      'Context',
      'Challenge',
      'My role',
      'Constraints',
      'How it fits together',
      'Key decisions',
      'Where it stands',
      'What I learned',
      'Stack & practices',
    ]);
    expect(element.querySelectorAll('.decision')).toHaveLength(3);
    expect(element.querySelectorAll('.diagram-flow li')).toHaveLength(4);
  });

  it('spells out problem, options, decision, and trade-off for every decision', () => {
    const element = render();

    for (const decision of Array.from(element.querySelectorAll('.decision'))) {
      const labels = Array.from(decision.querySelectorAll('dt')).map((dt) => dt.textContent);
      expect(labels).toEqual(['Problem', 'Options', 'Decision', 'Trade-off']);
    }
  });

  it('keeps the confidentiality boundary explicit and the stack strictly sourced', () => {
    const element = render();

    expect(element.textContent).toContain('what Betclic has shared publicly');
    const stack = Array.from(element.querySelectorAll('.case-stack li')).map(
      (item) => item.textContent,
    );
    expect(stack).toEqual([
      'C# / .NET',
      'Monte Carlo',
      'AWS',
      'Dagger',
      'GitHub Actions',
      'Claude Code / Cursor',
    ]);
  });

  it('links back home, to the other case study, and to a contact action', () => {
    const element = render();

    expect(element.querySelector('.case-back')?.getAttribute('href')).toBe('/');
    expect(element.querySelector<HTMLAnchorElement>('.case-cta-next')?.getAttribute('href')).toBe(
      '/work/tf1',
    );
    expect(
      element.querySelector<HTMLAnchorElement>('.case-cta-primary')?.href.startsWith('mailto:'),
    ).toBe(true);
    expect(element.querySelector('.case-language')?.getAttribute('href')).toBe('/fr/work/betclic');
  });

  it('provides complete, mirrored copy for every locale and slug', () => {
    for (const locale of ['en', 'fr'] as const) {
      for (const slug of ['betclic', 'tf1'] as const) {
        const copy = CASE_STUDIES[locale][slug];

        expect(copy.slug).toBe(slug);
        expect(copy.context.paragraphs.length).toBeGreaterThan(0);
        expect(copy.role.paragraphs.length).toBeGreaterThan(0);
        expect(copy.constraints.length).toBeGreaterThanOrEqual(4);
        expect(copy.decisions).toHaveLength(3);
        for (const decision of copy.decisions) {
          expect(decision.problem.trim()).not.toBe('');
          expect(decision.options.trim()).not.toBe('');
          expect(decision.decision.trim()).not.toBe('');
          expect(decision.tradeOff.trim()).not.toBe('');
        }
        expect(copy.outcomes.length).toBeGreaterThanOrEqual(4);
        expect(copy.learned.length).toBeGreaterThanOrEqual(2);
        expect(copy.diagram.stages).toHaveLength(4);
      }
    }
  });

  it('never claims the TF1 modernization targeted AWS', () => {
    for (const locale of ['en', 'fr'] as const) {
      const tf1 = CASE_STUDIES[locale].tf1;
      const text = JSON.stringify(tf1);

      expect(text).not.toContain('AWS');
      expect(text).toContain('AKS');
    }
  });
});
