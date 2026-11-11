import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PALETTES } from '../../src/palette';

const currentPalette = (page: import('@playwright/test').Page) => page.locator('html').getAttribute('data-palette');
const ctaBackground = (page: import('@playwright/test').Page) =>
  page.locator('.main-cta').first().evaluate(element => getComputedStyle(element).backgroundColor);

test('brand palette rotates round robin on every page load', async ({ page }) => {
  await page.goto('/en/');
  expect(await currentPalette(page)).toBe(PALETTES[0].id);
  const firstBackground = await ctaBackground(page);

  await page.reload();
  expect(await currentPalette(page)).toBe(PALETTES[1].id);
  expect(await ctaBackground(page)).not.toBe(firstBackground);

  await page.reload();
  expect(await currentPalette(page)).toBe(PALETTES[2].id);
  await expect(page.getByTestId('palette-badge')).toContainText(PALETTES[2].label);

  await page.getByTestId('palette-badge').click();
  await expect.poll(() => currentPalette(page)).toBe(PALETTES[3].id);
  await page.reload();
  expect(await currentPalette(page)).toBe(PALETTES[4].id);

  await page.goto(`/en/?palette=${PALETTES[0].id}`);
  expect(await currentPalette(page)).toBe(PALETTES[0].id);
  await page.reload();
  expect(await currentPalette(page)).toBe(PALETTES[0].id);
});

test('palette wraps back to the first color after the last one', async ({ page }) => {
  await page.goto('/en/');
  for (let index = 1; index < PALETTES.length; index++) await page.reload();
  expect(await currentPalette(page)).toBe(PALETTES[PALETTES.length - 1].id);
  await page.reload();
  expect(await currentPalette(page)).toBe(PALETTES[0].id);
});

for (const palette of PALETTES) {
  test(`${palette.id} palette keeps WCAG AA contrast`, async ({ page }) => {
    for (const path of ['/en/', '/en/enterprise/', '/ar/']) {
      await page.goto(`${path}?palette=${palette.id}`);
      expect(await currentPalette(page)).toBe(palette.id);
      const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
      expect(results.violations, `${palette.id} ${path}`).toEqual([]);
    }
  });
}
