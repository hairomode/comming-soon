import type { PageContextServer } from 'vike/types';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';

// Mock certificate database
const CERTIFICATES: Record<string, {
  name: string;
  date: string;
  certId: string;
  verifyCode: string;
  courses: { category: string; count: number }[];
  badges: string[];
} | undefined> = {
  '847291': {
    name: 'Alex Rivera',
    date: 'November 12, 2026',
    certId: 'HM-2026-AR-030',
    verifyCode: '482 917',
    courses: [
      { category: 'AI Fundamentals', count: 5 },
      { category: 'Machine Learning', count: 10 },
      { category: 'Advanced AI Applications', count: 15 },
    ],
    badges: ['Attendance'],
  },
};

const BOLT = '<svg viewBox="0 0 32 40" fill="none" aria-hidden="true"><path d="M19 1 2 23h12l-3 16L30 15H17L19 1Z" fill="currentColor" /></svg>';
const WORDMARK = `<span class="wordmark cert-sheet-wordmark"><span class="brand-symbol">${BOLT}</span><span>hAIro<span class="wordmark-light">Mode</span></span></span>`;

export function onRenderHtml(pageContext: PageContextServer) {
  const { id } = pageContext.routeParams as { id: string };
  const cert = CERTIFICATES[id];
  const base = import.meta.env.BASE_URL || '/';

  const head = (title: string) => `
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#ffd166" />
  <meta name="robots" content="noindex" />
  <link rel="icon" href="${base}favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="${base}src/styles.css" />
  <title>${title}</title>`;

  if (!cert) {
    return escapeInject`<!DOCTYPE html>
<html lang="en">
<head>${dangerouslySkipEscape(head('Certificate Not Found | hAIroMode'))}
</head>
<body>
  <main class="verify-page">
    <article class="cert-sheet cert-sheet-compact">
      <div class="cert-sheet-logo">${dangerouslySkipEscape(WORDMARK)}</div>
      <svg class="cert-notfound-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
        <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <h1 class="cert-title cert-title-sm">Certificate Not Found</h1>
      <p class="cert-lead">No certificate exists with ID <code>${id}</code></p>
      <p class="cert-lead">Please check the QR code or URL and try again.</p>
      <div class="cert-accent-bar"></div>
    </article>
  </main>
</body>
</html>`;
  }

  const totalCourses = cert.courses.reduce((sum, c) => sum + c.count, 0);
  const coursesHtml = cert.courses.map(c =>
    `<li><span class="cert-course-name">${c.category}</span><span class="cert-course-count">${c.count}</span></li>`
  ).join('');
  const badgesHtml = cert.badges.map(b =>
    `<span class="verify-badge"><svg class="verify-badge-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 8.9l6.1-.8z"/></svg><span class="verify-badge-label">${b}</span></span>`
  ).join('');

  return escapeInject`<!DOCTYPE html>
<html lang="en">
<head>${dangerouslySkipEscape(head(`Verified: ${cert.name} | hAIroMode`))}
</head>
<body>
  <main class="verify-page">
    <article class="cert-sheet">
      <p class="cert-verified-stamp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
          <path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Verified
      </p>

      <div class="cert-sheet-logo">${dangerouslySkipEscape(WORDMARK)}</div>

      <h1 class="cert-title">Certificate of Achievement</h1>
      <p class="cert-subtitle">AI Learning Excellence Program</p>
      <div class="cert-rule"></div>

      <p class="cert-lead">This is to certify that</p>
      <p class="cert-name">${cert.name}</p>
      <p class="cert-lead">has successfully completed</p>

      <p class="cert-total-num">${String(totalCourses)}</p>
      <p class="cert-total-label">AI Learning Paths</p>

      <h2 class="cert-section">Course Breakdown</h2>
      <ul class="cert-courses">${dangerouslySkipEscape(coursesHtml)}</ul>

      <h2 class="cert-section">Badges Earned</h2>
      <div class="badge-list">${dangerouslySkipEscape(badgesHtml)}</div>

      <div class="cert-sheet-footer">
        <div class="cert-qr-col">
          <img class="cert-qr-img" src="${base}cert-qr-847291.png" width="104" height="104" alt="QR code linking to this verification page" />
          <span class="cert-fine">Scan to verify</span>
        </div>
        <div class="cert-code-col">
          <span class="cert-code-box">${cert.verifyCode}</span>
          <span class="cert-fine">Verification Code</span>
        </div>
        <div class="cert-meta-col">
          <span class="cert-fine">Date: ${cert.date}</span>
          <span class="cert-fine">Certificate ID: ${cert.certId}</span>
          <span class="cert-fine">Verify: ai.romode.me/v/${id}</span>
        </div>
      </div>

      <div class="cert-accent-bar"></div>
    </article>
  </main>
</body>
</html>`;
}
