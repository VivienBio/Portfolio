import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.reveal-4').first()).toHaveCSS('opacity', '1');
});

test('keeps the complete page inside the viewport', async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  await expect(
    page.locator('#parcours').getByText('Betclic Group', { exact: false }),
  ).toBeVisible();
  await expect(page.locator('#contact')).toBeAttached();
  await expect(
    page.getByRole('link', { name: /Télécharger le CV français/i }).first(),
  ).toHaveAttribute('href', '/assets/CV-Vivien-Billot-FR.pdf');
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

test('passes automated WCAG checks on the landing experience', async ({ page }, testInfo) => {
  const results = await new AxeBuilder({ page }).analyze();
  assertNoViolations(results.violations, testInfo.project.name);
});

test('renders a complete, accessible English experience', async ({ page }, testInfo) => {
  await page.goto('/en');
  await expect(page.locator('.reveal-4').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Solving complex business');
  await expect(page.getByRole('link', { name: /Switch to the French version/i })).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Download Vivien Billot English resume/i }).first(),
  ).toHaveAttribute('href', '/assets/CV-Vivien-Billot-EN.pdf');

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);

  const results = await new AxeBuilder({ page }).analyze();
  assertNoViolations(results.violations, `${testInfo.project.name} English`);

  await page.getByRole('button', { name: /professional digital twin/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
  await dialog.getByRole('button', { name: 'Career path' }).click();
  await expect(
    dialog.getByText(/leave a clearer system and a more autonomous team/i),
  ).toBeVisible();
});

test('opens the assistant, answers without OpenAI and keeps the dialog accessible', async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === 'desktop') {
    await expect(page.locator('.assistant-persona')).toBeVisible();
  }
  await page.getByRole('button', { name: /double numérique de Vivien/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
  await expect(dialog).toBeVisible();
  if (testInfo.project.name === 'desktop') {
    await expect(page.locator('.assistant-sidekick .assistant-persona-side')).toBeVisible();
  }
  await dialog.getByRole('button', { name: 'Parcours' }).click();
  await expect(
    dialog.getByText(/laisser un système plus compréhensible et une équipe plus autonome/i),
  ).toBeVisible();
  await expect(dialog.getByText(/05 mars 1988/i)).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: /Contact direct/i })).toHaveCount(0);

  const results = await new AxeBuilder({ page }).include('#portfolio-assistant-panel').analyze();
  assertNoViolations(results.violations, 'assistant');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('lets visitors hide and restore the floating assistant', async ({ page }) => {
  await page.getByRole('button', { name: /double numérique de Vivien/i }).click();
  await page.getByRole('button', { name: 'Masquer Vivien' }).click();

  await expect(page.getByRole('button', { name: 'Afficher Vivien' })).toBeVisible();
  await expect(page.locator('.assistant-dock')).toBeHidden();

  await page.getByRole('button', { name: 'Afficher Vivien' }).click();
  await expect(page.getByRole('dialog', { name: 'Vivien Billot' })).toBeVisible();
});

test('keeps the main header informative and routes contact to the page footer', async ({
  page,
}) => {
  await expect(page.locator('.brand-identity')).toContainText('Vivien Billot');
  await expect(page.locator('.brand-identity')).toContainText('05 mars 1988');
  await expect(page.locator('.brand-identity')).toContainText('Senior Software Engineer');
  await expect(page.locator('.brand-identity')).toContainText('Freelance');
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
