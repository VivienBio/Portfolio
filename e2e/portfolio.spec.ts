import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.reveal-4').first()).toHaveCSS('opacity', '1');
});

test('serves the English positioning at the root and stays inside the viewport', async ({
  page,
}) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Systems where wrong answers',
  );
  await expect(
    page.locator('#parcours').getByText('Betclic Group', { exact: false }),
  ).toBeVisible();
  await expect(page.locator('#contact')).toBeAttached();
  await expect(
    page.getByRole('link', { name: /Download Vivien Billot English resume/i }).first(),
  ).toHaveAttribute('href', '/assets/CV-Vivien-Billot-EN.pdf');
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute(
    'href',
    '/favicon.svg',
  );

  const contactNavigation = page.getByRole('link', { name: 'Contact' }).first();
  if (await contactNavigation.isVisible()) {
    await contactNavigation.click();
    await expect(page).toHaveURL(/#contact$/);
  }
});

test('exposes the SEO contract: canonical, hreflang, OpenGraph, JSON-LD, robots, sitemap', async ({
  page,
  request,
  baseURL,
}) => {
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://www.vivienbillot.dev/',
  );
  expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    /Vivien Billot/,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /og-image\.jpg$/,
  );
  await expect(page.locator('script#person-json-ld')).toHaveCount(1);

  const robots = await request.get(`${baseURL}/robots.txt`);
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap: https://www.vivienbillot.dev/sitemap.xml');
  const sitemap = await request.get(`${baseURL}/sitemap.xml`);
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('https://www.vivienbillot.dev/work/betclic');
});

test('redirects the legacy /en URLs and returns 404 for unknown pages', async ({
  request,
  baseURL,
}) => {
  const redirect = await request.get(`${baseURL}/en`, { maxRedirects: 0 });
  expect(redirect.status()).toBe(301);
  expect(redirect.headers()['location']).toBe('/');

  const unknown = await request.get(`${baseURL}/definitely-not-a-page`);
  expect(unknown.status()).toBe(404);
});

test('passes automated WCAG checks on the landing experience', async ({ page }, testInfo) => {
  const results = await new AxeBuilder({ page }).analyze();
  assertNoViolations(results.violations, testInfo.project.name);
});

test('renders a complete, accessible French experience', async ({ page }, testInfo) => {
  await page.goto('/fr');
  await expect(page.locator('.reveal-4').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Des systèmes où l’erreur');
  await expect(page.getByRole('link', { name: /Passer à la version anglaise/i })).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Télécharger le CV français/i }).first(),
  ).toHaveAttribute('href', '/assets/CV-Vivien-Billot-FR.pdf');

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);

  const results = await new AxeBuilder({ page }).analyze();
  assertNoViolations(results.violations, `${testInfo.project.name} French`);

  await page.getByRole('button', { name: /double numérique de Vivien/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
  await dialog.getByRole('button', { name: 'Parcours' }).click();
  await expect(
    dialog.getByText(/laisser un système plus compréhensible et une équipe plus autonome/i),
  ).toBeVisible();
});

test('tells the full Betclic case study with decisions and trade-offs', async ({
  page,
}, testInfo) => {
  await page.getByRole('link', { name: /Real-time sports odds/i }).click();
  await expect(page).toHaveURL(/\/work\/betclic$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Real-time sports odds');
  await expect(page.getByRole('heading', { name: 'Key decisions' })).toBeVisible();
  await expect(page.locator('.decision')).toHaveCount(3);
  await expect(page.locator('.diagram-flow li')).toHaveCount(4);
  await expect(page.getByText('what Betclic has shared publicly')).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);

  const results = await new AxeBuilder({ page }).analyze();
  assertNoViolations(results.violations, `${testInfo.project.name} case study`);
});

test('tells the TF1 modernization story and links between case studies', async ({ page }) => {
  await page.goto('/work/tf1');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Modernizing the ad platform',
  );
  await expect(page.getByText('11 projects shipped to production', { exact: false })).toBeVisible();
  await expect(page.locator('.decision')).toHaveCount(3);

  await page.getByRole('link', { name: /Next case study: Betclic/i }).click();
  await expect(page).toHaveURL(/\/work\/betclic$/);

  await page.getByRole('link', { name: 'Lire en français' }).click();
  await expect(page).toHaveURL(/\/fr\/work\/betclic$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('opens the assistant, answers without OpenAI and keeps the dialog accessible', async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === 'desktop') {
    await expect(page.locator('.assistant-persona')).toBeVisible();
  }
  await page.getByRole('button', { name: /professional digital twin/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
  await expect(dialog).toBeVisible();
  if (testInfo.project.name === 'desktop') {
    await expect(page.locator('.assistant-sidekick .assistant-persona-side')).toBeVisible();
  }
  await dialog.getByRole('button', { name: 'Career path' }).click();
  await expect(
    dialog.getByText(/leave a clearer system and a more autonomous team/i),
  ).toBeVisible();
  await expect(dialog.getByText(/March 5, 1988/i)).toHaveCount(0);

  const results = await new AxeBuilder({ page }).include('#portfolio-assistant-panel').analyze();
  assertNoViolations(results.violations, 'assistant');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('lets visitors hide and restore the floating assistant', async ({ page }) => {
  await page.getByRole('button', { name: 'Hide Vivien' }).click();

  await expect(page.getByRole('button', { name: 'Show Vivien' })).toBeVisible();
  await expect(page.locator('.assistant-dock')).toBeHidden();

  await page.getByRole('button', { name: 'Show Vivien' }).click();
  await expect(page.getByRole('dialog', { name: 'Vivien Billot' })).toBeVisible();
});

test('keeps the main header informative and routes contact to the page footer', async ({
  page,
}) => {
  await expect(page.locator('.brand-identity')).toContainText('Vivien Billot');
  await expect(page.locator('.brand-identity')).toContainText('Freelance');
  await expect(page.locator('.brand-identity')).toContainText('Senior Software Engineer');
  await expect(page.locator('section#contact a[href^="mailto:"]').first()).toBeVisible();
});

function assertNoViolations(violations: readonly Result[], context: string): void {
  if (violations.length === 0) {
    return;
  }

  const details = violations.flatMap((violation) =>
    violation.nodes.map(
      (node) =>
        `${violation.id} ${node.target.join(' ')}: ${node.any.map(({ message }) => message).join(' ')}`,
    ),
  );
  throw new Error(`${context}\n${details.join('\n')}`);
}
