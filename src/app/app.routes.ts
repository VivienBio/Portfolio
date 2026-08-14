import { Routes } from '@angular/router';

const EN_HOME_TITLE =
  'Vivien Billot — Senior Software Engineer · C#/.NET, Distributed Systems';
const FR_HOME_TITLE =
  'Vivien Billot — Senior Software Engineer · C#/.NET, systèmes distribués';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/portfolio/portfolio-page.component').then(
        ({ PortfolioPageComponent }) => PortfolioPageComponent,
      ),
    data: { locale: 'en' },
    title: EN_HOME_TITLE,
  },
  {
    path: 'fr',
    loadComponent: () =>
      import('./features/portfolio/portfolio-page.component').then(
        ({ PortfolioPageComponent }) => PortfolioPageComponent,
      ),
    data: { locale: 'fr' },
    title: FR_HOME_TITLE,
  },
  {
    path: 'work/betclic',
    loadComponent: () =>
      import('./features/case-study/case-study.component').then(
        ({ CaseStudyComponent }) => CaseStudyComponent,
      ),
    data: { locale: 'en', slug: 'betclic' },
    title: 'Real-time sports pricing at Betclic — case study · Vivien Billot',
  },
  {
    path: 'work/tf1',
    loadComponent: () =>
      import('./features/case-study/case-study.component').then(
        ({ CaseStudyComponent }) => CaseStudyComponent,
      ),
    data: { locale: 'en', slug: 'tf1' },
    title: "Modernizing TF1's advertising platform — case study · Vivien Billot",
  },
  {
    path: 'fr/work/betclic',
    loadComponent: () =>
      import('./features/case-study/case-study.component').then(
        ({ CaseStudyComponent }) => CaseStudyComponent,
      ),
    data: { locale: 'fr', slug: 'betclic' },
    title: 'Pricing sportif temps réel chez Betclic — étude de cas · Vivien Billot',
  },
  {
    path: 'fr/work/tf1',
    loadComponent: () =>
      import('./features/case-study/case-study.component').then(
        ({ CaseStudyComponent }) => CaseStudyComponent,
      ),
    data: { locale: 'fr', slug: 'tf1' },
    title: 'Moderniser le SI publicitaire de TF1 — étude de cas · Vivien Billot',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        ({ NotFoundComponent }) => NotFoundComponent,
      ),
    title: 'Page not found · Vivien Billot',
  },
];
