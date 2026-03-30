import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';
import { credentials } from './helpers/data';

test('admin can log in and view dashboard', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);
  await expect(page).toHaveURL(/\/dashboard\/analytics/);
  await expect(page.locator('.MuiTypography-header', { hasText: /Analytics/i })).toBeVisible();

  await page.goto('/dashboard/profile');
  await expect(page.locator('.MuiTypography-header', { hasText: /User details/i })).toBeVisible();
});

test('forgot password page submits', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);
  await page.goto('/forgot-password');
  const phoneInput = page.getByPlaceholder('Enter phone number...');
  await expect(phoneInput).toBeVisible();
  await phoneInput.fill(credentials.admin.phone);
  await page.locator('button', { hasText: /Reset Password/i }).click();
  await expect(page.locator('.Toastify__toast')).toBeVisible({ timeout: 10000 });
});
