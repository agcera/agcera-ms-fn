import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'pnpm dev',
      cwd: '../agcera-ms-bn',
      port: 4100,
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
    },
    {
      command: 'pnpm dev',
      cwd: '.',
      port: 5173,
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        VITE_BACKEND_API: 'http://localhost:4100/api/v1',
      },
    },
  ],
});
