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
    await expect(page.getByTestId('brand-subtitle')).not.toBeEmpty();
    await expect(page.getByTestId('brand-subtitle')).not.toContainText('nav.');
    if (locale.code === 'en' || locale.code === 'en-IN') {
      await expect(page.getByTestId('brand-subtitle')).toHaveText('turn into the hero of your job');
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

test('header shows the job-hero subtitle within the header on desktop and mobile', async ({ page }) => {
  for (const width of [1440, 360]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/en/');
    const tagline = page.getByTestId('brand-subtitle');
    await expect(tagline).toBeVisible();
    await expect(tagline).toHaveText('turn into the hero of your job');
    const taglineBox = await tagline.boundingBox();
    const headerBox = await page.locator('.site-header').boundingBox();
    expect(taglineBox).not.toBeNull();
    expect(headerBox).not.toBeNull();
    expect(taglineBox!.x).toBeGreaterThanOrEqual(0);
    expect(taglineBox!.x + taglineBox!.width).toBeLessThanOrEqual(width);
    expect(taglineBox!.y + taglineBox!.height).toBeLessThanOrEqual(headerBox!.y + headerBox!.height);

    const style = await tagline.evaluate(element => {
      const computed = getComputedStyle(element);
      return { fontSize: Number.parseFloat(computed.fontSize), fontStyle: computed.fontStyle };
    });
    expect(style.fontSize).toBe(12);
    expect(style.fontStyle).toBe('italic');
    const italicFaceLoaded = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].some(face => face.family.includes('DM Sans') && face.style === 'italic' && face.status === 'loaded');
    });
    expect(italicFaceLoaded).toBe(true);
    const wordmarkBox = await page.locator('.site-header .wordmark').boundingBox();
    expect(wordmarkBox).not.toBeNull();
    expect(Math.abs(taglineBox!.x - wordmarkBox!.x)).toBeLessThanOrEqual(1);
  }
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
  expect(styleDiff.sizeDiffPx).toBeGreaterThan(0);
  expect(styleDiff.beforeColor).not.toBe(styleDiff.h1Color);

  await page.getByTestId('hero-phrase-dot-1').click();
  await expect(page.locator('#hero-title')).toHaveAttribute('data-phrase-index', '1');
  await expect(page.locator('#hero-title')).toContainText('Kill daily busywork');
  await expect(page.locator('#hero-title')).toContainText('ship on time');
  await expect(page.locator('#hero-title')).toContainText('vanish overtimes !');

  const heroTitle = page.locator('#hero-title');
  const box = await heroTitle.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.75, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * 0.25, box!.y + box!.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(heroTitle).toHaveAttribute('data-phrase-index', '2');

  const nextBox = await heroTitle.boundingBox();
  expect(nextBox).not.toBeNull();
  await page.mouse.move(nextBox!.x + nextBox!.width * 0.25, nextBox!.y + nextBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(nextBox!.x + nextBox!.width * 0.75, nextBox!.y + nextBox!.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(heroTitle).toHaveAttribute('data-phrase-index', '1');

  await page.getByTestId('hero-phrase-dot-4').click();
  await expect(page.locator('#hero-title')).toHaveAttribute('data-phrase-index', '4');
  await expect(page.locator('#hero-title')).toContainText('Earn the Certificate');
});

test('mobile hero title and certificate widget are centered with a larger hero title', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/en/');

  const heroStyle = await page.locator('#hero-title').evaluate(element => {
    const style = getComputedStyle(element);
    return { textAlign: style.textAlign, fontSize: Number.parseFloat(style.fontSize) };
  });
  expect(heroStyle.textAlign).toBe('center');
  expect(heroStyle.fontSize).toBeGreaterThan(32);

  const certificate = page.getByTestId('certificate-card');
  await certificate.scrollIntoViewIfNeeded();
  await expect(certificate).toHaveCSS('text-align', 'center');
  await expect(certificate.locator('.cert-card-top')).toHaveCSS('justify-content', 'center');
  await expect(certificate.locator('.cert-qr-box')).toHaveCSS('align-items', 'center');
});

