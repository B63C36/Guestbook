import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
});

test('Insecure: Anyone can add entry without login', async ({ page }) => {
  await page.fill('input[placeholder="Your name"]', 'Hacker');
  await page.fill('textarea', '<script>alert("XSS")</script>');
  await page.click('button:has-text("Sign Guestbook")');
  await expect(page.getByText('Hacker')).toBeVisible();
  await expect(page.locator('text=alert("XSS")')).toBeVisible();
});

test('Insecure: No login screen appears', async ({ page }) => {
  await expect(page.locator('text=Login Required')).toBeHidden();
});