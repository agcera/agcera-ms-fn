import { test, expect, type Page } from '@playwright/test';
import { login } from './helpers/auth';
import { credentials } from './helpers/data';

const getComboIdByName = async (page: Page, name: string) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await page.request.get(`http://localhost:4100/api/v1/combos?limit=200`);
    const body = await response.json();
    const combos = body.data?.combos || [];
    const id = combos.find((m: { name: string }) => m.name === name)?.id;
    if (id) return id;
    await page.waitForTimeout(500);
  }
  return undefined;
};

test('combos page supports CRUD', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);

  await page.goto('/dashboard/combos');
  await expect(page.locator('.MuiTypography-header', { hasText: /Combos/i })).toBeVisible();

  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('.MuiTypography-header', { hasText: /Create Combo/i })).toBeVisible();

  const comboName = `E2E Combo ${Date.now()}`;
  await page.getByLabel('Combo Name').fill(comboName);
  await page.getByLabel('Cost Price').fill('10');
  await page.getByLabel('Selling Price').fill('20');

  await page.getByRole('button', { name: /Add item/i }).click();
  await page.locator('#items\\.0\\.productId').click();
  await page.getByRole('option').first().click();
  await page.getByLabel('Number of products').fill('1');

  await page.locator('input#image').setInputFiles({
    name: 'combo.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+nm4kAAAAASUVORK5CYII=',
      'base64'
    ),
  });

  const createResponsePromise = page.waitForResponse(
    (resp) => resp.url().includes('/api/v1/combos') && resp.request().method() === 'POST'
  );
  await page.getByRole('button', { name: /Add combo/i }).click();
  const createResponse = await createResponsePromise;
  await expect(page).toHaveURL(/\/dashboard\/combos/);

  let comboId: string | undefined;
  try {
    const createBody = await createResponse.json();
    comboId = createBody?.data?.id;
  } catch {
    // ignore response parsing
  }

  if (!comboId) {
    comboId = await getComboIdByName(page, comboName);
  }
  expect(comboId).toBeTruthy();

  await page.goto(`/dashboard/combos/${comboId}/update`);
  await expect(page.locator('.MuiTypography-header', { hasText: /Update Combo/i })).toBeVisible();
  const updatedName = `${comboName} Updated`;
  await page.getByLabel('Combo Name').fill(updatedName);
  await page.getByRole('button', { name: /Update combo/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/combos/);

  await page.goto('/dashboard/combos');
  await expect(page.getByText(updatedName)).toBeVisible({ timeout: 10000 });

  const row = page.getByRole('row', { name: new RegExp(updatedName, 'i') });
  await row.getByRole('button').first().click();
  await page.getByRole('menuitem', { name: /Delete/i }).click();
  await page.getByPlaceholder('Enter combo name to delete').fill(updatedName);
  await page.getByRole('button', { name: /Yes, delete/i }).click();
});
