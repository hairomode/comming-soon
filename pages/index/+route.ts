import type { PageContext } from 'vike/types';
import { localeFromPath, pageFromPath } from '../../src/localization';
export function route(pageContext: PageContext) {
  const locale = localeFromPath(pageContext.urlPathname);
  const page = pageFromPath(pageContext.urlPathname);
  return locale && page ? { routeParams: { locale, page } } : false;
}
