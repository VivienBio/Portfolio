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
    const projects = element.querySelectorAll('article');
    const links = element.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]');

    expect(projects).toHaveLength(5);
    expect(element.textContent).toContain('TicTacToe Solver');
    for (const link of links) {
      expect(link.rel).toContain('noopener');
      expect(link.rel).toContain('noreferrer');
    }
  });
});
