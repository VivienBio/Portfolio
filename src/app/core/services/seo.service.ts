import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_URL, SeoPage, absoluteUrl, ogLocale } from '../infrastructure/site';

const MANAGED_LINK_ATTRIBUTE = 'data-seo';
const PERSON_SCRIPT_ID = 'person-json-ld';
const DEFAULT_SOCIAL_IMAGE = '/og-image.jpg';
/** Bump whenever a social image changes: LinkedIn and others cache previews by image URL. */
const SOCIAL_IMAGE_VERSION = '2026-10-20-night';
const AUTHOR = 'Vivien Billot';
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const ARTICLE_PROPERTIES = [
  'article:published_time',
  'article:modified_time',
  'article:author',
  'article:section',
] as const;
const PROFILE_PROPERTIES = ['profile:first_name', 'profile:last_name', 'profile:username'] as const;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  apply(page: SeoPage): void {
    const image = `${SITE_URL}${page.image ?? DEFAULT_SOCIAL_IMAGE}?v=${SOCIAL_IMAGE_VERSION}`;
    this.meta.removeTag('name="robots"');
    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ name: 'author', content: AUTHOR });

    this.meta.updateTag({ property: 'og:type', content: page.ogType });
    this.meta.updateTag({ property: 'og:site_name', content: AUTHOR });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: absoluteUrl(page.path) });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:alt', content: page.title });
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
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: page.title });
    this.applyTypeSpecificTags(page);

    this.replaceManagedLinks(page);
    this.replaceStructuredData(page, image);
  }

  /** Open Graph article/profile tags let LinkedIn and others show the author and dates. */
  private applyTypeSpecificTags(page: SeoPage): void {
    for (const property of [...ARTICLE_PROPERTIES, ...PROFILE_PROPERTIES]) {
      this.meta.removeTag(`property="${property}"`);
    }

    if (page.ogType === 'article') {
      this.meta.updateTag({ property: 'article:author', content: homeUrl(page) });
      this.meta.updateTag({ property: 'article:section', content: 'Case study' });
      if (page.published) {
        this.meta.updateTag({ property: 'article:published_time', content: page.published });
      }
      if (page.modified) {
        this.meta.updateTag({ property: 'article:modified_time', content: page.modified });
      }
    }

    if (page.ogType === 'profile') {
      this.meta.updateTag({ property: 'profile:first_name', content: 'Vivien' });
      this.meta.updateTag({ property: 'profile:last_name', content: 'Billot' });
      this.meta.updateTag({ property: 'profile:username', content: 'vivien-billot' });
    }
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

  private replaceStructuredData(page: SeoPage, image: string): void {
    this.document.getElementById(PERSON_SCRIPT_ID)?.remove();
    const script = this.document.createElement('script');
    script.id = PERSON_SCRIPT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [person(page), website(), ...pageNodes(page, image)],
    });
    this.document.head.appendChild(script);
  }
}

function homeUrl(page: SeoPage): string {
  return absoluteUrl(page.locale === 'fr' ? '/fr' : '/');
}

function person(page: SeoPage): Record<string, unknown> {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR,
    givenName: 'Vivien',
    familyName: 'Billot',
    jobTitle: 'Freelance Senior Software Engineer & Tech Lead',
    url: homeUrl(page),
    image: `${SITE_URL}/vivien-billot-linkedin.jpg`,
    sameAs: [
      'https://www.linkedin.com/in/vivien-billot/',
      'https://github.com/VivienBio',
      'https://www.codingame.com/profile/534d2045d7dc0057e6d53d29336657fe6190191',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'ESILV — École Supérieure d’Ingénieurs Léonard de Vinci',
      url: 'https://www.esilv.fr/',
    },
    address: { '@type': 'PostalAddress', addressRegion: 'Île-de-France', addressCountry: 'FR' },
    knowsLanguage: ['fr', 'en'],
    knowsAbout: [
      'C#',
      '.NET',
      'Distributed systems',
      'Kafka',
      'Software architecture',
      'Domain-Driven Design',
      'AWS',
      'Azure',
      'Kubernetes',
      'Angular',
      'Technical leadership',
    ],
  };
}

function website(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: AUTHOR,
    inLanguage: ['en', 'fr'],
    publisher: { '@id': PERSON_ID },
  };
}

function pageNodes(page: SeoPage, image: string): Record<string, unknown>[] {
  const url = absoluteUrl(page.path);
  const common = {
    url,
    name: page.title,
    description: page.description,
    inLanguage: page.locale,
    isPartOf: { '@id': WEBSITE_ID },
  };

  if (page.ogType === 'profile') {
    return [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#webpage`,
        ...common,
        mainEntity: { '@id': PERSON_ID },
        ...(page.modified ? { dateModified: page.modified } : {}),
      },
    ];
  }

  if (page.ogType === 'article') {
    return [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: page.title,
        description: page.description,
        image: [image],
        inLanguage: page.locale,
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        mainEntityOfPage: url,
        isPartOf: { '@id': WEBSITE_ID },
        ...(page.published ? { datePublished: page.published } : {}),
        ...(page.modified ? { dateModified: page.modified } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Portfolio', item: homeUrl(page) },
          { '@type': 'ListItem', position: 2, name: page.title, item: url },
        ],
      },
    ];
  }

  return [{ '@type': 'WebPage', '@id': `${url}#webpage`, ...common }];
}
