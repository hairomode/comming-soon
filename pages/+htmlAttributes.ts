import type { PageContext } from 'vike/types';
import { directionFor, localeFromPath } from '../src/localization';
export default function htmlAttributes(pageContext: PageContext) {
  const locale = localeFromPath(pageContext.urlPathname) || 'en';
  return { lang: locale, dir: directionFor(locale), 'data-theme': 'powerup' };
}
