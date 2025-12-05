import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
});

test('UC-1: Anyone can view entries', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Guestbook');
});

test('UC-2 & UC-3: Login + Add entry', async ({ page }) => {
  await page.fill('input[placeholder="Username"]', 'user');
  await page.fill('input[type="password"]', '123secure');
  await page.click('button:has-text("Login")');
  await expect(page.getByText('Logged in as user')).toBeVisible();

  await page.fill('input[placeholder="Your name"]', 'Cody');
  await page.fill('textarea', 'test');
  await page.click('button:has-text("Sign Guestbook")');
  await expect(page.getByText('Cody')).toBeVisible();
});

test('UC-4: Delete entry', async ({ page }) => {
  await page.fill('input[placeholder="Username"]', 'user');
  await page.fill('input[type="password"]', '123secure');
  await page.click('button:has-text("Login")');

  if (await page.getByText('Empty').isVisible()) {
    await page.fill('input[placeholder="Your name"]', 'Temp');
    await page.fill('textarea', 'temp');
    await page.click('button:has-text("Sign Guestbook")');
  }

  await page.click('.delete-btn >> nth=0');
  await expect(page.locator('.entry')).toHaveCount(0);
});