import { chromium, devices } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const out = process.argv[2];
const base = 'http://127.0.0.1:4300';
const browser = await chromium.launch();
const report = {};

const targets = [
  { name: 'fr-desktop-light', path: '/fr', viewport: { width: 1440, height: 900 }, scheme: 'light', full: true, chat: true },
  { name: 'fr-desktop-dark', path: '/fr', viewport: { width: 1440, height: 900 }, scheme: 'dark', full: true },
  { name: 'en-desktop-light', path: '/', viewport: { width: 1440, height: 900 }, scheme: 'light', full: true },
  { name: 'fr-laptop-light', path: '/fr', viewport: { width: 1280, height: 800 }, scheme: 'light' },
  { name: 'fr-small-laptop', path: '/fr', viewport: { width: 1100, height: 760 }, scheme: 'light' },
  { name: 'fr-tablet-light', path: '/fr', viewport: { width: 768, height: 1024 }, scheme: 'light', full: true },
  { name: 'fr-mobile-light', path: '/fr', mobile: true, scheme: 'light', full: true, menu: true, chat: true },
  { name: 'en-mobile-dark', path: '/', mobile: true, scheme: 'dark', full: true, menu: true },
  { name: 'fr-mobile-320', path: '/fr', viewport: { width: 320, height: 640 }, touch: true, scheme: 'light', menu: true },
  { name: 'fr-landscape', path: '/fr', viewport: { width: 844, height: 390 }, touch: true, scheme: 'light', menu: true },
  { name: 'case-fr-desktop', path: '/fr/work/betclic', viewport: { width: 1440, height: 900 }, scheme: 'light', full: true },
  { name: 'case-en-desktop-dark', path: '/work/tf1', viewport: { width: 1440, height: 900 }, scheme: 'dark', full: true },
  { name: 'case-fr-mobile', path: '/fr/work/betclic', mobile: true, scheme: 'light', full: true },
  { name: 'privacy-fr-desktop', path: '/fr/confidentialite', viewport: { width: 1440, height: 900 }, scheme: 'light' },
  { name: 'privacy-en-mobile-dark', path: '/privacy', mobile: true, scheme: 'dark' },
  { name: 'notfound-fr', path: '/fr/page-inconnue', viewport: { width: 1280, height: 800 }, scheme: 'dark' },
];

function intersects(a, b) {
  if (!a || !b) return false;
  const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return x * y > 4;
}

for (const t of targets) {
  const context = await browser.newContext({
    ...(t.mobile
      ? { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } }
      : { viewport: t.viewport, hasTouch: Boolean(t.touch), isMobile: Boolean(t.touch) }),
    deviceScaleFactor: 1,
    locale: t.path.startsWith('/fr') ? 'fr-FR' : 'en-US',
    colorScheme: t.scheme,
    reducedMotion: 'reduce',
  });
  await context.addInitScript((scheme) => {
    try {
      localStorage.setItem('portfolio-theme', scheme);
    } catch {}
  }, t.scheme);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.goto(base + t.path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/${t.name}-fold.jpg`, type: 'jpeg', quality: 78 });

  report[t.name] = await page.evaluate((intersectsSource) => {
    const intersects = new Function(`return (${intersectsSource})`)();
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height) return null;
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    };
    const dock = rect('.assistant-dock');
    const watched = ['.hero-copy', '.replay', '.replay-log', '.actions .primary', '.actions .secondary', '.case-hero h1', '.case-cta'];
    const overlaps = watched.filter((selector) => intersects(rect(selector), dock));
    const sections = {};
    for (const id of ['accueil', 'missions', 'work', 'approche', 'recommandations', 'projets', 'contact']) {
      const element = document.getElementById(id);
      sections[id] = element ? Math.round(element.getBoundingClientRect().height) : null;
    }
    return {
      height: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      header: Math.round(
        (document.querySelector('.site-header, .case-header, .privacy-header')?.getBoundingClientRect().height) ?? 0,
      ),
      fonts: Array.from(document.fonts).filter((font) => font.status === 'loaded').map((font) => font.family),
      h1: (() => {
        const h1 = document.querySelector('h1');
        if (!h1) return null;
        const style = getComputedStyle(h1);
        return { family: style.fontFamily, size: style.fontSize, stretch: style.fontStretch, color: style.color };
      })(),
      dock,
      overlapsWithDock: overlaps,
      sections,
      menuToggleVisible: Boolean(rect('.menu-toggle')),
      navVisible: Boolean(rect('#site-nav')),
    };
  }, intersects.toString());

  if (t.menu && report[t.name].menuToggleVisible) {
    await page.locator('.menu-toggle').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/${t.name}-menu.jpg`, type: 'jpeg', quality: 78 });
    report[t.name].menuOpen = await page.evaluate(() => ({
      expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'),
      focused: document.activeElement?.textContent?.trim(),
      links: Array.from(document.querySelectorAll('#site-nav a')).map((link) => {
        const box = link.getBoundingClientRect();
        return { text: link.textContent.trim(), height: Math.round(box.height), width: Math.round(box.width) };
      }),
    }));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    report[t.name].menuAfterEscape = await page.evaluate(() =>
      document.querySelector('.menu-toggle').getAttribute('aria-expanded'),
    );
  }
  if (t.chat) {
    await page.locator('.assistant-launcher').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/${t.name}-chat.jpg`, type: 'jpeg', quality: 78 });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }
  if (t.full) {
    await page.screenshot({ path: `${out}/${t.name}.jpg`, fullPage: true, type: 'jpeg', quality: 68 });
  }
  report[t.name].errors = errors;
  await context.close();
}
await browser.close();
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
