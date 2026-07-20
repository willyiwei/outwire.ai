import { expect, test } from '@playwright/test';

test('checklist exposes the official Substack signup boundary', async ({ page }) => {
  await page.goto('/dc34/');

  const signup = page.getByTitle('Subscribe to Outwire on Substack');
  await expect(signup).toHaveAttribute('src', 'https://outwire.substack.com/embed');
  await expect(page.locator('.signup-privacy')).toContainText('the checklist works without signup');
});

test('privacy page documents checklist storage and subscription handling', async ({ page }) => {
  const response = await page.goto('/privacy/');

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle('Privacy — Outwire AI');
  await expect(page.getByRole('heading', { level: 1, name: /Privacy, plainly/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Checklist data stays on your device' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Email subscriptions are handled by Substack' })).toBeVisible();
});
