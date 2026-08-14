import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_URL, SeoPage, absoluteUrl, ogLocale } from '../infrastructure/site';

const MANAGED_LINK_ATTRIBUTE = 'data-seo';
const PERSON_SCRIPT_ID = 'person-json-ld';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  apply(page: SeoPage): void {
    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });

    this.meta.updateTag({ property: 'og:type', content: page.ogType });
    this.meta.updateTag({ property: 'og:site_name', content: 'Vivien Billot' });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: absoluteUrl(page.path) });
    this.meta.updateTag({ property: 'og:image', content: `${SITE_URL}/og-image.jpg` });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:locale', content: ogLocale(page.locale) });
    this.meta.updateTag({
      property: 'og:locale:alternate',
      content: ogLocale(page.locale === 'fr' ? 'en' : 'fr'),
    });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });
    this.meta.updateTag({ name: 'twitter:image', content: `${SITE_URL}/og-image.jpg` });

    this.replaceManagedLinks(page);
    this.replacePersonJsonLd(page);
  }

  private replaceManagedLinks(page: SeoPage): void {
    const head = this.document.head;
    for (const link of Array.from(head.querySelectorAll(`link[${MANAGED_LINK_ATTRIBUTE}]`))) {
      link.remove();
    }

    this.appendLink({ rel: 'canonical', href: absoluteUrl(page.path) });
    for (const alternate of page.alternates) {
      this.appendLink({
        rel: 'alternate',
        hreflang: alternate.hreflang,
        href: absoluteUrl(alternate.path),
      });
    }
  }

  private appendLink(attributes: Record<string, string>): void {
    const link = this.document.createElement('link');
    for (const [name, value] of Object.entries(attributes)) {
      link.setAttribute(name, value);
    }
    link.setAttribute(MANAGED_LINK_ATTRIBUTE, '');
    this.document.head.appendChild(link);
  }

  private replacePersonJsonLd(page: SeoPage): void {
    this.document.getElementById(PERSON_SCRIPT_ID)?.remove();
    const script = this.document.createElement('script');
    script.id = PERSON_SCRIPT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Vivien Billot',
      jobTitle: 'Senior Software Engineer / Tech Lead',
      url: absoluteUrl(page.locale === 'fr' ? '/fr' : '/'),
      image: `${SITE_URL}/vivien-billot-linkedin.jpg`,
      worksFor: { '@type': 'Organization', name: 'Betclic Group' },
      sameAs: [
        'https://www.linkedin.com/in/vivien-billot-a86b2557/',
        'https://github.com/VivienBio',
      ],
      knowsAbout: [
        'C#',
        '.NET',
        'Distributed systems',
        'Software architecture',
        'Domain-Driven Design',
        'AWS',
        'Azure',
        'Kubernetes',
        'Angular',
        'Technical leadership',
      ],
    });
    this.document.head.appendChild(script);
  }
}
