import { test, expect, type Page } from '@playwright/test';
import { login } from './helpers/auth';
import { credentials } from './helpers/data';

const getUserIdByName = async (page: Page, name: string) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await page.request.get(`http://localhost:4100/api/v1/users?search=${encodeURIComponent(name)}`);
    const body = await response.json();
    const users = body.data?.users || [];
    const match = users.find((u: { name: string }) => u.name?.toLowerCase().includes(name.toLowerCase()))?.id;
    if (match) return match;
    await page.waitForTimeout(500);
  }
  return undefined;
};

test('users page supports CRUD', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);

  await page.goto('/dashboard/users');
  await expect(page.locator('.MuiTypography-header', { hasText: /Users/i })).toBeVisible();

  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('.MuiTypography-header', { hasText: /Register user/i })).toBeVisible();

  const userName = `E2E User ${Date.now()}`;
  await page.getByPlaceholder('Enter your name...').fill(userName);
  await page.getByPlaceholder('Enter your phone number...').fill('+258840000666');
  await page.getByPlaceholder('Enter Password...').fill('1234');

  await page.locator('#role').click();
  await page.getByRole('option', { name: /Keeper/i }).click();

  await page.locator('#storeId').click();
  await page.getByRole('option').first().click();

  await page.locator('input#image').setInputFiles({
    name: 'avatar.png',
    mimeType: 'image/png',
    buffer: Buffer.from('avatar'),
  });

  await page.getByRole('button', { name: /Register/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/users/);

  const searchInput = page.locator('input[placeholder="Search…"]');
  if (await searchInput.count()) {
    await searchInput.fill(userName);
    await expect(page.getByText(userName)).toBeVisible({ timeout: 10000 });
  }

  const userId = await getUserIdByName(page, userName);
  expect(userId).toBeTruthy();
  await page.goto(`/dashboard/users/${userId}`);
  expect(userId).toBeTruthy();

  await expect(page.locator('.MuiTypography-header', { hasText: /User details/i })).toBeVisible();

  await page.goto(`/dashboard/users/${userId}/update`);
  await expect(page.locator('.MuiTypography-header', { hasText: /Update/i })).toBeVisible();
  const updatedName = `${userName} Updated`;
  await page.getByLabel('Name').fill(updatedName);
  await page.getByRole('button', { name: /Update/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/users/);

  await page.goto('/dashboard/users');
  await expect(page.getByText(updatedName)).toBeVisible({ timeout: 10000 });

  const updatedRow = page.getByRole('row', { name: new RegExp(updatedName, 'i') });
  await updatedRow.getByRole('button').first().click();
  await page.getByRole('menuitem', { name: /Delete/i }).click();
  await page.getByPlaceholder('Enter user name to delete').fill(updatedName);
  await page.getByRole('button', { name: /Yes, delete/i }).click();
});
