import { defineConfig, devices } from '@playwright/test';

const localBrowser = process.platform === 'win32' ? { channel: 'msedge' as const } : {};
const port = process.env['PLAYWRIGHT_PORT'] ?? '4300';
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  outputDir: '.playwright-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 1 : 0,
  workers: process.env['CI'] ? 2 : 4,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL,
    colorScheme: 'light',
    contextOptions: { reducedMotion: 'reduce' },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...localBrowser, viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        ...localBrowser,
        viewport: { width: 390, height: 844 },
        locale: 'fr-FR',
      },
    },
    {
      name: 'firefox-responsive',
      use: {
        browserName: 'firefox',
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        locale: 'fr-FR',
      },
    },
  ],
  webServer: {
    command: 'npm run serve:ssr:Portfolio',
    url: `${baseURL}/healthz`,
    env: { PORT: port, OPENAI_API_KEY: '', CONTACT_FORM_ENDPOINT: '' },
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
