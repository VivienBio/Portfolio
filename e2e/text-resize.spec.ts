import { expect, test, type Page } from '@playwright/test';

async function enlargeText(page: Page): Promise<void> {
  // Simulate a larger root text setting; this is not proof of a physical OS font setting.
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await expect(page.locator('html')).toHaveCSS('font-size', '32px');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

test('keeps enlarged text and header controls inside narrow, tablet and desktop layouts', async ({
  page,
}) => {
  test.setTimeout(90_000);
  for (const width of [320, 390, 600, 768, 1280]) {
    await page.setViewportSize({ width, height: 1024 });
    for (const path of ['/fr', '/fr/work/tf1', '/fr/confidentialite']) {
      await page.goto(path);
      await enlargeText(page);
      const issues = await page.evaluate(() => {
        const problems: string[] = [];
        const controls = document.querySelectorAll(
          '.header-actions a, .header-actions button, .case-actions a, .case-actions button, .privacy-header a, .privacy-header button',
        );
        for (const control of controls) {
          const rect = control.getBoundingClientRect();
          if (rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1))
            problems.push(`Control outside viewport: ${control.textContent?.trim()}`);
        }
        for (const element of document.querySelectorAll(
          'main h1, main h2, main h3, main p, main li, main dd',
        )) {
          const style = getComputedStyle(element);
          if (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            !element.getBoundingClientRect().width
          )
            continue;
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          let node: Node | null;
          while ((node = walker.nextNode())) {
            if (!node.textContent?.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            if (
              Array.from(range.getClientRects()).some(
                (rect) => rect.width > 1 && (rect.left < -1 || rect.right > innerWidth + 1),
              )
            )
              problems.push(`Text outside viewport: ${node.textContent.trim().slice(0, 80)}`);
          }
        }
        return problems;
      });
      expect(issues, `${path}, ${width}px, root text 200%`).toEqual([]);
      if (path === '/fr' && width === 320) {
        // Decorative padding must not squeeze the contact label into isolated letters.
        const firstWordLines = await page.locator('.contact-main-action span').evaluate((label) => {
          const node = label.firstChild!;
          const word = node.textContent!.trim().split(/\s+/)[0];
          const start = node.textContent!.indexOf(word);
          const range = document.createRange();
          range.setStart(node, start);
          range.setEnd(node, start + word.length);
          return new Set(Array.from(range.getClientRects(), (rect) => Math.round(rect.top))).size;
        });
        expect(firstWordLines, 'The first contact action word stays readable at 200%').toBe(1);
      }
    }
  }
});

test('positions anchor headings below the resized header and clears its offset when leaving', async ({
  page,
}) => {
  await page.setViewportSize({ width: 600, height: 1024 });
  await page.goto('/fr');
  await enlargeText(page);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const header = document.querySelector('.site-header')!;
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
        return offset >= Math.ceil(header.getBoundingClientRect().height) + 15;
      }),
    )
    .toBe(true);
  await page
    .locator('.site-header nav')
    .getByRole('link', { name: 'Contact', exact: true })
    .click();
  await expect(page).toHaveURL(/\/fr#contact$/);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const header = document.querySelector('.site-header')!.getBoundingClientRect();
        const heading = document.querySelector('#contact-title')!.getBoundingClientRect();
        return heading.top >= header.bottom && heading.top < innerHeight;
      }),
    )
    .toBe(true);
  await page
    .locator('footer')
    .getByRole('link', { name: 'Protection des données', exact: true })
    .click();
  await expect(page).toHaveURL(/\/fr\/confidentialite$/);
  await expect
    .poll(async () =>
      page.evaluate(() => document.documentElement.style.getPropertyValue('--site-header-offset')),
    )
    .toBe('');
});
