import { expect, test } from '@playwright/test';

test('mobile navigation opens, closes, and reaches the checklist', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile navigation is only shown at the mobile breakpoint.');

  await page.goto('/');

  const menuButton = page.locator('button[aria-controls="primary-navigation"]');
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  const checklistLink = navigation.getByRole('link', { name: 'DEF CON 34' });

  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toHaveClass(/open/);
  await expect(checklistLink).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await page.keyboard.press('Escape');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  await menuButton.click();
  await checklistLink.click();
  await expect(page).toHaveURL(/\/dc34\/$/);
  await expect(page).toHaveTitle(/AI Application Security Checklist/i);
  await expect(page.getByRole('heading', { level: 1, name: /Did you vibe-code an AI app/i })).toBeVisible();
});
