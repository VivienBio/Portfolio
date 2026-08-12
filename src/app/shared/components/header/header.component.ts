import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesService } from '../../../core/services/preferences.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="fixed w-full top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-slate-900/75 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <span
          class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400"
          >VIVIEN BILLOT</span
        >
        <button
          (click)="pref.toggleTheme()"
          class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold"
        >
          {{ pref.theme() === 'light' ? '?? Sombre' : '?? Clair' }}
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  pref = inject(PreferencesService);
}
