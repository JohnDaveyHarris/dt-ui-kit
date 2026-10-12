import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['html', { open: 'never' }]],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  use: {
    baseURL: 'http://localhost:6008',
    trace: 'on-first-retry',
  },
  webServer: {
    // 6008, а не 6006: если dev-сервер Storybook работает на 6006,
    // reuseExistingServer подхватит его вместо статической сборки,
    // и скриншоты поймают лоадер. Свой порт - своя среда.
    command: 'npx http-server storybook-static -p 6008 --silent',
    url: 'http://localhost:6008/iframe.html',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
