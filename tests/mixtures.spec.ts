import { test, expect, type Page } from '@playwright/test';
import { login } from './helpers/auth';
import { credentials } from './helpers/data';

const getMixtureIdByName = async (page: Page, name: string) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await page.request.get(`http://localhost:4100/api/v1/mixtures?limit=200`);
    const body = await response.json();
    const mixtures = body.data?.mixtures || [];
    const id = mixtures.find((m: { name: string }) => m.name === name)?.id;
    if (id) return id;
    await page.waitForTimeout(500);
  }
  return undefined;
};

test('mixtures page supports CRUD', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);

  await page.goto('/dashboard/mixtures');
  await expect(page.locator('.MuiTypography-header', { hasText: /Mixtures/i })).toBeVisible();

  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('.MuiTypography-header', { hasText: /Create Mixture/i })).toBeVisible();

  const mixtureName = `E2E Mixture ${Date.now()}`;
  await page.getByLabel('Mixture Name').fill(mixtureName);
  await page.getByLabel('Cost Price').fill('10');
  await page.getByLabel('Selling Price').fill('20');

  await page.getByRole('button', { name: /Add item/i }).click();
  await page.locator('#items\\.0\\.productId').click();
  await page.getByRole('option').first().click();
  await page.getByLabel('Number of products').fill('1');

  await page.locator('input#image').setInputFiles({
    name: 'mixture.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+nm4kAAAAASUVORK5CYII=',
      'base64'
    ),
  });

  const createResponsePromise = page.waitForResponse(
    (resp) => resp.url().includes('/api/v1/mixtures') && resp.request().method() === 'POST'
  );
  await page.getByRole('button', { name: /Add mixture/i }).click();
  const createResponse = await createResponsePromise;
  await expect(page).toHaveURL(/\/dashboard\/mixtures/);

  let mixtureId: string | undefined;
  try {
    const createBody = await createResponse.json();
    mixtureId = createBody?.data?.id;
  } catch {
    // ignore response parsing
  }

  if (!mixtureId) {
    mixtureId = await getMixtureIdByName(page, mixtureName);
  }
  expect(mixtureId).toBeTruthy();

  await page.goto(`/dashboard/mixtures/${mixtureId}/update`);
  await expect(page.locator('.MuiTypography-header', { hasText: /Update Mixture/i })).toBeVisible();
  const updatedName = `${mixtureName} Updated`;
  await page.getByLabel('Mixture Name').fill(updatedName);
  await page.getByRole('button', { name: /Update mixture/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/mixtures/);

  await page.goto('/dashboard/mixtures');
  await expect(page.getByText(updatedName)).toBeVisible({ timeout: 10000 });

  const row = page.getByRole('row', { name: new RegExp(updatedName, 'i') });
  await row.getByRole('button').first().click();
  await page.getByRole('menuitem', { name: /Delete/i }).click();
  await page.getByPlaceholder('Enter mixture name to delete').fill(updatedName);
  await page.getByRole('button', { name: /Yes, delete/i }).click();
});
