import type { PageContext } from 'vike/types';
import { localeFromPath } from '../../src/localization';
export function route(pageContext: PageContext) {
  const locale = localeFromPath(pageContext.urlPathname);
  return locale ? { routeParams: { locale } } : false;
}
