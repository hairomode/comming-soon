import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { locales } from '../../src/localization';

for (const locale of locales) {
  test(`${locale.code}: localized home & enterprise HTML, certificate, fonts, and responsive layout`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

    const response = await page.goto(`/${locale.code}/`);
    expect(response?.status()).toBe(200);
    const html = await response!.text();
    expect(html).toContain(`lang="${locale.code}"`);
    expect(html).toContain(`dir="${locale.code === 'ar' ? 'rtl' : 'ltr'}"`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
    await expect(page.locator('html')).toHaveAttribute('dir', locale.code === 'ar' ? 'rtl' : 'ltr');
    await expect(page.locator('h1')).not.toBeEmpty();
    await expect(page.locator('h1')).not.toContainText('hero.');
    if (locale.code === 'en' || locale.code === 'en-IN') {
      await expect(page.locator('#hero-title')).toContainText('Learn AI tools');
      await expect(page.locator('#hero-title')).toContainText('become Employee');
      await expect(page.locator('#hero-title')).toContainText('of the Year');
      await expect(page.getByTestId('certificate-section')).toContainText('POWERUP YOUR CV WITH THE HAIROMODE CERTIFICATE');
      await expect(page.getByTestId('certificate-section')).toContainText('Be hired for your');
    }
    await expect(page.locator('#hero-title')).not.toContainText('=');
    await expect(page.locator('#hero-title')).not.toContainText('✳');
    await expect(page.locator('head link[rel="alternate"]')).toHaveCount(12);
    await expect(page).toHaveTitle(/hAIroMode/);
    await expect(page.getByTestId('certificate-section')).toBeVisible();
    await expect(page.getByTestId('certificate-card')).toContainText('482 • 917');
    await expect(page.getByTestId('certificate-card')).toContainText('ai.romode.me/v/alex-rivera');

    const scriptLocale = ['zh', 'ar', 'hi', 'bn', 'ta'].includes(locale.code);
    await expect(page.locator('link[rel="stylesheet"][href*="/fonts/"]')).toHaveCount(scriptLocale ? 1 : 0);
    await page.evaluate(() => document.fonts.ready);
    await page.getByTestId('faq-four').click();
    await expect(page.getByTestId('faq-four')).toHaveAttribute('open', '');
    await expect(page.getByTestId('faq-four').locator('.collapse-content p')).toBeVisible();

    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const spacing = await page.evaluate(() => document.querySelector('.preview-stage')!.getBoundingClientRect().bottom - document.querySelector('.course-card')!.getBoundingClientRect().bottom);
      expect(spacing).toBeGreaterThan(30);
    }

    const entResponse = await page.goto(`/${locale.code}/enterprise/`);
    expect(entResponse?.status()).toBe(200);
    await expect(page).toHaveTitle(/hAIroMode/);
    await expect(page.getByTestId('enterprise-pillars')).toContainText('hAIroes');
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }

    expect(errors).toEqual([]);
  });
}

test('language selection navigates to a prerendered locale and stays selected on home and enterprise', async ({ page }) => {
  await page.goto('/en/');
  await page.getByTestId('locale-select').selectOption('fr');
  await expect(page).toHaveURL(/\/fr\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByTestId('locale-select')).toHaveValue('fr');

  await page.getByTestId('nav-enterprise').click();
  await expect(page).toHaveURL(/\/fr\/enterprise\/$/);
  await page.getByTestId('locale-select').selectOption('de');
  await expect(page).toHaveURL(/\/de\/enterprise\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('mobile navigation and anchors work', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/en/');
  const menu = page.locator('.mobile-menu');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mobile-nav').getByRole('link', { name: 'The certificate' }).click();
  await expect(page).toHaveURL(/#certificate$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

for (const locale of ['en', 'ar']) {
  test(`${locale}: no serious accessibility violations on home and enterprise`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    const homeResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(homeResults.violations).toEqual([]);

    await page.goto(`/${locale}/enterprise/`);
    const entResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(entResults.violations).toEqual([]);
  });
}

test('hero-title rotates through 5 phrases every 20 seconds, styles the prefix line, and switches via indicator dots', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('#hero-title')).toHaveAttribute('data-rotation-ms', '20000');
  await expect(page.locator('#hero-title')).toContainText('Learn AI tools');
  await expect(page.locator('#hero-title')).toContainText('become Employee');
  await expect(page.locator('#hero-title')).toContainText('of the Year !');
  await expect(page.locator('#hero-title')).not.toContainText('=');
  await expect(page.locator('#hero-title')).not.toContainText('✳');
  await expect(page.locator('[data-testid^="hero-phrase-dot-"]')).toHaveCount(5);

  const styleDiff = await page.locator('#hero-title').evaluate(el => {
    const before = el.querySelector('.hero-before-equals')!;
    const h1Style = getComputedStyle(el);
    const beforeStyle = getComputedStyle(before);
    return {
      sizeDiffPx: parseFloat(h1Style.fontSize) - parseFloat(beforeStyle.fontSize),
      h1Color: h1Style.color,
      beforeColor: beforeStyle.color,
    };
  });
  expect(Math.round(styleDiff.sizeDiffPx)).toBe(8);
  expect(styleDiff.beforeColor).not.toBe(styleDiff.h1Color);

  await page.getByTestId('hero-phrase-dot-1').click();
  await expect(page.locator('#hero-title')).toHaveAttribute('data-phrase-index', '1');
  await expect(page.locator('#hero-title')).toContainText('Kill daily busywork');

  await page.getByTestId('hero-phrase-dot-4').click();
  await expect(page.locator('#hero-title')).toHaveAttribute('data-phrase-index', '4');
  await expect(page.locator('#hero-title')).toContainText('Earn the Certificate');
});

test('primary call to action has visible foreground text', async ({ page }) => {
  await page.goto('/en/');
  const colors = await page.locator('.main-cta').first().evaluate(element => {
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
