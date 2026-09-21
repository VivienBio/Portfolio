import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('serves bilingual privacy information with matching language, canonical and sitemap', async ({
  page,
  request,
}) => {
  for (const [path, locale, title, alternate] of [
    ['/fr/confidentialite', 'fr', 'Confidentialité', '/privacy'],
    ['/privacy', 'en', 'Privacy', '/fr/confidentialite'],
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://vivien-billot.web.app${path}`,
    );
    await expect(page.locator(`header a[href="${alternate}"]`)).toBeVisible();
    await expect(page.getByRole('link', { name: /OpenAI/ })).toHaveAttribute(
      'href',
      'https://developers.openai.com/api/docs/guides/your-data',
    );
    await expect(page.getByRole('link', { name: /Formspree/ })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
  }
  const sitemap = await request.get('/sitemap.xml');
  const xml = await sitemap.text();
  expect(xml).toContain('https://vivien-billot.web.app/privacy');
  expect(xml).toContain('https://vivien-billot.web.app/fr/confidentialite');
});

test('keeps French privacy anchors, theme and return navigation in French', async ({ page }) => {
  await page.goto('/fr/confidentialite');
  await page
    .getByRole('navigation', { name: 'Sur cette page' })
    .getByRole('link', { name: 'Vos droits et votre contact' })
    .click();
  await expect(page).toHaveURL(/\/fr\/confidentialite#droits$/);
  await expect(page.locator('#droits')).toBeInViewport();
  await page.getByRole('button', { name: 'Activer le thème sombre' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.locator('header').getByRole('link', { name: '← Portfolio' }).click();
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('opens privacy information before consent without contacting Google', async ({ page }) => {
  const googleRequests: string[] = [];
  page.on('request', (request) => {
    if (/google-analytics\.com|googletagmanager\.com/.test(request.url()))
      googleRequests.push(request.url());
  });
  await page.route('**/api/analytics/config', (route) =>
    route.fulfill({ json: { measurementId: 'G-TEST123456', allowedHostname: '127.0.0.1' } }),
  );
  await page.goto('/fr');
  const notice = page.getByRole('region', { name: 'Votre choix de confidentialité' });
  await notice.getByRole('link', { name: 'Comment vos données sont utilisées' }).click();
  await expect(page).toHaveURL(/\/fr\/confidentialite$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Confidentialité');
  await expect(page.getByRole('region', { name: 'Votre choix de confidentialité' })).toBeVisible();
  await page.getByRole('button', { name: 'Refuser', exact: true }).click();
  await page.getByRole('button', { name: 'Modifier mes choix de cookies' }).click();
  await expect(page.getByRole('region', { name: 'Votre choix de confidentialité' })).toBeVisible();
  expect(googleRequests).toEqual([]);
});
