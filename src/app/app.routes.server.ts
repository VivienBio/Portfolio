import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'fr', renderMode: RenderMode.Prerender },
  { path: 'work/betclic', renderMode: RenderMode.Prerender },
  { path: 'work/tf1', renderMode: RenderMode.Prerender },
  { path: 'fr/work/betclic', renderMode: RenderMode.Prerender },
  { path: 'fr/work/tf1', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server },
];
