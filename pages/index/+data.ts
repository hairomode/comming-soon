import type { PageContextServer } from 'vike/types';
import { localeFromPath, pageFromPath } from '../../src/localization';
import type { Locale, PageKind } from '../../src/localization';

type Meta = { title: string; description: string };
type Messages = Record<string, unknown> & { meta: Meta; enterprise?: { meta?: Meta } };
const dictionaries = import.meta.glob<{ default: Messages }>('../../locales/*/corporate.json');
export async function data(pageContext: PageContextServer) {
  const locale: Locale = localeFromPath(pageContext.urlPathname) || 'en';
  const page: PageKind = pageFromPath(pageContext.urlPathname) || 'home';
  const load = async (code: Locale) => {
    const loader = dictionaries[`../../locales/${code}/corporate.json`];
    if (!loader) throw new Error(`Missing translation dictionary: ${code}`);
    return (await loader()).default;
  };
  const english = await load('en');
  const messages = locale === 'en' ? english : await load(locale);
  const meta = page === 'enterprise'
    ? (messages.enterprise?.meta || english.enterprise?.meta || messages.meta || english.meta)
    : (messages.meta || english.meta);
  return { locale, page, english, messages, meta };
}
export type Data = Awaited<ReturnType<typeof data>>;
