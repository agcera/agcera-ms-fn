import { test, expect, type Page } from '@playwright/test';
import { login } from './helpers/auth';
import { credentials } from './helpers/data';

const getStoreIdByName = async (page: Page, name: string) => {
  const response = await page.request.get(`http://localhost:4100/api/v1/stores?search=${encodeURIComponent(name)}`);
  const body = await response.json();
  const stores = body.data?.stores || [];
  return stores.find((s: { name: string }) => s.name === name)?.id;
};

test('stores page supports CRUD and filtering', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);

  await page.goto('/dashboard/stores');
  await expect(page.locator('.MuiTypography-header', { hasText: /Stores/i })).toBeVisible();

  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('.MuiTypography-header', { hasText: /Register new store/i })).toBeVisible();

  const storeName = `E2E Store ${Date.now()}`;
  await page.getByPlaceholder('Enter store name...').fill(storeName);
  await page.getByPlaceholder('Enter store location...').fill('Maputo 15');
  await page.getByPlaceholder('Enter store phone number...').fill('+258840000555');

  await page.locator('#isActive').click();
  await page.getByRole('option', { name: 'Active', exact: true }).click();

  await page.locator('#keepers').click();
  await page.getByRole('option').first().click();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: /Register store/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/stores/);

  const searchInput = page.locator('input[placeholder="Search…"]');
  if (await searchInput.count()) {
    await searchInput.fill(storeName);
    await expect(page.getByText(storeName)).toBeVisible({ timeout: 10000 });
  }

  const storeId = await getStoreIdByName(page, storeName);
  expect(storeId).toBeTruthy();

  await page.goto(`/dashboard/stores/${storeId}`);
  await expect(page.locator('.MuiTypography-header', { hasText: /store/i })).toBeVisible();

  await page.goto(`/dashboard/stores/${storeId}/update`);
  await expect(page.locator('.MuiTypography-header', { hasText: /Update/i })).toBeVisible();
  const updatedName = `${storeName} Updated`;
  await page.getByLabel('Store name').fill(updatedName);
  await page.getByRole('button', { name: /Update store/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/stores/);

  await page.goto('/dashboard/stores');
  await expect(page.getByText(updatedName)).toBeVisible({ timeout: 10000 });

  const row = page.getByRole('row', { name: new RegExp(updatedName, 'i') });
  await row.getByRole('button').first().click();
  await page.getByRole('menuitem', { name: /Delete/i }).click();
  await page.getByPlaceholder('Enter store name to delete').fill(updatedName);
  await page.getByRole('button', { name: /Yes, delete/i }).click();
});

test('store add/move product page submits', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);

  await page.goto('/dashboard/stores/add-product');
  await expect(page.locator('.MuiTypography-header', { hasText: /Add or move products/i })).toBeVisible();

  await page.getByPlaceholder('Select the product to add or move').fill('UnoProducto');
  await page.getByRole('option').first().click();

  const sourceInput = page.getByPlaceholder(
    'Enter the store source of the products, leave empty if adding to main store...'
  );
  await sourceInput.click();
  await page.getByRole('option').first().click();

  const destinationInput = page.getByPlaceholder('Enter the store destination of the products');
  await expect(destinationInput).toBeEnabled();
  await destinationInput.fill('Store 2');
  await page.getByRole('option').first().click();

  await page.getByPlaceholder('Enter the number product to add or move').fill('1');
  await page.getByRole('button', { name: /Submit/i }).click();

  await expect(page).toHaveURL(/\/dashboard\/stores/);
});
