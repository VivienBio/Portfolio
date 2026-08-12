import { defineConfig } from '@playwright/test';

const localBrowser = process.platform === 'win32' ? { channel: 'msedge' as const } : {};

export default defineConfig({
  testDir: './e2e',
  outputDir: '.playwright-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    ...localBrowser,
  },
  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: 'npm run serve:ssr:Portfolio',
    url: 'http://127.0.0.1:4000/healthz',
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
  },
});
