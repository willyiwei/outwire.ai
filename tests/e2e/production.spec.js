import { expect, test } from '@playwright/test';

const productionOrigin = 'https://outwire.ai';
const pages = [
  { path: '/', canonical: `${productionOrigin}/` },
  { path: '/dc34/', canonical: `${productionOrigin}/dc34/` },
  { path: '/privacy/', canonical: `${productionOrigin}/privacy/` },
];

test.describe('@production live-site smoke checks', () => {
  test('serves every page with canonical URLs and security headers', async ({ page, request }) => {
    for (const expected of pages) {
      const response = await request.get(expected.path);
      expect(response.status(), `${expected.path} should load successfully`).toBe(200);

      const headers = response.headers();
      expect(headers['content-security-policy']).toContain("default-src 'self'");
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-frame-options']).toBe('DENY');
      expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['permissions-policy']).toContain('camera=()');

      await page.goto(expected.path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected.canonical);
    }
  });

  test('preserves the path and query string when redirecting www', async ({ request }) => {
    const response = await request.get('https://www.outwire.ai/dc34/?source=production-test', {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(301);
    expect(response.headers().location).toBe(`${productionOrigin}/dc34/?source=production-test`);
  });

  test('redirects supported aliases to their canonical paths', async ({ request }) => {
    const redirects = [
      ['/dc34', '/dc34/'],
      ['/defcon34', '/dc34/'],
      ['/defcon-34', '/dc34/'],
      ['/privacy', '/privacy/'],
    ];

    for (const [source, destination] of redirects) {
      const response = await request.get(source, { maxRedirects: 0 });
      expect(response.status(), `${source} should redirect`).toBe(301);
      expect(new URL(response.headers().location, `${productionOrigin}${source}`).href).toBe(
        `${productionOrigin}${destination}`,
      );
    }
  });

  test('all internal page links resolve successfully', async ({ page, request }) => {
    const internalURLs = new Set();

    for (const expected of pages) {
      await page.goto(expected.path);
      const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => link.href));
      for (const href of hrefs) {
        const url = new URL(href);
        if (url.origin !== productionOrigin) continue;
        url.hash = '';
        internalURLs.add(url.href);
      }
    }

    expect(internalURLs.size).toBeGreaterThan(0);
    for (const url of internalURLs) {
      const response = await request.get(url);
      expect(response.status(), `${url} should resolve`).toBeLessThan(400);
    }
  });
});
