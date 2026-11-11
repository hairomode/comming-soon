import { locales } from '../../src/localization';
export function onBeforePrerenderStart() {
  return ['/', ...locales.map(({ code }) => `/${code}/`)];
}
