import { useData } from 'vike-react/useData';
import { locales, localizedPath } from '../src/localization';
import type { Data } from './index/+data';

export default function Head() {
  const { locale } = useData<Data>();
  const base = import.meta.env.BASE_URL;
  const site = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');
  const url = (code: typeof locale) => site ? `${site}/${code}/` : localizedPath(code, base);
  const fontLocale = ['zh', 'ar', 'hi', 'bn', 'ta'].includes(locale) ? locale : null;
  return <>
    <meta name="theme-color" content="#f8f9f1" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content={locale.replace('-', '_')} />
    <meta property="og:url" content={url(locale)} />
    <meta name="twitter:card" content="summary" />
    <link rel="icon" href={`${base}favicon.svg`} type="image/svg+xml" />
    <link rel="canonical" href={url(locale)} />
    {locales.map(({ code }) => <link key={code} rel="alternate" hrefLang={code} href={url(code)} />)}
    <link rel="alternate" hrefLang="x-default" href={site ? `${site}/` : base} />
    {fontLocale && <link rel="stylesheet" href={`${base}fonts/${fontLocale}.css`} />}
  </>;
}
