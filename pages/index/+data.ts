import type { PageContextServer } from 'vike/types';
import { localeFromPath } from '../../src/localization';
import type { Locale } from '../../src/localization';

type Messages = Record<string, unknown> & { meta: { title: string; description: string } };
const dictionaries = import.meta.glob<{ default: Messages }>('../../locales/*/corporate.json');
export async function data(pageContext: PageContextServer) {
  const locale: Locale = localeFromPath(pageContext.urlPathname) || 'en';
  const load = async (code: Locale) => {
    const loader = dictionaries[`../../locales/${code}/corporate.json`];
    if (!loader) throw new Error(`Missing translation dictionary: ${code}`);
    return (await loader()).default;
  };
  const english = await load('en');
  const messages = locale === 'en' ? english : await load(locale);
  return { locale, english, messages, meta: messages.meta || english.meta };
}
export type Data = Awaited<ReturnType<typeof data>>;
