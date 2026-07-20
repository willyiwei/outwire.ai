import { expect, test } from '@playwright/test';

const storageKey = 'outwire:dc34-checklist:v1';

test.beforeEach(async ({ page }) => {
  await page.goto('/dc34/');
  await page.evaluate(key => localStorage.removeItem(key), storageKey);
  await page.reload();
});

test('starts with all 24 checks unreviewed', async ({ page }) => {
  await expect(page.locator('.desktop-progress .progress-count')).toHaveText('0 of 24 reviewed');
  await expect(page.locator('.progress-percent')).toHaveText('0%');
  await expect(page.locator('[data-stat="good"]')).toHaveText('0');
  await expect(page.locator('[data-stat="work"]')).toHaveText('0');
  await expect(page.locator('[data-stat="open"]')).toHaveText('24');
  await expect(page.locator('[data-reset-progress]')).toBeDisabled();
});

test('status selections update progress and totals', async ({ page }) => {
  await page.locator('[data-check="blast-access"] [data-value="good"]').click();
  await page.locator('[data-check="blast-actions"] [data-value="work"]').click();

  await expect(page.locator('.desktop-progress .progress-count')).toHaveText('2 of 24 reviewed');
  await expect(page.locator('.progress-percent')).toHaveText('8%');
  await expect(page.locator('[data-stat="good"]')).toHaveText('1');
  await expect(page.locator('[data-stat="work"]')).toHaveText('1');
  await expect(page.locator('[data-stat="open"]')).toHaveText('22');
  await expect(page.locator('[data-category="0"] .category-summary')).toHaveText('2 / 3');
});

test('checklist progress persists after reload', async ({ page }) => {
  const status = page.locator('[data-check="blast-access"] [data-value="good"]');
  await status.click();
  await page.reload();

  await expect(status).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.desktop-progress .progress-count')).toHaveText('1 of 24 reviewed');
});

test('optional profile highlights relevant categories', async ({ page }) => {
  await page.locator('[data-open-profile]').click();
  const firstQuestion = page.locator('.profile-question').first();
  await firstQuestion.getByRole('button', { name: 'Yes' }).click();

  await expect(firstQuestion.getByRole('button', { name: 'Yes' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-category="0"] .priority-badge')).toBeVisible();
  await expect(page.locator('[data-category="4"] .priority-badge')).toBeVisible();
  await expect(page.locator('[data-category="5"] .priority-badge')).toBeVisible();
  await expect(page.locator('[data-category="7"] .priority-badge')).toBeVisible();
  await expect(page.locator('[data-category="2"] .priority-badge')).toBeHidden();
});

test('reset clears progress but preserves the optional profile', async ({ page }) => {
  await page.locator('[data-open-profile]').click();
  const profileYes = page.locator('.profile-question').first().getByRole('button', { name: 'Yes' });
  await profileYes.click();
  await page.locator('[data-check="blast-access"] [data-value="work"]').click();

  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Reset all 24 checklist responses?');
    await dialog.accept();
  });
  await page.locator('[data-reset-progress]').click();

  await expect(page.locator('.desktop-progress .progress-count')).toHaveText('0 of 24 reviewed');
  await expect(page.locator('[data-check="blast-access"] [data-value="work"]')).toHaveAttribute('aria-pressed', 'false');
  await expect(profileYes).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('status')).toHaveText('Checklist progress reset.');
});

test('detail controls expand, switch, and collapse', async ({ page }) => {
  const check = page.locator('[data-check="blast-access"]');
  const why = check.getByRole('button', { name: /Why it matters/ });
  const verify = check.getByRole('button', { name: /How to verify/ });
  const detail = check.locator('.detail-copy');

  await why.click();
  await expect(why).toHaveAttribute('aria-expanded', 'true');
  await expect(detail).toContainText('contain an incident');

  await verify.click();
  await expect(why).toHaveAttribute('aria-expanded', 'false');
  await expect(verify).toHaveAttribute('aria-expanded', 'true');
  await expect(detail).toContainText('Trace model, database, storage');

  await verify.click();
  await expect(verify).toHaveAttribute('aria-expanded', 'false');
  await expect(detail).toBeHidden();
});

test('copy results writes the review summary to the clipboard', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('[data-check="blast-access"] [data-value="good"]').click();
  await page.locator('[data-copy-results]').click();

  await expect(page.getByRole('status')).toHaveText('Results copied to clipboard.');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('OUTWIRE AI APPLICATION SECURITY REVIEW');
  expect(copied).toContain('1 of 24 checks reviewed');
  expect(copied).toContain('1 checks passed · 0 need work · 23 not reviewed');
});

test('print action invokes the browser print API', async ({ page }) => {
  await page.evaluate(() => {
    window.print = () => { window.__outwirePrintCalled = true; };
  });
  await page.locator('[data-check="blast-access"] [data-value="good"]').click();
  await page.locator('[data-print-results]').click();

  await expect.poll(() => page.evaluate(() => window.__outwirePrintCalled)).toBe(true);
});
