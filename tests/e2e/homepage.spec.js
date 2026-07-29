import { expect, test } from '@playwright/test';

test('homepage loads without browser errors', async ({ page }) => {
  const errors = [];

  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/Outwire/i);
  await expect(
    page.getByRole('heading', { level: 1, name: /Break things before they ship/i }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('homepage loads a linked section from the URL fragment', async ({ page }) => {
  await page.goto('/#content');

  await expect(page.locator('#content')).toBeInViewport();
  await expect(page).toHaveURL(/#content$/);
});

test('published dispatches link to their Substack articles', async ({ page }) => {
  await page.goto('/#content');

  const blastRadiusArticle = page.getByRole('link', {
    name: /Your AI Agent Has a Blast Radius/i,
  });
  await expect(blastRadiusArticle).toHaveAttribute(
    'href',
    'https://outwire.substack.com/p/your-ai-agent-has-a-blast-radius?r=57ywg7',
  );

  const threatModelArticle = page.getByRole('link', {
    name: /Threat Modeling Your AI Chatbot/i,
  });
  await expect(threatModelArticle).toHaveAttribute(
    'href',
    'https://open.substack.com/pub/outwire/p/threat-modeling-your-ai-chatbot',
  );
});
