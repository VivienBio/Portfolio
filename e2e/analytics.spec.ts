import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';

const MEASUREMENT_ID = 'G-TEST123456';
const CONSENT_KEY = 'portfolio-analytics-consent';
const GOOGLE_HOST =
  /(?:^|\.)(?:googletagmanager\.com|google-analytics\.com|analytics\.google\.com)$/;

type AnalyticsCommand = readonly unknown[];
type AnalyticsEvent = { readonly name: string; readonly parameters: Record<string, unknown> };

for (const locale of ['fr', 'en'] as const) {
  const path = locale === 'fr' ? '/fr' : '/';

  test(`${locale}: analytics refusal sends nothing to Google and survives reload`, async ({
    page,
  }, testInfo) => {
    const googleRequests = await interceptAnalytics(page);
    await page.goto(path);
    const consent = page.locator('.analytics-consent');
    await expect(consent).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(consent.locator('.consent-accept')).toHaveText(
      locale === 'fr' ? 'Accepter' : 'Accept',
    );
    await expect(consent.locator('.consent-reject')).toHaveText(
      locale === 'fr' ? 'Refuser' : 'Reject',
    );
    expect(googleRequests).toEqual([]);
    expect(await readCommands(page)).toEqual([]);

    await activate(consent.locator('.consent-reject'), testInfo);
    await expect(consent).toBeHidden();
    await expect.poll(() => readConsent(page)).toMatchObject({ version: 1, value: 'denied' });
    await activate(page.locator('.theme-button'), testInfo);
    await activate(page.locator('.actions .primary'), testInfo);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(consent).toBeHidden();
    expect(googleRequests).toEqual([]);
    expect(await readCommands(page)).toEqual([]);

    await activate(page.locator('.privacy-settings'), testInfo);
    await expect(consent).toBeVisible();
    await expect(consent.locator('.consent-close')).toBeVisible();
    await activate(consent.locator('.consent-close'), testInfo);
    await expect(consent).toBeHidden();
    expect(googleRequests).toEqual([]);
  });

  test(`${locale}: opt-in measures each route once, downloads and chat without private text`, async ({
    page,
  }, testInfo) => {
    const googleRequests = await interceptAnalytics(page);
    await page.route('**/api/assistant', (route) =>
      route.fulfill({ json: { answer: 'RESPONSE_PRIVATE_427: voici une réponse de test.' } }),
    );
    await page.goto(`${path}?email=QUERY_PRIVATE_427#FRAGMENT_PRIVATE_427`, {
      referer: 'https://example.invalid/REFERRER_PRIVATE_427?email=secret',
    });
    const consent = page.locator('.analytics-consent');
    await activate(consent.locator('.consent-accept'), testInfo);
    await expect(consent).toBeHidden();
    await expect.poll(() => readConsent(page)).toMatchObject({ version: 1, value: 'granted' });
    await expect.poll(() => eventsNamed(page, 'page_view')).toHaveLength(1);
    expect(googleRequests).toHaveLength(1);
    expect(googleRequests[0]).toContain(`/gtag/js?id=${MEASUREMENT_ID}`);

    const commands = await readCommands(page);
    expect(commands).toContainEqual([
      'config',
      MEASUREMENT_ID,
      expect.objectContaining({ send_page_view: false }),
    ]);
    const consentCommands = commands.filter(([command]) => command === 'consent');
    expect(consentCommands.length).toBeGreaterThan(0);
    for (const command of consentCommands) {
      expect(command[2]).toMatchObject({
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }

    await activate(page.locator('.theme-button'), testInfo);
    await activate(page.locator('.actions .primary'), testInfo);
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    expect(await eventsNamed(page, 'page_view')).toHaveLength(1);

    const pdf = `CV-Vivien-Billot-${locale.toUpperCase()}.pdf`;
    const downloadPromise = page.waitForEvent('download');
    await activate(page.locator('.cv-download'), testInfo);
    expect((await downloadPromise).suggestedFilename()).toBe(pdf);
    await expect.poll(() => eventsNamed(page, 'file_download')).toHaveLength(1);
    expect((await eventsNamed(page, 'file_download'))[0]?.parameters).toMatchObject({
      file_name: pdf,
      file_extension: 'pdf',
      cv_language: locale,
    });

    await activate(page.locator('.assistant-launcher'), testInfo);
    const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
    await dialog
      .locator('#assistant-question')
      .fill('MESSAGE_PRIVATE_427 mon email secret@example.invalid');
    await activate(dialog.locator('button[type="submit"]'), testInfo);
    await expect(
      dialog.getByText('RESPONSE_PRIVATE_427: voici une réponse de test.'),
    ).toBeVisible();
    await expect.poll(() => eventsNamed(page, 'assistant_send')).toHaveLength(1);
    await expect.poll(() => eventsNamed(page, 'assistant_success')).toHaveLength(1);
    await activate(dialog.locator('.assistant-close'), testInfo);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);

    const workPath = locale === 'fr' ? '/fr/work/betclic' : '/work/betclic';
    await activate(page.locator(`.work-card[href="${workPath}"]`), testInfo);
    await expect(page).toHaveURL(new RegExp(`${workPath}$`));
    await expect.poll(() => eventsNamed(page, 'page_view')).toHaveLength(2);
    await expect.poll(() => eventsNamed(page, 'project_view')).toHaveLength(1);
    expect((await eventsNamed(page, 'project_view'))[0]?.parameters).toMatchObject({
      target: 'betclic',
    });
    const casePageView = (await eventsNamed(page, 'page_view'))[1]!;
    expect(new URL(String(casePageView.parameters['page_referrer'])).pathname).toBe(path);
    expect(
      (await eventsNamed(page, 'page_view')).map(
        ({ parameters }) => new URL(String(parameters['page_location'])).pathname,
      ),
    ).toEqual([path, workPath]);

    await activate(page.locator('.case-language'), testInfo);
    await expect(page.locator('html')).toHaveAttribute('lang', locale === 'fr' ? 'en' : 'fr');
    await expect.poll(() => eventsNamed(page, 'page_view')).toHaveLength(3);
    const translatedPageView = (await eventsNamed(page, 'page_view'))[2]!;
    expect(new URL(String(translatedPageView.parameters['page_referrer'])).pathname).toBe(workPath);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(googleRequests).toHaveLength(1);
    const payload = JSON.stringify(await readCommands(page));
    for (const privateValue of [
      'QUERY_PRIVATE_427',
      'FRAGMENT_PRIVATE_427',
      'REFERRER_PRIVATE_427',
      'MESSAGE_PRIVATE_427',
      'RESPONSE_PRIVATE_427',
      'secret@example.invalid',
    ]) {
      expect(payload).not.toContain(privateValue);
    }
    for (const { parameters } of await eventsNamed(page, 'page_view')) {
      const location = new URL(String(parameters['page_location']));
      expect(location.search).toBe('');
      expect(location.hash).toBe('');
    }
  });

  test(`${locale}: withdrawing consent clears GA cookies, unloads the tag and keeps locale`, async ({
    page,
    context,
  }, testInfo) => {
    const googleRequests = await interceptAnalytics(page);
    await page.goto(path);
    await activate(page.locator('.consent-accept'), testInfo);
    await expect.poll(() => eventsNamed(page, 'page_view')).toHaveLength(1);
    await context.addCookies([
      { name: '_ga', value: 'GA1.1.123.456', url: page.url() },
      { name: '_ga_TEST123456', value: 'GS1.1.123', url: page.url() },
    ]);
    await activate(page.locator('.privacy-settings'), testInfo);
    const navigation = page.waitForEvent('domcontentloaded');
    await activate(page.locator('.consent-reject'), testInfo);
    await navigation;
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect.poll(() => readConsent(page)).toMatchObject({ version: 1, value: 'denied' });
    await expect(page.locator('#portfolio-google-analytics')).toHaveCount(0);
    expect(
      (await context.cookies()).filter(({ name }) => name === '_ga' || name.startsWith('_ga_')),
    ).toEqual([]);
    expect(await readCommands(page)).toEqual([]);
    expect(googleRequests).toHaveLength(1);
    await activate(page.locator('.theme-button'), testInfo);
    await activate(page.locator('.actions .primary'), testInfo);
    expect(await readCommands(page)).toEqual([]);
    expect(googleRequests).toHaveLength(1);
  });
}

test('missing analytics configuration leaves the site usable without a consent prompt or Google requests', async ({
  page,
}) => {
  const googleRequests = await interceptAnalytics(page, null);
  await page.goto('/fr');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.analytics-consent')).toHaveCount(0);
  await page.locator('.theme-button').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  expect(googleRequests).toEqual([]);
  expect(await readCommands(page)).toEqual([]);
});

test.describe('Android consent layout', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Android touch layout only');
  });

  for (const viewport of [
    { width: 320, height: 568, locale: 'fr' },
    { width: 390, height: 844, locale: 'en' },
    { width: 844, height: 390, locale: 'fr' },
  ] as const) {
    test(`${viewport.width}x${viewport.height}: consent offers accessible choices beside the assistant`, async ({
      page,
    }) => {
      await interceptAnalytics(page);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(viewport.locale === 'fr' ? '/fr' : '/');
      const consent = page.locator('.analytics-consent');
      await expect(consent).toBeVisible();
      for (const selector of ['.consent-accept', '.consent-reject']) {
        const button = consent.locator(selector);
        const box = await button.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThanOrEqual(48);
        expect(box!.height).toBeGreaterThanOrEqual(48);
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
        expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 1);
      }
      const acceptBox = await consent.locator('.consent-accept').boundingBox();
      const rejectBox = await consent.locator('.consent-reject').boundingBox();
      expect(Math.abs(acceptBox!.width - rejectBox!.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(acceptBox!.height - rejectBox!.height)).toBeLessThanOrEqual(1);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
      const screenshot = test.info().outputPath(`analytics-consent-${viewport.width}.png`);
      await page.screenshot({ path: screenshot });
      await test.info().attach('analytics-consent', { path: screenshot, contentType: 'image/png' });
      await page.locator('.assistant-launcher').tap();
      const dialog = page.getByRole('dialog', { name: 'Vivien Billot' });
      await expect(dialog).toBeVisible();
      await dialog.locator('.assistant-close').tap();
      await expect(consent).toBeVisible();
      await consent.locator('.consent-reject').tap();
      await expect(consent).toBeHidden();
      await page.locator('.assistant-launcher').tap();
      await expect(page.getByRole('dialog', { name: 'Vivien Billot' })).toBeVisible();
    });
  }
});

