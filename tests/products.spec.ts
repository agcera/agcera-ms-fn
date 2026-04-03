import { test, expect, type Page } from '@playwright/test';
import { login } from './helpers/auth';
import { credentials } from './helpers/data';

const getProductIdByName = async (page: Page, name: string) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await page.request.get(`http://localhost:4100/api/v1/products?search=${encodeURIComponent(name)}`);
    const body = await response.json();
    const products = body.data?.products || [];
    const match = products.find((p: { name: string }) => p.name === name)?.id;
    if (match) return match;
    await page.waitForTimeout(500);
  }
  return undefined;
};

test('products page supports CRUD and filtering', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);

  await page.goto('/dashboard/products');
  await expect(page.locator('.MuiTypography-header', { hasText: /Products/i })).toBeVisible();

  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('.MuiTypography-header', { hasText: /Create Product/i })).toBeVisible();

  const productName = `E2E Product ${Date.now()}`;
  await page.getByLabel('Product Name').fill(productName);
  await page.getByLabel('Cost Price').fill('10');
  await page.getByLabel('Selling Price').fill('20');
  await page.locator('input#image').setInputFiles({
    name: 'product.png',
    mimeType: 'image/png',
    buffer: Buffer.from('product'),
  });
  await page.getByRole('button', { name: /Add product/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/products/);

  const searchInput = page.locator('input[placeholder="Search…"]');
  if (await searchInput.count()) {
    await searchInput.fill(productName);
    await expect(page.getByText(productName)).toBeVisible({ timeout: 10000 });
  }

  const productId = await getProductIdByName(page, productName);
  expect(productId).toBeTruthy();

  await page.goto(`/dashboard/products/${productId}/update`);
  await expect(page.locator('.MuiTypography-header', { hasText: /Update Product/i })).toBeVisible();
  const updatedName = `${productName} Updated`;
  await page.getByLabel('Product Name').fill(updatedName);
  await page.getByRole('button', { name: /Update product/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/products/);

  await page.goto('/dashboard/products');
  await expect(page.getByText(updatedName)).toBeVisible({ timeout: 10000 });

  const row = page.getByRole('row', { name: new RegExp(updatedName, 'i') });
  await row.getByRole('button').first().click();
  await page.getByRole('menuitem', { name: /Delete/i }).click();
  await page.getByPlaceholder('Enter product name to delete').fill(updatedName);
  const deletePromise = page.waitForResponse(
    (response) => response.request().method() === 'DELETE' && response.url().includes('/api/v1/products/')
  );
  await page.getByRole('button', { name: /Yes, delete/i }).click();
  await deletePromise;

  await page.reload();
  if (await searchInput.count()) {
    await searchInput.fill(updatedName);
  }

  await expect(page.getByRole('row', { name: new RegExp(updatedName, 'i') })).toHaveCount(0, { timeout: 10000 });

  const deletedProductId = await getProductIdByName(page, updatedName);
  expect(deletedProductId).toBeFalsy();

  const nextButton = page.getByLabel('Go to next page');
  if (await nextButton.count()) {
    if (await nextButton.isEnabled()) {
      await nextButton.click();
    }
  }
});
