import { useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
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
function QrMatrix() {
  return (
    <svg className="qr-svg" viewBox="0 0 110 110" fill="none" aria-hidden="true">
      <rect width="110" height="110" rx="10" fill="#fffef9" />
      <rect x="8" y="8" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="6" />
      <rect x="16" y="16" width="12" height="12" rx="2" fill="currentColor" />
      <rect x="74" y="8" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="6" />
      <rect x="82" y="16" width="12" height="12" rx="2" fill="currentColor" />
      <rect x="8" y="74" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="6" />
      <rect x="16" y="82" width="12" height="12" rx="2" fill="currentColor" />
      <rect x="44" y="10" width="6" height="6" fill="currentColor" />
      <rect x="54" y="10" width="10" height="6" fill="currentColor" />
      <rect x="44" y="22" width="12" height="6" fill="currentColor" />
      <rect x="60" y="22" width="6" height="12" fill="currentColor" />
      <rect x="10" y="46" width="10" height="6" fill="currentColor" />
      <rect x="24" y="46" width="8" height="8" fill="currentColor" />
      <rect x="10" y="58" width="18" height="6" fill="currentColor" />
      <rect x="42" y="42" width="26" height="26" rx="6" fill="#203e2e" />
      <path d="M57 46 49 56h5l-1 8 8-11h-5l1-7Z" fill="#d8f879" />
      <rect x="74" y="44" width="8" height="8" fill="currentColor" />
      <rect x="88" y="44" width="12" height="6" fill="currentColor" />
      <rect x="74" y="58" width="16" height="6" fill="currentColor" />
      <rect x="94" y="56" width="6" height="14" fill="currentColor" />
      <rect x="44" y="76" width="8" height="10" fill="currentColor" />
      <rect x="58" y="74" width="12" height="6" fill="currentColor" />
      <rect x="44" y="92" width="18" height="8" fill="currentColor" />
      <rect x="74" y="74" width="10" height="10" fill="currentColor" />
      <rect x="90" y="74" width="10" height="6" fill="currentColor" />
      <rect x="74" y="90" width="26" height="10" rx="2" fill="currentColor" />
    </svg>
  );
}
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduce ? {} : { y: [22, 0], scale: [0.97, 1], opacity: [0.95, 1] }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
function ScrollProgressBar() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return <motion.div className="scroll-progress-bar" data-testid="scroll-progress-bar" aria-hidden="true" style={reduce ? undefined : { scaleX }} />;
}
function Wordmark() {
  return <span className="wordmark"><span className="brand-symbol"><Bolt /></span><span>hAIro<span className="wordmark-light">Mode</span><span className="brand-period">.</span></span></span>;
}
function LanguageSelect() {
  const hydrated = useHydrated();
  const { t } = useTranslation();
  const { locale, page } = useData<Data>();
  return <label className="language-control">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12h18" stroke="currentColor" strokeWidth="1.5"/></svg>
    <select disabled={!hydrated} className="select select-ghost" data-testid="locale-select" aria-label={t('nav.language')} value={locale} onChange={event => {
      const next = event.target.value;
      if (!isLocale(next)) return;
      try { localStorage.setItem('hairomode-locale', next); } catch { /* Navigation still works without storage. */ }
      window.location.assign(localizedPath(next, import.meta.env.BASE_URL, page) + window.location.hash);
    }}>
      {locales.map(({ code, label }) => <option key={code} value={code} lang={code}>{label}</option>)}
    </select>
  </label>;
}
function CertificateCard() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="certificate-card card"
      data-testid="certificate-card"
      initial={false}
      whileHover={reduce ? {} : { y: -6, rotate: -0.6 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <div className="cert-card-top">
        <span className="wordmark cert-wordmark"><span className="brand-symbol"><Bolt /></span><span>hAIro<span className="wordmark-light">Mode</span></span></span>
        <span className="badge cert-badge">{t('certificate.card.badge')}</span>
      </div>
      <h3>{t('certificate.card.title')}</h3>
      <div className="cert-qr-row">
        <div className="cert-qr-box">
          <div className="qr-scan-frame">
            <QrMatrix />
            {!reduce && (
              <motion.div
                className="qr-scan-beam"
                aria-hidden="true"
                initial={false}
                animate={{ y: [4, 96, 4], opacity: [0.35, 0.95, 0.35] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
          <span className="cert-qr-caption">{t('certificate.card.qrCaption')}</span>
        </div>
        <div className="cert-fields">
          <div className="cert-field">
            <span className="cert-field-label">{t('certificate.card.candidateLabel')}</span>
            <strong className="cert-field-value">{t('certificate.card.candidateValue')}</strong>
          </div>
          <div className="cert-field">
            <span className="cert-field-label">{t('certificate.card.codeLabel')}</span>
            <motion.strong
              className="cert-code-pill"
              dir="ltr"
              initial={false}
              animate={reduce ? {} : { scale: [1, 1.03, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {t('certificate.card.codeValue')}
            </motion.strong>
          </div>
          <div className="cert-field">
            <span className="cert-field-label">{t('certificate.card.urlLabel')}</span>
            <code className="cert-url-pill" dir="ltr">{t('certificate.card.urlValue')}</code>
          </div>
        </div>
      </div>
      <div className="cert-card-footer">
        <span className="status-dot" />
        <span>{t('certificate.card.cvTag')}</span>
      </div>
    </motion.div>
  );
}

const HERO_PHRASE_KEYS = ['one', 'two', 'three', 'four', 'five'] as const;
const HERO_ROTATION_MS = 20_000;

function HomeContent() {
  const { t } = useTranslation();
  const { locale } = useData<Data>();
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [activePreviewStep, setActivePreviewStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhraseIndex(current => (current + 1) % HERO_PHRASE_KEYS.length);
    }, HERO_ROTATION_MS);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const stepTimer = window.setInterval(() => {
      setActivePreviewStep(current => (current + 1) % 3);
    }, 2800);
    return () => window.clearInterval(stepTimer);
  }, [reduce]);

  const activeKey = HERO_PHRASE_KEYS[phraseIndex];
  const movePhrase = (delta: number) => {
    setPhraseIndex(current => (current + delta + HERO_PHRASE_KEYS.length) % HERO_PHRASE_KEYS.length);
  };
  const base = import.meta.env.BASE_URL;
  return (
    <main id="main">
      <section className="hero-section shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="tiny-spark">✳</span>{t('hero.badge')}</div>
          <h1 id="hero-title" data-phrase-index={phraseIndex} data-rotation-ms={HERO_ROTATION_MS}>
            <motion.span
              key={activeKey}
              className="hero-phrase"
              initial={false}
              animate={reduce ? {} : { y: [14, 0], scale: [0.98, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x <= -50) movePhrase(1);
                if (info.offset.x >= 50) movePhrase(-1);
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span><span className="hero-before-equals">{t(`hero.phrases.${activeKey}.line1`)}</span></span>
              <span>{t(`hero.phrases.${activeKey}.line2`)}</span>
              <span className="underlined-word">{t(`hero.phrases.${activeKey}.line3`)}<svg viewBox="0 0 500 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 15Q240-4 493 12M29 22Q260 8 465 19" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></span>
            </motion.span>
          </h1>
          <div className="hero-phrase-dots" role="tablist" aria-label={t('hero.badge')}>
            {HERO_PHRASE_KEYS.map((key, idx) => (
              <button
                key={key}
                type="button"
                role="tab"
                disabled={!hydrated}
                data-testid={`hero-phrase-dot-${idx}`}
                aria-selected={phraseIndex === idx}
                aria-label={`${idx + 1} / ${HERO_PHRASE_KEYS.length}: ${t(`hero.phrases.${key}.line1`)} ${t(`hero.phrases.${key}.line2`)} ${t(`hero.phrases.${key}.line3`)}`}
                className={`phrase-dot ${phraseIndex === idx ? 'phrase-dot-active' : ''}`}
                onClick={() => setPhraseIndex(idx)}
              />
            ))}
          </div>
          <p className="hero-description">{t('hero.description')}</p>
          <div className="hero-action"><a className="btn btn-primary main-cta" href="#how-it-works">{t('hero.cta')}<Arrow /></a><p><span className="small-dot" />{t('hero.note')}</p></div>
        </div>
        <div className="preview-wrap">
          <motion.div
            className="preview-stage"
            data-testid="hero-preview-stage"
            initial={false}
            whileInView={reduce ? {} : { scale: [0.98, 1], y: [14, 0] }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="stage-grid" aria-hidden="true" />
            <div className="stage-topline">
              <span className="stage-label">{t('preview.label')}</span>
              <motion.span
                className="stage-spark-wrap"
                aria-hidden="true"
                initial={false}
                animate={reduce ? {} : { rotate: 360, scale: [1, 1.16, 1] }}
                transition={{ rotate: { duration: 18, repeat: Infinity, ease: 'linear' }, scale: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } }}
              >
                <Spark className="stage-spark" />
              </motion.span>
            </div>
            <motion.div
              className="orbit orbit-one"
              aria-hidden="true"
              initial={false}
              animate={reduce ? {} : { scale: [1, 1.03, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="orbit orbit-two"
              aria-hidden="true"
              initial={false}
              animate={reduce ? {} : { scale: [1, 0.96, 1], opacity: [0.65, 0.95, 0.65] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="floating-bolt"
              data-testid="hero-floating-bolt"
              aria-hidden="true"
              initial={false}
              animate={reduce ? {} : { y: [-6, 7, -6], rotate: [9, 15, 9], scale: [1, 1.05, 1] }}
              whileHover={reduce ? {} : { rotate: -6, scale: 1.12 }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Bolt />
            </motion.div>
            <motion.div
              className="challenge-card card"
              data-testid="hero-challenge-card"
              initial={false}
              animate={reduce ? {} : { y: [0, -5, 0], rotate: [-3, -1.6, -3] }}
              whileHover={reduce ? {} : { scale: 1.02, rotate: -0.5 }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="card-eyebrow"><span className="outline-dot" />{t('preview.you')}</span>
              <p>“{t('preview.task')}”<motion.span className="live-typing-caret" aria-hidden="true" initial={false} animate={reduce ? {} : { opacity: [1, 0.15, 1] }} transition={{ duration: 1.05, repeat: Infinity }} /></p>
              <span className="challenge-cursor" aria-hidden="true" />
            </motion.div>
            <motion.div
              className="connector"
              aria-hidden="true"
              initial={false}
              animate={reduce ? {} : { y: [-3, 4, -3], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span />
              <svg viewBox="0 0 18 22"><path d="M9 0v19m-6-6 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </motion.div>
            <motion.div
              className="course-card card"
              data-testid="hero-course-card"
              initial={false}
              animate={reduce ? {} : { y: [0, 5, 0], rotate: [2, 0.8, 2] }}
              whileHover={reduce ? {} : { scale: 1.02, rotate: 0 }}
              transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="course-meta"><span className="course-icon"><Bolt /></span><span>{t('preview.path')}</span><span className="preview-tag badge">{t('preview.tag')}</span></div>
              <h2>{t('preview.title')}</h2>
              <ol>
                {(['step1', 'step2', 'step3'] as const).map((key, index) => {
                  const isActive = activePreviewStep === index;
                  return (
                    <motion.li
                      key={key}
                      className={isActive ? 'course-step-active' : ''}
                      initial={false}
                      animate={reduce ? {} : { x: isActive ? (locale === 'ar' ? -5 : 5) : 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <span className={`step-mark ${isActive ? 'step-complete' : ''}`} aria-hidden="true">{isActive ? '✓' : index + 1}</span>
                      <span>{t(`preview.${key}`)}</span>
                      {isActive && <span className="mini-arrow" aria-hidden="true">↗</span>}
                    </motion.li>
                  );
                })}
              </ol>
              <div className="course-bottom"><span className="dot-cluster" aria-hidden="true"><i /><i /><i /></span><span>{t('preview.footnote')}</span></div>
            </motion.div>
            <span className="stage-orbit-text">{t('preview.orbit')}</span>
            <motion.span
              className="bottom-spark-wrap"
              aria-hidden="true"
              initial={false}
              animate={reduce ? {} : { rotate: -360, scale: [1, 1.14, 1] }}
              transition={{ rotate: { duration: 22, repeat: Infinity, ease: 'linear' }, scale: { duration: 4.1, repeat: Infinity, ease: 'easeInOut' } }}
            >
              <Spark className="bottom-spark" />
            </motion.span>
          </motion.div>
          <p className="preview-caption"><span aria-hidden="true">↳</span>{t('hero.aside')}</p>
        </div>
      </section>
      <div className="principle-strip"><div className="shell strip-inner">{['first', 'second', 'third'].map((key, idx) => <Reveal key={key} delay={idx * 0.08} className="strip-item"><Spark />{t(`strip.${key}`)}</Reveal>)}</div></div>
      <section className="how-section shell section-space" id="how-it-works" aria-labelledby="how-title">
        <Reveal className="section-heading"><p className="eyebrow">{t('how.eyebrow')}</p><h2 id="how-title">{t('how.title')}</h2><p className="section-intro">{t('how.intro')}</p></Reveal>
        <div className="journey">{['one', 'two', 'three'].map((key, index) => <Reveal key={key} delay={index * 0.12} className="journey-step"><div className="journey-index"><span>{new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(index + 1)}</span><div className="journey-line" /></div><h3>{t(`how.${key}.title`)}</h3><p>{t(`how.${key}.body`)}</p></Reveal>)}</div>
      </section>
      <section className="evergreen-section shell section-space" data-testid="evergreen-learning-section" aria-labelledby="evergreen-title">
        <Reveal className="section-heading evergreen-heading">
          <p className="eyebrow">{t('evergreen.eyebrow')}</p>
          <h2 id="evergreen-title">{t('evergreen.title')}</h2>
          <p className="section-intro">{t('evergreen.intro')}</p>
        </Reveal>
        <div className="evergreen-grid">
          {(['current', 'repeat'] as const).map((key, index) => (
            <Reveal key={key} delay={index * 0.12} className="evergreen-card card">
              <motion.span
                className="evergreen-icon"
                aria-hidden="true"
                initial={false}
                animate={reduce ? {} : { rotate: key === 'current' ? [0, 10, 0] : [0, -14, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
              >{key === 'current' ? '↗' : '↻'}</motion.span>
              <span className="evergreen-index">0{index + 1}</span>
              <h3>{t(`evergreen.${key}.title`)}</h3>
              <p>{t(`evergreen.${key}.body`)}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="certificate-section shell section-space" id="certificate" data-testid="certificate-section" aria-labelledby="certificate-title">
        <div className="certificate-grid">
          <Reveal className="certificate-copy">
            <p className="eyebrow">{t('certificate.eyebrow')}</p>
            <h2 id="certificate-title">{t('certificate.title')}</h2>
            <p className="section-intro">{t('certificate.intro')}</p>
            <div className="certificate-steps">
              {(['one', 'two', 'three'] as const).map((key, index) => (
                <Reveal key={key} delay={index * 0.1} className="cert-step-item">
                  <span className="cert-step-num">{new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(index + 1)}</span>
                  <div>
                    <h3>{t(`certificate.${key}.title`)}</h3>
                    <p>{t(`certificate.${key}.body`)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="certificate-showcase">
            <CertificateCard />
          </Reveal>
        </div>
      </section>
      <section className="vision-section shell" id="vision" aria-labelledby="vision-title">
        <Reveal className="vision-panel">
          <div className="vision-art" aria-hidden="true">
            <motion.div className="art-ring ring-a" initial={false} animate={reduce ? {} : { scale: [1, 1.05, 1] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="art-ring ring-b" initial={false} animate={reduce ? {} : { scale: [1, 0.96, 1] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="art-ring ring-c" initial={false} animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="art-mark" initial={false} animate={reduce ? {} : { rotate: [-12, -6, -12], y: [-4, 4, -4] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}><Bolt /></motion.div>
            <Spark className="art-spark" />
            <div className="art-dot" />
          </div>
          <div className="vision-copy"><p className="eyebrow">{t('vision.eyebrow')}</p><h2 id="vision-title">{t('vision.title')}</h2><p>{t('vision.body')}</p><div className="vision-tags"><span className="badge">{t('vision.tag1')}</span><span className="badge">{t('vision.tag2')}</span></div><div className="vision-cta"><a className="btn btn-primary main-cta" href={localizedPath(locale, base, 'enterprise')}>{t('nav.enterprise')}<Arrow /></a></div></div>
        </Reveal>
      </section>
      <section className="faq-section shell section-space" aria-labelledby="faq-title"><Reveal><div><p className="eyebrow">{t('faq.eyebrow')}</p><h2 id="faq-title">{t('faq.title')}</h2><Spark className="faq-spark" /></div></Reveal><div className="faq-list">{['one', 'two', 'three', 'four'].map((key, idx) => <Reveal key={key} delay={idx * 0.07}><details className="collapse collapse-plus faq-item" data-testid={`faq-${key}`}><summary className="collapse-title">{t(`faq.${key}.question`)}</summary><div className="collapse-content"><p>{t(`faq.${key}.answer`)}</p></div></details></Reveal>)}</div></section>
      <section className="closing-section" aria-labelledby="closing-title"><Reveal className="shell closing-inner"><span className="badge closing-badge"><span className="status-dot" />{t('closing.badge')}</span><h2 id="closing-title">{t('closing.title')}</h2><p>{t('closing.body')}</p><a className="btn closing-link" href="#top">{t('closing.back')}<Arrow up /></a><Spark className="closing-spark" /></Reveal></section>
    </main>
  );
}
function EnterpriseContent() {
  const { t } = useTranslation();
  const { locale } = useData<Data>();
  const reduce = useReducedMotion();
  const base = import.meta.env.BASE_URL;
  return (
    <main id="main">
      <section className="hero-section shell" aria-labelledby="ent-hero-title">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="tiny-spark">✳</span>{t('enterprise.hero.badge')}</div>
          <h1 id="ent-hero-title"><span>{t('enterprise.hero.line1')}</span><span>{t('enterprise.hero.line2')} <span className="hero-spark" aria-hidden="true">✳</span></span><span className="underlined-word">{t('enterprise.hero.line3')}<svg viewBox="0 0 500 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 15Q240-4 493 12M29 22Q260 8 465 19" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></span></h1>
          <p className="hero-description">{t('enterprise.hero.description')}</p>
          <div className="hero-action"><a className="btn btn-primary main-cta" href="#pillars">{t('enterprise.hero.ctaPrimary')}<Arrow /></a><p><span className="small-dot" />{t('enterprise.hero.note')}</p></div>
        </div>
        <Reveal delay={0.12} className="preview-wrap">
          <CertificateCard />
        </Reveal>
      </section>
      <div className="principle-strip"><div className="shell strip-inner">{['first', 'second', 'third'].map((key, idx) => <Reveal key={key} delay={idx * 0.08} className="strip-item"><Spark />{t(`strip.${key}`)}</Reveal>)}</div></div>
      <section className="pillars-section shell section-space" id="pillars" data-testid="enterprise-pillars" aria-labelledby="pillars-title">
        <Reveal className="section-heading"><p className="eyebrow">{t('enterprise.pillars.eyebrow')}</p><h2 id="pillars-title">{t('enterprise.pillars.title')}</h2><p className="section-intro">{t('enterprise.pillars.intro')}</p></Reveal>
        <div className="pillars-grid">
          {(['hire', 'upskill'] as const).map((key, index) => (
            <Reveal key={key} delay={index * 0.14} className="pillar-card card">
              <span className="badge pillar-tag">{t(`enterprise.pillars.${key}.tag`)}</span>
              <h3>{t(`enterprise.pillars.${key}.title`)}</h3>
              <p>{t(`enterprise.pillars.${key}.body`)}</p>
              <ul className="pillar-points">
                {(['point1', 'point2', 'point3'] as const).map(pt => (
                  <li key={pt}><span className="step-mark step-complete" aria-hidden="true">✓</span><span>{t(`enterprise.pillars.${key}.${pt}`)}</span></li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="verify-section shell section-space" id="verify" aria-labelledby="verify-title">
        <Reveal className="vision-panel">
          <div className="vision-copy">
            <p className="eyebrow">{t('enterprise.verify.eyebrow')}</p>
            <h2 id="verify-title">{t('enterprise.verify.title')}</h2>
            <p>{t('enterprise.verify.body')}</p>
            <ol className="verify-steps">
              {(['step1', 'step2', 'step3'] as const).map((st, idx) => (
                <li key={st}><span className="cert-step-num">{new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(idx + 1)}</span><span>{t(`enterprise.verify.${st}`)}</span></li>
              ))}
            </ol>
          </div>
          <div className="vision-art" aria-hidden="true">
            <motion.div className="art-ring ring-a" initial={false} animate={reduce ? {} : { scale: [1, 1.05, 1] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="art-ring ring-b" initial={false} animate={reduce ? {} : { scale: [1, 0.96, 1] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="art-ring ring-c" initial={false} animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="art-mark" initial={false} animate={reduce ? {} : { rotate: [-12, -6, -12], y: [-4, 4, -4] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}><Bolt /></motion.div>
            <Spark className="art-spark" />
            <div className="art-dot" />
          </div>
        </Reveal>
      </section>
      <section className="closing-section" aria-labelledby="ent-closing-title"><Reveal className="shell closing-inner"><span className="badge closing-badge"><span className="status-dot" />{t('enterprise.closing.badge')}</span><h2 id="ent-closing-title">{t('enterprise.closing.title')}</h2><p>{t('enterprise.closing.body')}</p><a className="btn closing-link" href={localizedPath(locale, base, 'home')}>{t('enterprise.closing.cta')}<Arrow /></a><Spark className="closing-spark" /></Reveal></section>
    </main>
  );
}
export default function Page() {
  const { t } = useTranslation();
  const { locale, page } = useData<Data>();
  const hydrated = useHydrated();
  const [menuOpen, setMenuOpen] = useState(false);
  const base = import.meta.env.BASE_URL;
  const homeUrl = localizedPath(locale, base, 'home');
  const entUrl = localizedPath(locale, base, 'enterprise');
  return <>
    <ScrollProgressBar />
    <a className="skip-link" href="#main">{t('a11y.skip')}</a>
    <div id="top" />
    <header className="site-header shell">
      <a href={homeUrl} className="brand-link" aria-label={t('nav.home')}><Wordmark /></a>
      <nav className="desktop-nav" aria-label={t('nav.explore')}>
        <a href={page === 'home' ? '#how-it-works' : `${homeUrl}#how-it-works`}>{t('nav.how')}</a>
        <a href={page === 'home' ? '#certificate' : `${homeUrl}#certificate`}>{t('nav.certificate')}</a>
        <a href={entUrl} data-testid="nav-enterprise" aria-current={page === 'enterprise' ? 'page' : undefined}>{t('nav.enterprise')}</a>
      </nav>
      <div className="header-actions"><LanguageSelect /><span className="badge launch-badge"><span className="status-dot" />{t('closing.badge')}</span><button disabled={!hydrated} className="btn btn-ghost mobile-menu" aria-label={t(menuOpen ? 'a11y.close' : 'a11y.menu')} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button></div>
    </header>
    {menuOpen && (
      <nav id="mobile-nav" className="mobile-nav shell" aria-label={t('nav.explore')}>
        <a href={page === 'home' ? '#how-it-works' : `${homeUrl}#how-it-works`} onClick={() => setMenuOpen(false)}>{t('nav.how')}<Arrow /></a>
        <a href={page === 'home' ? '#certificate' : `${homeUrl}#certificate`} onClick={() => setMenuOpen(false)}>{t('nav.certificate')}<Arrow /></a>
        <a href={entUrl} onClick={() => setMenuOpen(false)}>{t('nav.enterprise')}<Arrow /></a>
      </nav>
    )}
    {page === 'enterprise' ? <EnterpriseContent /> : <HomeContent />}
    <footer className="site-footer shell"><div className="footer-top"><a href={homeUrl} className="brand-link" aria-label={t('nav.home')}><Wordmark /></a><p>{t('footer.description')}</p><span className="footer-status"><span className="small-dot" />{t('footer.status')}</span></div><div className="footer-bottom"><span>© {new Intl.DateTimeFormat(locale, { year: 'numeric', timeZone: 'UTC' }).format(new Date('2026-01-01T00:00:00Z'))} hAIroMode</span><span>{t('footer.privacy')}</span></div></footer>
  </>;
}
