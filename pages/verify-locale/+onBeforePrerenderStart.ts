import { locales } from '../../src/localization';
import { SAMPLE_CERTIFICATE_ID } from '../../src/certificate';

export function onBeforePrerenderStart() {
  return locales.map(({ code }) => `/${code}/v/${SAMPLE_CERTIFICATE_ID}/`);
}
