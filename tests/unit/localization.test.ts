import { describe, expect, test } from 'bun:test';
import { localeFromPath, localizedPath, directionFor, detectLocale, locales } from '../../src/localization';

describe('localized static routes', () => {
  test('includes exactly the 11 documented locales', () => {
    expect(locales.map(l => l.code)).toEqual(['en', 'en-IN', 'fr', 'de', 'es', 'it', 'zh', 'ar', 'hi', 'bn', 'ta']);
  });
  test('matches only supported locale homepages', () => {
    expect(localeFromPath('/')).toBe('en');
    expect(localeFromPath('/fr/')).toBe('fr');
    expect(localeFromPath('/en-IN')).toBe('en-IN');
    expect(localeFromPath('/unknown/')).toBeNull();
    expect(localeFromPath('/fr/not-a-page')).toBeNull();
  });
  test('builds locale links beneath a Pages project base', () => {
    expect(localizedPath('ar', '/my-repo/')).toBe('/my-repo/ar/');
    expect(localizedPath('en', '/')).toBe('/en/');
  });
  test('mirrors only Arabic', () => {
    expect(directionFor('ar')).toBe('rtl');
    expect(directionFor('hi')).toBe('ltr');
  });
  test('detects browser locales and Indian English with stable fallback', () => {
    expect(detectLocale(['fr-CA', 'en-US'])).toBe('fr');
    expect(detectLocale(['en-IN'])).toBe('en-IN');
    expect(detectLocale(['zh-CN'])).toBe('zh');
    expect(detectLocale(['ja-JP'])).toBe('en');
  });
});
