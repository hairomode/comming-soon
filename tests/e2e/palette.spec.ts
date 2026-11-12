import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const colors = async (page: import('@playwright/test').Page) => page.locator('html').evaluate(element => {
  const style = getComputedStyle(element);
  return ['--ink', '--amber', '--paper', '--jade'].map(name => style.getPropertyValue(name).trim());
});

test('chosen brand stays fixed across reloads, old saved choices and palette URLs', async ({ page }) => {
  await page.goto('/en/');
  await page.evaluate(() => localStorage.setItem('hairomode-palette-index', '4'));
  for (const path of ['/en/?palette=plum', '/fr/enterprise/?palette=forest', '/ar/']) {
    await page.goto(path);
    expect(await colors(page)).toEqual(['#232a5c', '#ffd166', '#f9f8f3', '#12483b']);
    await page.reload();
    expect(await colors(page)).toEqual(['#232a5c', '#ffd166', '#f9f8f3', '#12483b']);
    await expect(page.getByTestId('palette-badge')).toHaveCount(0);
    expect(await page.locator('html').getAttribute('data-palette')).toBeNull();
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f9f8f3');
  }
});

for (const path of ['/en/', '/en/enterprise/', '/ar/', '/ar/enterprise/']) {
  test(`${path} uses Jade headings and text links with accessible contrast`, async ({ page }) => {
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await expect(page.locator('.language-control select')).toBeEnabled();
      const mismatches = await page.locator('body').evaluate(body => {
        return Array.from(body.querySelectorAll('h1, h2, h3, a:not(.btn):not(.skip-link)')).filter(element => {
          const expected = element.closest('.closing-section') ? 'rgb(141, 224, 188)' : 'rgb(18, 72, 59)';
          return getComputedStyle(element).color !== expected;
        }).map(element => element.outerHTML.slice(0, 150));
      });
      expect(mismatches).toEqual([]);
      const result = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
      expect(result.violations).toEqual([]);
    }
  });
}

test('the chosen palette works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/en/');
  expect(await colors(page)).toEqual(['#232a5c', '#ffd166', '#f9f8f3', '#12483b']);
  await expect(page.locator('h1')).toHaveCSS('color', 'rgb(18, 72, 59)');
  await expect(page.getByTestId('palette-badge')).toHaveCount(0);
  await context.close();
});
