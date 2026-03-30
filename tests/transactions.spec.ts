import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';
import { credentials } from './helpers/data';

test('transactions page supports create and list', async ({ page }) => {
  await login(page, credentials.keeper.phone, credentials.keeper.password);

  await page.goto('/dashboard/transactions');
  await expect(page.locator('.MuiTypography-header', { hasText: /Transactions/i })).toBeVisible();

  await page.getByRole('button', { name: /Create/i }).click();
  await expect(page.locator('.MuiTypography-header', { hasText: /Add a transaction/i })).toBeVisible();

  await page.locator('#type').click();
  await page.getByRole('option', { name: /Income/i }).click();

  await page.locator('#paymentMethod').click();
  await page.getByRole('option', { name: /CASH/i }).click();

  await page.getByPlaceholder('Enter the transaction amount...').fill('100');
  await page.getByPlaceholder('Enter the transaction details...').fill('123');
  await page.getByRole('button', { name: /Submit/i }).click();

  await expect(page).toHaveURL(/\/dashboard\/transactions/);
  const row = page
    .getByRole('row')
    .filter({ hasText: /100 MZN/i })
    .first();
  await expect(row).toBeVisible({ timeout: 10000 });
  await row.click();
  await expect(page.getByText(/Transaction details/i)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('123')).toBeVisible({ timeout: 10000 });
});
