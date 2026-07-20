import { defineConfig } from '@playwright/test'

/**
 * Playwright config for the OTTPlayer E2E integration test.
 *
 * Run locally:
 *   OTTPLAYER_EMAIL=... OTTPLAYER_PASSWORD=... npm run test:ottplayer
 *
 * All output (HTML report, screenshots, videos, traces) goes to
 * tests/e2e/ottplayer/output/ which is gitignored.
 */
export default defineConfig({
  testDir: __dirname,
  testMatch: '**/*.spec.ts',
  outputDir: './output/artifacts',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  // Stream playback tests must run sequentially: parallel video elements
  // starve each other's bandwidth and produce false negatives.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: './output/report', open: 'never' }],
    ['json', { outputFile: './output/results.json' }]
  ],
  use: {
    baseURL: process.env.OTTPLAYER_BASE_URL || 'https://ottplayer.es',
    // Capture evidence only when something goes wrong.
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    // IPTV pages are slow; be generous.
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    viewport: { width: 1440, height: 900 },
    // Autoplay policies block programmatic playback in headless Chrome
    // unless muted autoplay is explicitly allowed.
    launchOptions: {
      args: [
        '--autoplay-policy=no-user-gesture-required',
        '--mute-audio',
        '--disable-features=PreloadMediaEngagementData,MediaEngagementBypassAutoplayPolicies'
      ]
    }
  }
})
