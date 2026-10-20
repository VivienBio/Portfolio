import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SeoPage } from '../infrastructure/site';
import { SeoService } from './seo.service';

const ARTICLE: SeoPage = {
  title: 'Real-time sports pricing at Betclic — Vivien Billot',
  description: 'A proprietary sports-pricing chain.',
  path: '/work/betclic',
  locale: 'en',
  ogType: 'article',
  image: '/og-case-betclic-en.jpg',
  published: '2026-09-21',
  modified: '2026-10-20',
  alternates: [{ hreflang: 'fr', path: '/fr/work/betclic' }],
};

const PROFILE: SeoPage = {
  title: 'Vivien Billot — Senior Software Engineer .NET freelance',
  description: 'Senior Software Engineer & Tech Lead freelance.',
  path: '/fr',
  locale: 'fr',
  ogType: 'profile',
  modified: '2026-10-20',
  alternates: [{ hreflang: 'en', path: '/' }],
};

describe('SeoService', () => {
  let document: Document;
  let seo: SeoService;

  beforeEach(() => {
    document = TestBed.inject(DOCUMENT);
    seo = TestBed.inject(SeoService);
  });

  function meta(property: string): string | null | undefined {
    return document.head.querySelector(`meta[property="${property}"]`)?.getAttribute('content');
  }

  function graph(): Record<string, unknown>[] {
    const json = JSON.parse(document.getElementById('person-json-ld')?.textContent ?? '{}');
    return json['@graph'];
  }

  it('describes a case study as an article with author, dates and breadcrumbs', () => {
    seo.apply(ARTICLE);

    expect(document.head.querySelector('meta[name="author"]')?.getAttribute('content')).toBe(
      'Vivien Billot',
    );
    expect(meta('article:published_time')).toBe('2026-09-21');
    expect(meta('article:modified_time')).toBe('2026-10-20');
    expect(meta('article:author')).toBe('https://vivien-billot.web.app/');
    const nodes = graph();
    const article = nodes.find((node) => node['@type'] === 'Article');
    expect(article?.['datePublished']).toBe('2026-09-21');
    expect(article?.['author']).toEqual({ '@id': 'https://vivien-billot.web.app/#person' });
    expect(nodes.some((node) => node['@type'] === 'BreadcrumbList')).toBe(true);
    expect(nodes.find((node) => node['@type'] === 'Person')?.['sameAs']).toContain(
      'https://www.linkedin.com/in/vivien-billot/',
    );
  });

  it('describes the home page as a profile page and drops stale article tags', () => {
    seo.apply(ARTICLE);
    seo.apply(PROFILE);

    expect(meta('article:published_time')).toBeUndefined();
    expect(meta('article:author')).toBeUndefined();
    expect(meta('profile:first_name')).toBe('Vivien');
    expect(meta('profile:last_name')).toBe('Billot');
    const nodes = graph();
    const profilePage = nodes.find((node) => node['@type'] === 'ProfilePage');
    expect(profilePage?.['mainEntity']).toEqual({ '@id': 'https://vivien-billot.web.app/#person' });
    expect(profilePage?.['inLanguage']).toBe('fr');
    expect(nodes.find((node) => node['@type'] === 'Person')?.['url']).toBe(
      'https://vivien-billot.web.app/fr',
    );
    expect(document.querySelectorAll('#person-json-ld')).toHaveLength(1);
  });
});
