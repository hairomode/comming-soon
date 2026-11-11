import type { PageContext } from 'vike/types';
import { localeFromPath } from '../src/localization';
export default function lang(pageContext: PageContext) {
  return localeFromPath(pageContext.urlPathname) || 'en';
}
