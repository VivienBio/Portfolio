import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/portfolio/portfolio-page.component').then(
        ({ PortfolioPageComponent }) => PortfolioPageComponent,
      ),
    data: { locale: 'fr' },
    title: 'Vivien Billot — Senior Software Engineer, Tech Lead & Freelance',
  },
  {
    path: 'en',
    loadComponent: () =>
      import('./features/portfolio/portfolio-page.component').then(
        ({ PortfolioPageComponent }) => PortfolioPageComponent,
      ),
    data: { locale: 'en' },
    title: 'Vivien Billot — Software Architect, Senior Tech Lead & Freelance',
  },
  { path: '**', redirectTo: '' },
];
