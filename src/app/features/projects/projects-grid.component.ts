import { Component, input } from '@angular/core';
import { PortfolioProject } from '../../core/domain/portfolio.models';

@Component({
  selector: 'app-projects-grid',
  templateUrl: './projects-grid.component.html',
  styleUrl: './projects-grid.component.scss',
})
export class ProjectsGridComponent {
  readonly projects = input.required<readonly PortfolioProject[]>();
}