async function interceptAnalytics(
  page: Page,
  measurementId: string | null = MEASUREMENT_ID,
): Promise<string[]> {
  const requests: string[] = [];
  await page.route('**/api/analytics/config', (route) =>
    route.fulfill({ json: { measurementId, allowedHostname: '127.0.0.1' } }),
  );
  await page.route(
    (url) => GOOGLE_HOST.test(url.hostname),
    async (route) => {
      requests.push(route.request().url());
      if (new URL(route.request().url()).pathname === '/gtag/js') {
        // Leave the application's real gtag queue intact; never load Google's remote implementation.
        await route.fulfill({
          contentType: 'application/javascript',
          body: 'window.__portfolioAnalyticsStub = true;',
        });
      } else {
        await route.fulfill({ status: 204 });
      }
    },
  );
  return requests;
}

async function readCommands(page: Page): Promise<readonly AnalyticsCommand[]> {
  return page.evaluate(() => {
    const analyticsWindow = window as unknown as { dataLayer?: readonly ArrayLike<unknown>[] };
    return (analyticsWindow.dataLayer ?? []).map((command) => Array.from(command));
  });
}

async function eventsNamed(page: Page, name: string): Promise<readonly AnalyticsEvent[]> {
  return (await readCommands(page))
    .filter(([command, event]) => command === 'event' && event === name)
    .map(([, event, parameters]) => ({
      name: String(event),
      parameters: parameters as Record<string, unknown>,
    }));
}

async function readConsent(page: Page): Promise<unknown> {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) ?? 'null') as unknown,
    CONSENT_KEY,
  );
}

async function activate(locator: Locator, testInfo: TestInfo): Promise<void> {
  if (testInfo.project.use.hasTouch) {
    await locator.tap();
  } else {
    await locator.click();
  }
}
