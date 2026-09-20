import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalyticsConsentComponent } from './features/analytics-consent/analytics-consent.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AnalyticsConsentComponent],
  template: '<router-outlet /> @defer (on idle) { <app-analytics-consent /> }',
})
export class App {
  constructor() {
    const document = inject(DOCUMENT);
    inject(ViewportScroller).setOffset(() => [
      0,
      (document.querySelector('header')?.getBoundingClientRect().height ?? 0) + 16,
    ]);
  }
}
