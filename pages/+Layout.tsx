import { useMemo, useEffect, type ReactNode } from 'react';
import { createInstance } from 'i18next';
import ICU from 'i18next-icu';
import { I18nextProvider } from 'react-i18next';
import { useData } from 'vike-react/useData';
import { MotionConfig } from 'motion/react';
import type { Data } from './index/+data';
import { detectLocale, isLocale, localizedPath } from '../src/localization';
import '../src/styles.css';

export default function Layout({ children }: { children: ReactNode }) {
  const { locale, messages, english } = useData<Data>();
  const i18n = useMemo(() => {
    const instance = createInstance().use(ICU);
    void instance.init({
      lng: locale, fallbackLng: 'en', defaultNS: 'corporate', ns: ['corporate'],
      initAsync: false, interpolation: { escapeValue: false },
      resources: { en: { corporate: english }, [locale]: { corporate: messages } },
      returnEmptyString: false,
    });
    return instance;
  }, [locale, messages, english]);
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    if (window.location.pathname !== base) return;
    let preferred: string | null = null;
    try { preferred = localStorage.getItem('ai-powerup-locale'); } catch { /* Storage can be disabled. */ }
    const detected = preferred && isLocale(preferred) ? preferred : detectLocale(navigator.languages);
    if (detected !== 'en') window.location.replace(localizedPath(detected, base) + window.location.hash);
  }, []);
  return <I18nextProvider i18n={i18n}><MotionConfig reducedMotion="user">{children}</MotionConfig></I18nextProvider>;
}
