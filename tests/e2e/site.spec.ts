import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { locales } from '../../src/localization';

for (const locale of locales) {
  test(`${locale.code}: localized HTML, content, fonts, and responsive layout`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`/${locale.code}/`);
    expect(response?.status()).toBe(200);
    const html = await response!.text();
    expect(html).toContain(`lang="${locale.code}"`);
    expect(html).toContain(`dir="${locale.code === 'ar' ? 'rtl' : 'ltr'}"`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
    await expect(page.locator('html')).toHaveAttribute('dir', locale.code === 'ar' ? 'rtl' : 'ltr');
    await expect(page.locator('h1')).not.toBeEmpty();
    await expect(page.locator('h1')).not.toContainText('hero.');
    await expect(page.locator('head link[rel="alternate"]')).toHaveCount(12);
    await expect(page).toHaveTitle(/AI Powerup/);
    const scriptLocale = ['zh', 'ar', 'hi', 'bn', 'ta'].includes(locale.code);
    await expect(page.locator('link[rel="stylesheet"][href*="/fonts/"]')).toHaveCount(scriptLocale ? 1 : 0);
    await page.evaluate(() => document.fonts.ready);
    await page.getByTestId('faq-one').click();
    await expect(page.getByTestId('faq-one')).toHaveAttribute('open', '');
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const spacing = await page.evaluate(() => document.querySelector('.preview-stage')!.getBoundingClientRect().bottom - document.querySelector('.course-card')!.getBoundingClientRect().bottom);
      expect(spacing).toBeGreaterThan(30);
    }
    expect(errors).toEqual([]);
  });
}

test('language selection navigates to a prerendered locale and stays selected', async ({ page }) => {
  await page.goto('/en/');
  await page.getByTestId('locale-select').selectOption('fr');
  await expect(page).toHaveURL(/\/fr\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByTestId('locale-select')).toHaveValue('fr');
});

test('mobile navigation and anchors work', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/en/');
  const menu = page.locator('.mobile-menu');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mobile-nav').getByRole('link', { name: 'How it works' }).click();
  await expect(page).toHaveURL(/#how-it-works$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

for (const locale of ['en', 'ar']) {
  test(`${locale}: no serious accessibility violations`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}

  test('primary call to action has visible foreground text', async ({ page }) => {
    await page.goto('/en/');
    const colors = await page.locator('.main-cta').evaluate(element => {
      const style = getComputedStyle(element);
      return { text: style.color, background: style.backgroundColor };
    });
    expect(colors.text).not.toBe(colors.background);
  });

test('reduced motion remains readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'See what’s coming' })).toBeVisible();
});
