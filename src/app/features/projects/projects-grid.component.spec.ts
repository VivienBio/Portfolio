import { TestBed } from '@angular/core/testing';
import { LocalPortfolioRepository } from '../../core/infrastructure/local-portfolio.repository';
import { ProjectsGridComponent } from './projects-grid.component';

describe('ProjectsGridComponent', () => {
  it('renders every project with a secured external link', async () => {
    await TestBed.configureTestingModule({ imports: [ProjectsGridComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ProjectsGridComponent);
    fixture.componentRef.setInput(
      'projects',
      new LocalPortfolioRepository().getPortfolio().projects,
    );
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const projects = element.querySelectorAll('.project');
    const links = element.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]');

    expect(projects).toHaveLength(5);
    expect(links).toHaveLength(5);
    expect(element.textContent).toContain('TicTacToe Solver');
    expect(element.querySelector('h3 a')?.textContent).toContain('Portfolio');
    expect(element.querySelector('.project-tech')?.textContent).toContain('Angular 22, OpenAI');
    for (const link of links) {
      expect(link.rel).toContain('noopener');
      expect(link.rel).toContain('noreferrer');
    }
  });
});
