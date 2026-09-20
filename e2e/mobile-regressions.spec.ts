import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';

type Locale = 'en' | 'fr';

const locales = {
  fr: {
    path: '/fr',
    heading: 'Des systèmes où l’erreur',
    question: 'Parcours',
    answer: /laisser un système plus compréhensible et une équipe plus autonome/i,
    initial: /Je réponds sur le parcours de Vivien/i,
    pdf: 'CV-Vivien-Billot-FR.pdf',
  },
  en: {
    path: '/',
    heading: 'Systems where wrong answers',
    question: 'Career path',
    answer: /leave a clearer system and a more autonomous team/i,
    initial: /I answer about Vivien’s background/i,
    pdf: 'CV-Vivien-Billot-EN.pdf',
  },
} as const;

for (const locale of ['fr', 'en'] as const) {
  const copy = locales[locale];

  test(`${locale}: anchors, theme, reload and a real assistant reply preserve the language`, async ({
    page,
  }, testInfo) => {
    const browserErrors = collectBrowserErrors(page);
    await page.goto('/');
    if (locale === 'fr') {
      await activate(page.locator('.language-switch'), testInfo);
    }
    await expectLocale(page, locale);

    // Exercise the real links: relative href="#..." used to resolve against <base href="/">.
    await activate(page.locator('.actions .primary'), testInfo);
    await expect(page).toHaveURL(new RegExp(`${copy.path}#work$`));
    await expectLocale(page, locale);
    await activate(page.locator('.brand'), testInfo);
    await expect(page).toHaveURL(new RegExp(`${copy.path === '/' ? '/' : '/fr'}#accueil$`));
    await activate(page.locator('.site-header nav a[href$="#expertise"]'), testInfo);
    await expect(page).toHaveURL(new RegExp(`${copy.path === '/' ? '/' : '/fr'}#expertise$`));
    await expectLocale(page, locale);

    await activate(page.locator('.theme-button'), testInfo);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectLocale(page, locale);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectLocale(page, locale);

    await activate(page.locator('.assistant-launcher'), testInfo);
    const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
    await expect(dialog.getByText(copy.initial)).toBeVisible();
    const requestPromise = page.waitForRequest(
      (request) => request.url().endsWith('/api/assistant') && request.method() === 'POST',
    );
    const responsePromise = page.waitForResponse((response) =>
      response.url().endsWith('/api/assistant'),
    );
    await activate(dialog.getByRole('button', { name: copy.question, exact: true }), testInfo);
    const request = await requestPromise;
    expect(request.postDataJSON()).toMatchObject({
      locale,
      messages: expect.arrayContaining([{ role: 'user', content: copy.question }]),
    });
    expect((await responsePromise).status()).toBe(200);
    await expect(dialog.getByText(copy.answer)).toBeVisible();
    await expectLocale(page, locale);
    await activate(dialog.locator('.assistant-close'), testInfo);
    await expect(page.locator('.assistant-launcher')).toBeFocused();

    await activate(page.locator('.theme-button'), testInfo);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await activate(page.locator('.assistant-launcher'), testInfo);
    await expect(dialog.getByText(copy.answer)).toBeVisible();
    await activate(dialog.locator('.assistant-close'), testInfo);
    await activate(page.locator('footer a[href$="#accueil"]'), testInfo);
    await expectLocale(page, locale);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expectLocale(page, locale);
    expect(browserErrors).toEqual([]);
  });

  test(`${locale}: dark landing and assistant pass accessibility and keyboard focus checks`, async ({
    page,
  }) => {
    await page.goto(copy.path);
    await page.locator('.theme-button').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await assertAccessible(page, `${locale} dark landing`);
    await page.locator('.assistant-launcher').click();
    const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
    const question = dialog.locator('#assistant-question');
    await expect(dialog).toBeFocused();
    await assertAccessible(page, `${locale} dark assistant`);

    // Empty send is disabled; tab must wrap inside the modal, then restore focus on Escape.
    await expect(dialog.locator('button[type="submit"]')).toBeDisabled();
    await question.focus();
    await page.keyboard.press('Tab');
    await expect(dialog.locator('.assistant-close')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(question).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.locator('.assistant-launcher')).toBeFocused();
  });

  test(`${locale}: the CV downloads as a nonempty PDF without changing the page`, async ({
    page,
    request,
  }, testInfo) => {
    await page.goto(copy.path);
    const downloadPromise = page.waitForEvent('download');
    await activate(page.locator('.cv-download'), testInfo);
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(copy.pdf);
    expect(await download.failure()).toBeNull();
    const response = await request.get(`/assets/${copy.pdf}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    const content = await response.body();
    expect(content.subarray(0, 5).toString()).toBe('%PDF-');
    expect(content.byteLength).toBeGreaterThan(5_000);
    await expectLocale(page, locale);
  });
}

test('French case studies retain locale, content and theme through next, back and reload', async ({
  page,
}, testInfo) => {
  const browserErrors = collectBrowserErrors(page);
  await page.goto('/fr');
  await activate(page.locator('.theme-button'), testInfo);
  await activate(page.locator('.work-card[href="/fr/work/betclic"]'), testInfo);
  await expect(page).toHaveURL(/\/fr\/work\/betclic$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/temps réel/i);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await assertAccessible(page, 'French dark case study');
  await activate(page.locator('.case-cta-next'), testInfo);
  await expect(page).toHaveURL(/\/fr\/work\/tf1$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /Moderniser le SI publicitaire/i,
  );
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await activate(page.locator('.case-back'), testInfo);
  await expectLocale(page, 'fr');
  await page.goBack();
  await expect(page).toHaveURL(/\/fr\/work\/tf1$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  expect(browserErrors).toEqual([]);
});

test('language switches work in both directions after theme changes', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await activate(page.locator('.theme-button'), testInfo);
  await activate(page.locator('.language-switch'), testInfo);
  await expectLocale(page, 'fr');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await activate(page.locator('.language-switch'), testInfo);
  await expectLocale(page, 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('a missing French page returns 404 and offers a French return to the portfolio', async ({
  page,
}, testInfo) => {
  const response = await page.goto('/fr/page-inconnue');
  expect(response?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Cette page n.existe pas/i);
  await assertAccessible(page, 'French not found');
  await activate(page.locator('main a[href="/fr"]').first(), testInfo);
  await expectLocale(page, 'fr');
});

test('French assistant recovers from an unavailable response and keeps the conversation in French', async ({
  page,
}, testInfo) => {
  let attempts = 0;
  const receivedLocales: unknown[] = [];
  const receivedMessages: unknown[] = [];
  await page.route('**/api/assistant', async (route) => {
    const payload = route.request().postDataJSON() as { locale: unknown; messages: unknown };
    receivedLocales.push(payload.locale);
    receivedMessages.push(payload.messages);
    attempts += 1;
    await route.fulfill({
      status: attempts === 1 ? 503 : 200,
      json: attempts === 1 ? {} : { answer: 'Vivien travaille sur des systèmes distribués.' },
    });
  });
  await page.goto('/fr');
  await activate(page.locator('.assistant-launcher'), testInfo);
  const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
  const question = dialog.locator('#assistant-question');
  await question.fill('Son expérience ?');
  await activate(dialog.locator('button[type="submit"]'), testInfo);
  await expect(dialog.getByRole('alert')).toHaveText(/Je ne peux pas répondre pour le moment/i);
  await activate(dialog.getByRole('button', { name: 'Réessayer', exact: true }), testInfo);
  await expect(dialog.getByText('Vivien travaille sur des systèmes distribués.')).toBeVisible();
  await expect(dialog.getByRole('alert')).toHaveCount(0);
  expect(receivedLocales).toEqual(['fr', 'fr']);
  expect(receivedMessages[1]).toEqual(receivedMessages[0]);
  await expect(dialog.locator('.message-user')).toHaveCount(1);
  await expectLocale(page, 'fr');
});

test('desktop header actions remain visible and clickable around navigation breakpoints', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop navigation breakpoints only');
  for (const width of [1101, 1200, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ['fr', 'en'] as const) {
      await page.goto(locales[locale].path);
      await expectLocale(page, locale);
      await expectNoHorizontalOverflow(page);
      for (const selector of ['.language-switch', '.cv-download', '.theme-button']) {
        const action = page.locator(selector);
        await expectInsideViewport(action, page);
        expect(
          await action.evaluate((element) => {
            const box = element.getBoundingClientRect();
            const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
            return hit !== null && element.contains(hit);
          }),
          `${locale} ${width}px ${selector} must not be clipped or covered`,
        ).toBe(true);
      }
      await page.locator('.theme-button').click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await page.locator('.theme-button').click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    }
  }
});

const mobileScenarios = [
  { width: 320, height: 740, locale: 'fr', theme: 'light' },
  { width: 360, height: 800, locale: 'en', theme: 'dark' },
  { width: 390, height: 844, locale: 'fr', theme: 'dark' },
  { width: 430, height: 932, locale: 'en', theme: 'light' },
  { width: 844, height: 390, locale: 'fr', theme: 'dark' },
] as const;

test.describe('Android responsive acceptance', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Android touch emulation only');
  });

  for (const scenario of mobileScenarios) {
    test(`${scenario.width}x${scenario.height} ${scenario.locale} ${scenario.theme}: readable navigation and usable chat`, async ({
      page,
    }, testInfo) => {
      const browserErrors = collectBrowserErrors(page);
      await page.setViewportSize({ width: scenario.width, height: scenario.height });
      await page.route('**/api/assistant', (route) =>
        route.fulfill({
          json: {
            answer:
              scenario.locale === 'fr'
                ? 'Vivien conçoit des systèmes fiables avec C# et .NET.'
                : 'Vivien builds reliable systems with C# and .NET.',
          },
        }),
      );
      await page.goto(locales[scenario.locale].path);
      if (scenario.theme === 'dark') {
        await page.locator('.theme-button').tap();
      }
      await expectLocale(page, scenario.locale);
      await expectNoHorizontalOverflow(page);
      for (const target of await page
        .locator('.header-actions > a, .header-actions > button, .site-header nav a')
        .all()) {
        await expectTouchTarget(target);
      }

      // Playwright scrolls the horizontal mobile navigation into view before its real tap.
      await page.locator('.site-header nav a[href$="#contact"]').tap();
      await expect(page).toHaveURL(/#contact$/);
      await expectLocale(page, scenario.locale);
      await page.locator('.brand').tap();
      await expectNoHorizontalOverflow(page);
      const homeScreenshot = testInfo.outputPath('mobile-home.png');
      await page.screenshot({ path: homeScreenshot });
      await testInfo.attach('mobile-home', { path: homeScreenshot, contentType: 'image/png' });

      await page.locator('.assistant-launcher').tap();
      const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
      const question = dialog.locator('#assistant-question');
      await expect(dialog).toBeFocused();
      await expectInsideViewport(dialog, page);
      await expectTouchTarget(dialog.locator('.assistant-close'));
      await question.fill(
        scenario.locale === 'fr' ? 'Sa stack technique ?' : 'His technical stack?',
      );
      await expectTouchTarget(dialog.locator('button[type="submit"]'));
      await dialog.locator('button[type="submit"]').tap();
      await expect(dialog.locator('.message').last()).toContainText(/C# (et|and) .NET/);
      await expectInsideViewport(question, page);
      await expectInsideViewport(dialog.locator('button[type="submit"]'), page);
      await expectNoHorizontalOverflow(page);
      const chatScreenshot = testInfo.outputPath('mobile-chat.png');
      await page.screenshot({ path: chatScreenshot });
      await testInfo.attach('mobile-chat', { path: chatScreenshot, contentType: 'image/png' });
      await dialog.locator('.assistant-close').tap();
      await expect(dialog).toBeHidden();
      await expectLocale(page, scenario.locale);
      expect(browserErrors).toEqual([]);
    });
  }
});

async function activate(locator: Locator, testInfo: TestInfo): Promise<void> {
  if (testInfo.project.use.hasTouch) {
    await locator.tap();
  } else {
    await locator.click();
  }
}

async function expectLocale(page: Page, locale: Locale): Promise<void> {
  await expect(page.locator('html')).toHaveAttribute('lang', locale);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(locales[locale].heading);
  expect(new URL(page.url()).pathname).toBe(locales[locale].path);
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width + 1);
}

async function expectTouchTarget(locator: Locator): Promise<void> {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  const label = (await locator.getAttribute('aria-label')) ?? (await locator.innerText());
  expect(box!.width, `${label} width`).toBeGreaterThanOrEqual(48);
  expect(box!.height, `${label} height`).toBeGreaterThanOrEqual(48);
}

async function expectInsideViewport(locator: Locator, page: Page): Promise<void> {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(-1);
  expect(box!.y).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height + 1);
}

function collectBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  return errors;
}

async function assertAccessible(page: Page, context: string): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        failure: node.failureSummary,
      })),
    })),
    context,
  ).toEqual([]);
}
