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
] as const;
export type Locale = (typeof locales)[number]['code'];
export const isLocale = (value: string): value is Locale => locales.some(l => l.code === value);
export function localeFromPath(path: string): Locale | null {
  if (path === '/') return 'en';
  const match = /^\/([^/]+)\/?$/.exec(path);
  return match && isLocale(match[1]) ? match[1] : null;
}
export function localizedPath(locale: Locale, base = '/') {
  return `${base.replace(/\/$/, '')}/${locale}/`;
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
