import { useMemo, useEffect, useState, type ReactNode } from 'react';
import { createInstance } from 'i18next';
import ICU from 'i18next-icu';
import { I18nextProvider } from 'react-i18next';
import { useData } from 'vike-react/useData';
import { MotionConfig } from 'motion/react';
import type { Data } from './index/+data';
import { detectLocale, isLocale, localizedPath } from '../src/localization';
import { PALETTES, PALETTE_STORAGE_KEY, applyPalette } from '../src/palette';
import '../src/styles.css';

// TEMPORARY: shows the active test palette; click to try the next one.
function PaletteBadge() {
  const [index, setIndex] = useState<number | null>(null);
  useEffect(() => {
    const found = PALETTES.findIndex(palette => palette.id === document.documentElement.dataset.palette);
    setIndex(found < 0 ? 0 : found);
  }, []);
  if (index === null) return null;
  const palette = PALETTES[index];
  return (
    <button
      type="button"
      className="palette-badge"
      data-testid="palette-badge"
      aria-label={`Color test ${index + 1} of ${PALETTES.length}: ${palette.label}. Show next palette`}
      onClick={() => {
        const next = (index + 1) % PALETTES.length;
        try { localStorage.setItem(PALETTE_STORAGE_KEY, String(next)); } catch { /* Storage can be disabled. */ }
        applyPalette(document.documentElement, PALETTES[next]);
        setIndex(next);
      }}
    >
      <span className="palette-swatch" aria-hidden="true" />
      {index + 1}/{PALETTES.length} · {palette.label}
    </button>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { locale, page, messages, english } = useData<Data>();
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
    const isRoot = window.location.pathname === base || window.location.pathname === `${base}enterprise/`;
    if (!isRoot) return;
    let preferred: string | null = null;
    try { preferred = localStorage.getItem('hairomode-locale'); } catch { /* Storage can be disabled. */ }
    const detected = preferred && isLocale(preferred) ? preferred : detectLocale(navigator.languages);
    if (detected !== 'en') window.location.replace(localizedPath(detected, base, page) + window.location.hash);
  }, [page]);
  return <I18nextProvider i18n={i18n}><MotionConfig reducedMotion="user">{children}<PaletteBadge /></MotionConfig></I18nextProvider>;
}
