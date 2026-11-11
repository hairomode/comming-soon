import { locales } from '../../src/localization';
export function onBeforePrerenderStart() {
  return [
    '/',
    '/enterprise/',
    ...locales.flatMap(({ code }) => [`/${code}/`, `/${code}/enterprise/`]),
  ];
}
