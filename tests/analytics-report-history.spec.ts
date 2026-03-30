import { test, expect, type Page } from '@playwright/test';
import { login } from './helpers/auth';
import { credentials } from './helpers/data';

const readPdfFromEmbed = async (page: Page) => {
  const embed = page.locator('embed[type="application/pdf"]');
  await expect(embed).toBeVisible({ timeout: 30000 });
  const src = await embed.getAttribute('src');
  if (!src) {
    throw new Error('Report PDF embed is missing a source URL');
  }

  return page.evaluate(async (embedSrc) => {
    const response = await fetch(embedSrc);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const header = String.fromCharCode(...bytes.slice(0, 4));
    return { header, size: bytes.length };
  }, src);
};

test('analytics page loads and toggles date range', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);

  await page.goto('/dashboard/analytics');
  await expect(page.locator('.MuiTypography-header', { hasText: /Analytics/i })).toBeVisible();

  await page.getByRole('button', { name: /Monthly/i }).click();
  await page.getByRole('button', { name: /Weekly/i }).click();
});

test('report page generates a report', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);

  await page.goto('/dashboard/report');
  await expect(page.locator('.MuiTypography-header', { hasText: /Generate Report/i })).toBeVisible();

  await page.getByRole('button', { name: /Generate Report/i }).click();
  const { header, size } = await readPdfFromEmbed(page);
  expect(header).toBe('%PDF');
  expect(size).toBeGreaterThan(1000);
});

test('report page enforces keeper constraints', async ({ page }) => {
  await login(page, credentials.keeper.phone, credentials.keeper.password);

  await page.goto('/dashboard/report');
  await expect(page.locator('.MuiTypography-header', { hasText: /Generate Report/i })).toBeVisible();

  await expect(page.getByLabel('Store')).toHaveCount(0);
  await expect(page.getByLabel('Include collected sales and transactions')).toHaveCount(0);

  await page.getByRole('button', { name: /Generate Report/i }).click();
  const { header, size } = await readPdfFromEmbed(page);
  expect(header).toBe('%PDF');
  expect(size).toBeGreaterThan(1000);
});

test('history and trash pages load', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);

  await page.goto('/dashboard/history');
  await expect(page.locator('.MuiTypography-header', { hasText: /Moved Products/i })).toBeVisible();

  await page.goto('/dashboard/trash');
  await expect(page.locator('.MuiTypography-header', { hasText: /Trash/i })).toBeVisible();
});
