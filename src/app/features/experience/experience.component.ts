import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-slate-50 dark:bg-slate-800/50 px-4 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-10 flex items-center">
          <span class="w-8 h-1 bg-blue-600 mr-4 rounded-full"></span>Exp�riences Phares
        </h2>
        <div class="space-y-6">
          <div
            class="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
          >
            <span
              class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider"
              >Depuis le 6 octobre 2025</span
            >
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Betclic Group - Senior Software Engineer / Tech Lead
            </h3>
            <p class="text-slate-600 dark:text-slate-400 mt-3 text-lg">
              D�veloppement de solutions logicielles critiques en C#/.NET. Int�gration de l'IA pour
              l'optimisation des daily standups.
            </p>
          </div>
          <div
            class="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
          >
            <span
              class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider"
              >Mars 2022 � 6 octobre 2025</span
            >
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              TF1 PUB - Tech Lead Full Stack
            </h3>
            <p class="text-slate-600 dark:text-slate-400 mt-3 text-lg">
              Refonte du SI Publicitaire. Architecture Microservices, DDD, Angular, Azure Cloud,
              AKS, CI/CD et s�curisation.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ExperienceComponent {}
