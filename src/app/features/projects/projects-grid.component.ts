import { Component, computed, input } from '@angular/core';
import { PortfolioLocale, PortfolioProject } from '../../core/domain/portfolio.models';

const GRID_COPY = {
  en: { technologies: 'Project technologies' },
  fr: { technologies: 'Technologies du projet' },
} as const;

@Component({
  selector: 'app-projects-grid',
  templateUrl: './projects-grid.component.html',
  styleUrl: './projects-grid.component.scss',
})
export class ProjectsGridComponent {
  readonly projects = input.required<readonly PortfolioProject[]>();
  readonly locale = input<PortfolioLocale>('en');
  protected readonly copy = computed(() => GRID_COPY[this.locale()]);
}
