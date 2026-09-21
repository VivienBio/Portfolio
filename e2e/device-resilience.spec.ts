import { expect, test, type Locator, type Page } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`${locale}: an open conversation survives rotation and phone, tablet and desktop resizing`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const receivedLocales: string[] = [];
    await page.route('**/api/assistant', (route) => {
      receivedLocales.push(route.request().postDataJSON().locale);
      return route.fulfill({
        json: { answer: locale === 'fr' ? 'Une réponse conservée.' : 'A preserved answer.' },
      });
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(locale === 'fr' ? '/fr' : '/');
    await page.locator('.theme-button').click();
    await page.locator('.assistant-launcher').click();
    const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
    const question = dialog.locator('#assistant-question');
    const draft = locale === 'fr' ? 'Son expérience technique ?' : 'His technical experience?';
    await question.fill(draft);

    for (const [width, height] of [
      [844, 390],
      [768, 1024],
      [1024, 768],
      [1440, 900],
      [320, 740],
      [390, 844],
    ]) {
      await page.setViewportSize({ width, height });
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(question).toHaveValue(draft);
      for (const target of [
        dialog,
        question,
        dialog.locator('.assistant-close'),
        dialog.locator('button[type="submit"]'),
      ]) {
        await expectInsideViewport(target, page);
      }
      await expectReachable(dialog.locator('button[type="submit"]'));
      await expectReachable(dialog.locator('.assistant-close'));
    }

    await dialog.locator('button[type="submit"]').click();
    await expect(dialog.locator('.message').last()).toHaveText(
      /Une réponse conservée|A preserved answer/,
    );
    await page.setViewportSize({ width: 820, height: 1180 });
    await expect(dialog.locator('.message').last()).toHaveText(
      /Une réponse conservée|A preserved answer/,
    );
    await dialog.locator('.assistant-close').click();
    await expect(page.locator('.assistant-launcher')).toBeFocused();
    await page.locator('.assistant-launcher').click();
    await expect(dialog.locator('.message').last()).toHaveText(
      /Une réponse conservée|A preserved answer/,
    );
    expect(receivedLocales).toEqual([locale]);
    expect(errors).toEqual([]);
  });

  test(`${locale}: header actions remain reachable across tablet and desktop thresholds`, async ({
    page,
  }) => {
    await page.goto(locale === 'fr' ? '/fr' : '/');
    for (const width of [600, 760, 761, 768, 820, 1024, 1100, 1101, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const selector of ['.language-switch', '.cv-download', '.theme-button']) {
        const action = page.locator(selector);
        await expectInsideViewport(action, page);
        await expectReachable(action);
      }
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width + 1,
      );
    }
  });
}

test('200% text keeps the assistant launcher and composer within a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/fr');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await expect(page.locator('html')).toHaveCSS('font-size', '32px');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await expectInsideViewport(page.locator('.assistant-launcher'), page);
  await expectInsideViewport(page.locator('.assistant-hide'), page);
  await page.locator('.assistant-launcher').click();
  const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
  for (const suggestion of await dialog.locator('.quick-questions button').all()) {
    expect(
      await suggestion.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    ).toBe(true);
  }
  for (const target of [
    dialog,
    dialog.locator('.assistant-close'),
    dialog.locator('#assistant-question'),
    dialog.locator('button[type="submit"]'),
  ]) {
    await expectInsideViewport(target, page);
  }
  await dialog.locator('#assistant-question').fill('Son expérience ?');
  await expectReachable(dialog.locator('button[type="submit"]'));
  await dialog.locator('.assistant-close').click();
  await expect(page.locator('.assistant-launcher')).toBeFocused();
});

async function expectInsideViewport(locator: Locator, page: Page): Promise<void> {
  await expect
    .poll(
      async () => {
        const rect = await locator.boundingBox();
        const viewport = page.viewportSize();
        return Boolean(
          rect &&
          viewport &&
          rect.x >= -1 &&
          rect.y >= -1 &&
          rect.x + rect.width <= viewport.width + 1 &&
          rect.y + rect.height <= viewport.height + 1,
        );
      },
      { message: `${locator} must fit after the viewport changes` },
    )
    .toBe(true);
}

async function expectReachable(locator: Locator): Promise<void> {
  await expect
    .poll(
      () =>
        locator.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
          return hit !== null && element.contains(hit);
        }),
      { message: `${locator} must not be covered or clipped` },
    )
    .toBe(true);
}
