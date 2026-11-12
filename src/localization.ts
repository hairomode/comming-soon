export const locales = [
  { code: 'en', label: 'English' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'zh', label: '简体中文' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'lo', label: 'ພາສາລາວ' },
  { code: 'ja', label: '日本語' },
] as const;
export type Locale = (typeof locales)[number]['code'];
export type PageKind = 'home' | 'enterprise';
export const isLocale = (value: string): value is Locale => locales.some(l => l.code === value);
export function localeFromPath(path: string): Locale | null {
  if (path === '/' || /^\/enterprise\/?$/.test(path)) return 'en';
  const match = /^\/([^/]+)(?:\/enterprise)?\/?$/.exec(path);
  return match && isLocale(match[1]) ? match[1] : null;
}
export function pageFromPath(path: string): PageKind | null {
  if (/^\/enterprise\/?$/.test(path) || (/^\/([^/]+)\/enterprise\/?$/.test(path) && localeFromPath(path))) return 'enterprise';
  if (path === '/' || (/^\/([^/]+)\/?$/.test(path) && localeFromPath(path))) return 'home';
  return null;
}
export function localizedPath(locale: Locale, base = '/', page: PageKind = 'home') {
  const prefix = `${base.replace(/\/$/, '')}/${locale}`;
  return page === 'enterprise' ? `${prefix}/enterprise/` : `${prefix}/`;
}
export const directionFor = (locale: Locale) => locale === 'ar' ? 'rtl' : 'ltr';
export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    if (isLocale(language)) return language;
    const primary = language.split('-')[0].toLowerCase();
    if (isLocale(primary)) return primary;
  }
  return 'en';
}
