import { describe, expect, test } from 'bun:test';
import { localeFromPath, pageFromPath, localizedPath, directionFor, detectLocale, locales } from '../../src/localization';

describe('localized static routes', () => {
  test('includes exactly the 15 documented locales', () => {
    expect(locales.map(l => l.code)).toEqual(['en', 'en-IN', 'fr', 'de', 'es', 'it', 'zh', 'ar', 'hi', 'bn', 'ta', 'pt-BR', 'vi', 'lo', 'ja']);
  });
  test('matches supported locale homepages and enterprise pages', () => {
    expect(localeFromPath('/')).toBe('en');
    expect(localeFromPath('/fr/')).toBe('fr');
    expect(localeFromPath('/en-IN')).toBe('en-IN');
    expect(localeFromPath('/enterprise/')).toBe('en');
    expect(localeFromPath('/fr/enterprise/')).toBe('fr');
    expect(localeFromPath('/ar/enterprise')).toBe('ar');
    expect(localeFromPath('/unknown/')).toBeNull();
    expect(localeFromPath('/fr/not-a-page')).toBeNull();
  });
  test('detects page kind from path', () => {
    expect(pageFromPath('/')).toBe('home');
    expect(pageFromPath('/fr/')).toBe('home');
    expect(pageFromPath('/enterprise/')).toBe('enterprise');
    expect(pageFromPath('/fr/enterprise/')).toBe('enterprise');
    expect(pageFromPath('/fr/other/')).toBeNull();
  });
  test('builds locale links beneath a Pages project base for home and enterprise', () => {
    expect(localizedPath('ar', '/my-repo/')).toBe('/my-repo/ar/');
    expect(localizedPath('en', '/')).toBe('/en/');
    expect(localizedPath('fr', '/', 'enterprise')).toBe('/fr/enterprise/');
    expect(localizedPath('ar', '/my-repo/', 'enterprise')).toBe('/my-repo/ar/enterprise/');
  });
  test('mirrors only Arabic', () => {
    expect(directionFor('ar')).toBe('rtl');
    expect(directionFor('hi')).toBe('ltr');
  });
  test('detects browser locales and Indian English with stable fallback', () => {
    expect(detectLocale(['fr-CA', 'en-US'])).toBe('fr');
    expect(detectLocale(['en-IN'])).toBe('en-IN');
    expect(detectLocale(['zh-CN'])).toBe('zh');
    expect(detectLocale(['ja-JP'])).toBe('ja');
  });
});