test('stage carousel offers four examples and rotates every minute', async ({ page }) => {
  await page.clock.install();
  await page.goto('/en/');
  const stage = page.getByTestId('hero-preview-stage');
  await expect(stage).toHaveAttribute('data-example-index', '0');
  await expect(stage).toHaveAttribute('data-rotation-ms', '60000');
  await expect(page.locator('[data-testid^="preview-example-dot-"]')).toHaveCount(4);
  await expect(page.getByTestId('hero-challenge-card')).toContainText('meeting notes');

  await page.clock.fastForward(60_000);
  await expect(stage).toHaveAttribute('data-example-index', '1');
  await expect(page.getByTestId('hero-challenge-card')).toContainText('spreadsheets');

  await page.getByTestId('preview-example-dot-0').click();
  await expect(stage).toHaveAttribute('data-example-index', '0');

  await page.getByTestId('preview-example-dot-1').click();
  await expect(stage).toHaveAttribute('data-example-index', '1');
  await expect(page.getByTestId('hero-challenge-card')).toContainText('spreadsheets');
  await expect(page.getByTestId('hero-course-card')).toContainText('From rows to decisions');

  await page.getByTestId('preview-example-dot-2').click();
  await expect(stage).toHaveAttribute('data-example-index', '2');
  await expect(page.getByTestId('hero-challenge-card')).toContainText('presentation');
  await expect(page.getByTestId('hero-course-card')).toContainText('From blank slide to clear story');

  await page.getByTestId('preview-example-dot-3').click();
  await expect(stage).toHaveAttribute('data-example-index', '3');
  await expect(page.getByTestId('hero-challenge-card')).toContainText('My manager asked me at 5pm');
  await expect(page.getByTestId('hero-challenge-card')).toContainText('tomorrow morning, 10am');

  await page.clock.fastForward(60_000);
  await expect(stage).toHaveAttribute('data-example-index', '0');
});

for (const width of [360, 768]) {
  test(`stage carousel swipes left and right at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en/');
    const stage = page.getByTestId('hero-preview-stage');
    await stage.scrollIntoViewIfNeeded();
    await expect(page.getByTestId('preview-example-dot-0')).toBeEnabled();

    const swipe = async (fromRatio: number, toRatio: number) => {
      const box = await stage.boundingBox();
      expect(box).not.toBeNull();
      const y = box!.y + box!.height * 0.2;
      await page.mouse.move(box!.x + box!.width * fromRatio, y);
      await page.mouse.down();
      await page.mouse.move(box!.x + box!.width * toRatio, y, { steps: 8 });
      await page.mouse.up();
    };

    await swipe(0.8, 0.2);
    await expect(stage).toHaveAttribute('data-example-index', '1');
    await swipe(0.2, 0.8);
    await expect(stage).toHaveAttribute('data-example-index', '0');
    await swipe(0.2, 0.8);
    await expect(stage).toHaveAttribute('data-example-index', '3');
  });
}

test('learning stays current and every course can be repeated', async ({ page }) => {
  await page.goto('/en/');
  const section = page.getByTestId('evergreen-learning-section');
  await expect(section).toBeVisible();
  await expect(section.getByRole('heading', { level: 2 })).toContainText('Never fall behind');
  await expect(section).toContainText('New AI courses keep you up to date');
  await expect(section).toContainText('Redo any course as many times as you need');
  const firstCard = section.locator('.evergreen-card').first();
  const iconBox = await firstCard.locator('.evergreen-icon').boundingBox();
  const headingBox = await firstCard.getByRole('heading', { level: 3 }).boundingBox();
  expect(iconBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(Math.abs((iconBox!.y + iconBox!.height / 2) - (headingBox!.y + headingBox!.height / 2))).toBeLessThanOrEqual(4);
  expect(headingBox!.x).toBeGreaterThan(iconBox!.x + iconBox!.width);
});

test('Arabic evergreen heading stays clear of the mobile viewport edge while revealing', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/ar/');
  const section = page.getByTestId('evergreen-learning-section');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const heading = await page.locator('#evergreen-title').boundingBox();
  expect(heading).not.toBeNull();
  expect(heading!.y).toBeGreaterThanOrEqual(20);
  const eyebrowStyle = await section.locator('.eyebrow').evaluate(element => {
    const toRgb = (color: string) => {
      const context = document.createElement('canvas').getContext('2d')!;
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
    };
    const luminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map(value => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const style = getComputedStyle(element);
    const text = luminance(toRgb(style.color));
    const background = luminance(toRgb(getComputedStyle(document.documentElement).backgroundColor));
    return { fontSize: parseFloat(style.fontSize), contrast: (Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05) };
  });
  expect(eyebrowStyle.fontSize).toBeGreaterThanOrEqual(11);
  expect(eyebrowStyle.contrast).toBeGreaterThanOrEqual(6.5);
});

test('typography uses no more than five sizes between 14px and 55px', async ({ page }) => {
  for (const { locale, width } of [
    { locale: 'en', width: 1440 },
    { locale: 'en', width: 360 },
    { locale: 'ar', width: 360 },
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/${locale}/`);
    const sizes = await page.locator('body').evaluate(body => {
      const values = Array.from(body.querySelectorAll('*'))
        .filter(element => {
          if (element.closest('[data-testid="brand-subtitle"]')) return false;
          const style = getComputedStyle(element);
          return style.display !== 'none' && style.visibility !== 'hidden';
        })
        .map(element => Number.parseFloat(getComputedStyle(element).fontSize))
        .filter(Number.isFinite)
        .map(value => Math.round(value * 100) / 100);
      return [...new Set(values)].sort((a, b) => a - b);
    });
    expect(sizes[0]).toBeGreaterThanOrEqual(14);
    expect(sizes.at(-1)).toBeLessThanOrEqual(55);
    expect(sizes.length).toBeLessThanOrEqual(5);
  }
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
