import { Component } from '@angular/core';
@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="pt-40 pb-20 text-center px-4 max-w-4xl mx-auto">
      <h1 class="text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
        Tech Lead Full Stack & Cloud Architect
      </h1>
      <p class="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
        Architectures logicielles robustes, expertise C# .NET, Angular, D�ploiements Cloud et
        automatisation IA.
      </p>
      <a
        href="https://linkedin.com/in/vivien-billot-a86b2557/"
        target="_blank"
        class="inline-block px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
        >Me contacter sur LinkedIn</a
      >
    </section>
  `,
})
export class HeroComponent {}
