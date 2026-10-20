import { Routes } from '@angular/router';

const EN_HOME_TITLE = 'Vivien Billot — Freelance Senior Software Engineer (.NET)';
const FR_HOME_TITLE = 'Vivien Billot — Senior Software Engineer .NET freelance';

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
    title: 'Real-time sports pricing at Betclic — Vivien Billot',
  },
  {
    path: 'work/tf1',
    loadComponent: () =>
      import('./features/case-study/case-study.component').then(
        ({ CaseStudyComponent }) => CaseStudyComponent,
      ),
    data: { locale: 'en', slug: 'tf1' },
    title: 'Modernizing TF1’s advertising platform — Vivien Billot',
  },
  {
    path: 'fr/work/betclic',
    loadComponent: () =>
      import('./features/case-study/case-study.component').then(
        ({ CaseStudyComponent }) => CaseStudyComponent,
      ),
    data: { locale: 'fr', slug: 'betclic' },
    title: 'Pricing sportif temps réel chez Betclic — Vivien Billot',
  },
  {
    path: 'fr/work/tf1',
    loadComponent: () =>
      import('./features/case-study/case-study.component').then(
        ({ CaseStudyComponent }) => CaseStudyComponent,
      ),
    data: { locale: 'fr', slug: 'tf1' },
    title: 'Moderniser le SI publicitaire de TF1 — Vivien Billot',
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./features/privacy/privacy.component').then(
        ({ PrivacyComponent }) => PrivacyComponent,
      ),
    data: { locale: 'en' },
    title: 'Privacy · Vivien Billot',
  },
  {
    path: 'fr/confidentialite',
    loadComponent: () =>
      import('./features/privacy/privacy.component').then(
        ({ PrivacyComponent }) => PrivacyComponent,
      ),
    data: { locale: 'fr' },
    title: 'Confidentialité · Vivien Billot',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        ({ NotFoundComponent }) => NotFoundComponent,
      ),
  },
];
