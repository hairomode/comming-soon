import { localeVerifyRoute } from '../../src/certificate';

export function route(pageContext: { urlPathname: string }) {
  const parsed = localeVerifyRoute(pageContext.urlPathname);
  return parsed ? { routeParams: { locale: parsed.locale, id: parsed.id } } : false;
}
