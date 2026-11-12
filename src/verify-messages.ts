import type { VerifyMessages } from './certificate';
import type { Locale } from './localization';

type Messages = { verify: VerifyMessages };
const dictionaries = import.meta.glob<{ default: Messages }>('../locales/*/corporate.json');

/** Verification-page strings for a locale, falling back to English per key. */
export async function loadVerifyMessages(locale: Locale): Promise<VerifyMessages> {
  const english = dictionaries['../locales/en/corporate.json'];
  if (!english) throw new Error('Missing English dictionary: en');
  const base = (await english()).default.verify;
  if (locale === 'en') return base;
  const loader = dictionaries[`../locales/${locale}/corporate.json`];
  if (!loader) return base;
  const localized = (await loader()).default.verify;
  return localized ? { ...base, ...localized } : base;
}
