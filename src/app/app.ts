import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
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
