import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'motion/react';
import { useData } from 'vike-react/useData';
import { useHydrated } from 'vike-react/useHydrated';
import type { Data } from './+data';
import { locales, localizedPath, isLocale } from '../../src/localization';

function Bolt({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 32 40" fill="none" aria-hidden="true"><path d="M19 1 2 23h12l-3 16L30 15H17L19 1Z" fill="currentColor" /></svg>;
}
function Arrow({ up = false }: { up?: boolean }) {
  return <svg className={`arrow ${up ? 'arrow-up' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Spark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="m50 0 8 32L85 15 68 42l32 8-32 8 17 27-27-17-8 32-8-32-27 17 17-27L0 50l32-8-17-27 27 17L50 0Z" fill="currentColor" /></svg>;
}
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const { locale } = useData<Data>();
  return <motion.div className={className} initial={false} whileInView={reduce ? {} : { y: [locale === 'ar' ? -12 : 12, 0], opacity: [0.8, 1] }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
}
function Wordmark() {
  return <span className="wordmark"><span className="brand-symbol"><Bolt /></span><span>ai{' '}<span className="wordmark-light">powerup</span><span className="brand-period">.</span></span></span>;
}
function LanguageSelect() {
  const hydrated = useHydrated();
  const { t } = useTranslation();
  const { locale } = useData<Data>();
  return <label className="language-control">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12h18" stroke="currentColor" strokeWidth="1.5"/></svg>
    <select disabled={!hydrated} className="select select-ghost" data-testid="locale-select" aria-label={t('nav.language')} value={locale} onChange={event => {
      const next = event.target.value;
      if (!isLocale(next)) return;
      try { localStorage.setItem('ai-powerup-locale', next); } catch { /* Navigation still works without storage. */ }
      window.location.assign(localizedPath(next, import.meta.env.BASE_URL) + window.location.hash);
    }}>
      {locales.map(({ code, label }) => <option key={code} value={code} lang={code}>{label}</option>)}
    </select>
  </label>;
}
export default function Page() {
  const { t } = useTranslation();
  const { locale } = useData<Data>();
  const hydrated = useHydrated();
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <a className="skip-link" href="#main">{t('a11y.skip')}</a>
    <div id="top" />
    <header className="site-header shell">
      <a href={localizedPath(locale, import.meta.env.BASE_URL)} className="brand-link" aria-label={t('nav.home')}><Wordmark /></a>
      <nav className="desktop-nav" aria-label={t('nav.explore')}><a href="#how-it-works">{t('nav.how')}</a><a href="#vision">{t('nav.vision')}</a></nav>
      <div className="header-actions"><LanguageSelect /><span className="badge launch-badge"><span className="status-dot" />{t('closing.badge')}</span><button disabled={!hydrated} className="btn btn-ghost mobile-menu" aria-label={t(menuOpen ? 'a11y.close' : 'a11y.menu')} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button></div>
    </header>
    {menuOpen && <nav id="mobile-nav" className="mobile-nav shell" aria-label={t('nav.explore')}><a href="#how-it-works" onClick={() => setMenuOpen(false)}>{t('nav.how')}<Arrow /></a><a href="#vision" onClick={() => setMenuOpen(false)}>{t('nav.vision')}<Arrow /></a></nav>}
    <main id="main">
      <section className="hero-section shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="tiny-spark">✳</span>{t('hero.badge')}</div>
          <h1 id="hero-title"><span>{t('hero.line1')}</span><span>{t('hero.line2')} <span className="hero-spark" aria-hidden="true">✳</span></span><span className="underlined-word">{t('hero.line3')}<svg viewBox="0 0 500 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 15Q240-4 493 12M29 22Q260 8 465 19" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></span></h1>
          <p className="hero-description">{t('hero.description')}</p>
          <div className="hero-action"><a className="btn btn-primary main-cta" href="#how-it-works">{t('hero.cta')}<Arrow /></a><p><span className="small-dot" />{t('hero.note')}</p></div>
        </div>
        <div className="preview-wrap">
          <div className="preview-stage">
            <div className="stage-grid" aria-hidden="true" />
            <div className="stage-topline"><span className="stage-label">{t('preview.label')}</span><Spark className="stage-spark" /></div>
            <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
            <motion.div className="floating-bolt" aria-hidden="true" initial={false} whileHover={{ rotate: -6, scale: 1.04 }} transition={{ type: 'spring', stiffness: 160 }}><Bolt /></motion.div>
            <div className="challenge-card card">
              <span className="card-eyebrow"><span className="outline-dot" />{t('preview.you')}</span>
              <p>“{t('preview.task')}”</p>
              <span className="challenge-cursor" aria-hidden="true" />
            </div>
            <div className="connector" aria-hidden="true"><span /><svg viewBox="0 0 18 22"><path d="M9 0v19m-6-6 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>
            <div className="course-card card">
              <div className="course-meta"><span className="course-icon"><Bolt /></span><span>{t('preview.path')}</span><span className="preview-tag badge">{t('preview.tag')}</span></div>
              <h2>{t('preview.title')}</h2>
              <ol>{['step1', 'step2', 'step3'].map((key, index) => <li key={key}><span className={`step-mark ${index === 0 ? 'step-complete' : ''}`} aria-hidden="true">{index === 0 ? '✓' : index + 1}</span><span>{t(`preview.${key}`)}</span>{index === 0 && <span className="mini-arrow" aria-hidden="true">↗</span>}</li>)}</ol>
              <div className="course-bottom"><span className="dot-cluster" aria-hidden="true"><i /><i /><i /></span><span>{t('preview.footnote')}</span></div>
            </div>
            <span className="stage-orbit-text">{t('preview.orbit')}</span><Spark className="bottom-spark" />
          </div>
          <p className="preview-caption"><span aria-hidden="true">↳</span>{t('hero.aside')}</p>
        </div>
      </section>
      <div className="principle-strip"><div className="shell strip-inner">{['first', 'second', 'third'].map(key => <span key={key}><Spark />{t(`strip.${key}`)}</span>)}</div></div>
      <section className="how-section shell section-space" id="how-it-works" aria-labelledby="how-title">
        <Reveal className="section-heading"><p className="eyebrow">{t('how.eyebrow')}</p><h2 id="how-title">{t('how.title')}</h2><p className="section-intro">{t('how.intro')}</p></Reveal>
        <div className="journey">{['one', 'two', 'three'].map((key, index) => <Reveal key={key} className="journey-step"><div className="journey-index"><span>{new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(index + 1)}</span><div className="journey-line" /></div><h3>{t(`how.${key}.title`)}</h3><p>{t(`how.${key}.body`)}</p></Reveal>)}</div>
      </section>
      <section className="vision-section shell" id="vision" aria-labelledby="vision-title"><Reveal className="vision-panel"><div className="vision-art" aria-hidden="true"><div className="art-ring ring-a" /><div className="art-ring ring-b" /><div className="art-ring ring-c" /><div className="art-mark"><Bolt /></div><Spark className="art-spark" /><div className="art-dot" /></div><div className="vision-copy"><p className="eyebrow">{t('vision.eyebrow')}</p><h2 id="vision-title">{t('vision.title')}</h2><p>{t('vision.body')}</p><div className="vision-tags"><span className="badge">{t('vision.tag1')}</span><span className="badge">{t('vision.tag2')}</span></div></div></Reveal></section>
      <section className="faq-section shell section-space" aria-labelledby="faq-title"><div><p className="eyebrow">{t('faq.eyebrow')}</p><h2 id="faq-title">{t('faq.title')}</h2><Spark className="faq-spark" /></div><div className="faq-list">{['one', 'two', 'three'].map(key => <details key={key} className="collapse collapse-plus faq-item" data-testid={`faq-${key}`}><summary className="collapse-title">{t(`faq.${key}.question`)}</summary><div className="collapse-content"><p>{t(`faq.${key}.answer`)}</p></div></details>)}</div></section>
      <section className="closing-section" aria-labelledby="closing-title"><div className="shell closing-inner"><span className="badge closing-badge"><span className="status-dot" />{t('closing.badge')}</span><h2 id="closing-title">{t('closing.title')}</h2><p>{t('closing.body')}</p><a className="btn closing-link" href="#top">{t('closing.back')}<Arrow up /></a><Spark className="closing-spark" /></div></section>
    </main>
    <footer className="site-footer shell"><div className="footer-top"><a href="#top" className="brand-link" aria-label={t('nav.home')}><Wordmark /></a><p>{t('footer.description')}</p><span className="footer-status"><span className="small-dot" />{t('footer.status')}</span></div><div className="footer-bottom"><span>© {new Intl.DateTimeFormat(locale, { year: 'numeric', timeZone: 'UTC' }).format(new Date('2026-01-01T00:00:00Z'))} AI Powerup</span><span>{t('footer.privacy')}</span></div></footer>
  </>;
}
