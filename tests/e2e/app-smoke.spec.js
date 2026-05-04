import { test, expect } from '@playwright/test';

test('login page renders and route guard redirects protected route', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.locator('button[type="submit"]')).toBeVisible();

  await page.goto('/home');
  await expect(page).toHaveURL(/\/login/);
});

test('register page is reachable', async ({ page }) => {
  await page.goto('/register');
  await expect(page).toHaveURL(/\/register/);
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
