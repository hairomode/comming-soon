import { directionFor, isLocale, type Locale } from './localization';

export type CourseKey = 'fundamentals' | 'machineLearning' | 'advanced';

export type CertificateRecord = {
  name: string;
  date: Partial<Record<Locale, string>> & { en: string };
  certId: string;
  verifyCode: string;
  courses: { key: CourseKey; count: number }[];
  badges: ('attendance')[];
};

export const SAMPLE_CERTIFICATE_ID = '847291';

export const CERTIFICATES: Record<string, CertificateRecord | undefined> = {
  [SAMPLE_CERTIFICATE_ID]: {
    name: 'Alex Rivera',
    date: {
      en: 'November 12, 2026',
      fr: '12 novembre 2026',
      de: '12. November 2026',
      es: '12 de noviembre de 2026',
      it: '12 novembre 2026',
      zh: '2026年11月12日',
      ar: '١٢ نوفمبر ٢٠٢٦',
      hi: '12 नवंबर 2026',
      bn: '১২ নভেম্বর ২০২৬',
      ta: '12 நவம்பர் 2026',
      'pt-BR': '12 de novembro de 2026',
      vi: 'Ngày 12 tháng 11 năm 2026',
      lo: '12 ພະຈິກ 2026',
      ja: '2026年11月12日',
    },
    certId: 'HM-2026-AR-030',
    verifyCode: '482 917',
    courses: [
      { key: 'fundamentals', count: 5 },
      { key: 'machineLearning', count: 10 },
      { key: 'advanced', count: 15 },
    ],
    badges: ['attendance'],
  },
};

export type VerifyMessages = {
  verified: string; title: string; subtitle: string; certifyThat: string; completed: string;
  pathsLabel: string; breakdown: string; badgesEarned: string; scanToVerify: string;
  codeLabel: string; dateLabel: string; idLabel: string; verifyLabel: string;
  courses: Record<CourseKey, string>;
  badges: Record<'attendance', string>;
  notFound: { title: string; body: string; hint: string };
};

const esc = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const BOLT = '<svg viewBox="0 0 32 40" fill="none" aria-hidden="true"><path d="M19 1 2 23h12l-3 16L30 15H17L19 1Z" fill="currentColor" /></svg>';
const WORDMARK = `<span class="wordmark cert-sheet-wordmark" dir="ltr"><span class="brand-symbol">${BOLT}</span><span>hAIro<span class="wordmark-light">Mode</span></span></span>`;
const FONT_LOCALES = ['zh', 'ar', 'hi', 'bn', 'ta'];

/** Path of the localized sample verification page. */
export function verifyPath(locale: Locale, base = '/', id = SAMPLE_CERTIFICATE_ID) {
  return `${base.replace(/\/$/, '')}/${locale}/v/${id}/`;
}

/** Parses `/<locale>/v/<id>/` into its parts, or returns null when it is not that shape. */
export function localeVerifyRoute(path: string): { locale: Locale; id: string } | null {
  const match = /^\/([^/]+)\/v\/([^/]+)\/?$/.exec(path);
  return match && isLocale(match[1]) ? { locale: match[1], id: match[2] } : null;
}

function documentShell(locale: Locale, base: string, title: string, body: string) {
  const fontLocale = FONT_LOCALES.includes(locale) ? locale : null;
  return `<html lang="${esc(locale)}" dir="${directionFor(locale)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#ffd166" />
  <meta name="robots" content="noindex" />
  <link rel="icon" href="${esc(base)}favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="${esc(base)}src/styles.css" />${fontLocale ? `
  <link rel="stylesheet" href="${esc(base)}fonts/${fontLocale}.css" />` : ''}
  <title>${esc(title)}</title>
</head>
<body>
${body}
</body>
</html>`;
}

export function renderNotFound(id: string, locale: Locale, base: string, m: VerifyMessages) {
  const body = `  <main class="verify-page">
    <article class="cert-sheet cert-sheet-compact">
      <div class="cert-sheet-logo">${WORDMARK}</div>
      <svg class="cert-notfound-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
        <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <h1 class="cert-title cert-title-sm">${esc(m.notFound.title)}</h1>
      <p class="cert-lead">${esc(m.notFound.body)} <code dir="ltr">${esc(id)}</code></p>
      <p class="cert-lead">${esc(m.notFound.hint)}</p>
      <div class="cert-accent-bar"></div>
    </article>
  </main>`;
  return documentShell(locale, base, `${m.notFound.title} | hAIroMode`, body);
}

export function renderCertificate(
  cert: CertificateRecord, id: string, locale: Locale, base: string, m: VerifyMessages,
) {
  const total = cert.courses.reduce((sum, c) => sum + c.count, 0);
  const date = cert.date[locale] || cert.date.en;
  const coursesHtml = cert.courses.map(c =>
    `<li><span class="cert-course-name">${esc(m.courses[c.key])}</span><span class="cert-course-count">${c.count}</span></li>`
  ).join('');
  const badgesHtml = cert.badges.map(b =>
    `<span class="verify-badge"><svg class="verify-badge-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 8.9l6.1-.8z"/></svg><span class="verify-badge-label">${esc(m.badges[b])}</span></span>`
  ).join('');

  const body = `  <main class="verify-page">
    <article class="cert-sheet">
      <p class="cert-verified-stamp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
          <path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        ${esc(m.verified)}
      </p>

      <div class="cert-sheet-logo">${WORDMARK}</div>

      <h1 class="cert-title">${esc(m.title)}</h1>
      <p class="cert-subtitle">${esc(m.subtitle)}</p>
      <div class="cert-rule"></div>

      <p class="cert-lead">${esc(m.certifyThat)}</p>
      <p class="cert-name">${esc(cert.name)}</p>
      <p class="cert-lead">${esc(m.completed)}</p>

      <p class="cert-total-num">${total}</p>
      <p class="cert-total-label">${esc(m.pathsLabel)}</p>

      <h2 class="cert-section">${esc(m.breakdown)}</h2>
      <ul class="cert-courses">${coursesHtml}</ul>

      <h2 class="cert-section">${esc(m.badgesEarned)}</h2>
      <div class="badge-list">${badgesHtml}</div>

      <div class="cert-sheet-footer">
        <div class="cert-qr-col">
          <img class="cert-qr-img" src="${esc(base)}cert-qr-847291.png" width="104" height="104" alt="${esc(m.scanToVerify)}" />
          <span class="cert-fine">${esc(m.scanToVerify)}</span>
        </div>
        <div class="cert-code-col">
          <span class="cert-code-box" dir="ltr">${esc(cert.verifyCode)}</span>
          <span class="cert-fine">${esc(m.codeLabel)}</span>
        </div>
        <div class="cert-meta-col">
          <span class="cert-fine">${esc(m.dateLabel)}: ${esc(date)}</span>
          <span class="cert-fine">${esc(m.idLabel)}: <span dir="ltr">${esc(cert.certId)}</span></span>
          <span class="cert-fine">${esc(m.verifyLabel)}: <span dir="ltr">ai.romode.me/v/${esc(id)}</span></span>
        </div>
      </div>

      <div class="cert-accent-bar"></div>
    </article>
  </main>`;
  return documentShell(locale, base, `${m.verified}: ${cert.name} | hAIroMode`, body);
}

/** Full document for a verification URL, localized. */
export function renderVerifyDocument(id: string, locale: Locale, base: string, m: VerifyMessages) {
  const cert = CERTIFICATES[id];
  return cert ? renderCertificate(cert, id, locale, base, m) : renderNotFound(id, locale, base, m);
}
