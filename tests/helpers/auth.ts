import { expect, Page } from '@playwright/test';

export const login = async (page: Page, phone: string, password: string) => {
  await page.goto('/login');
  await page.getByLabel('Phone number').fill(phone);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
};
