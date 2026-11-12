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
    badges: ['Assiduité'],
  },
};

export function onRenderHtml(pageContext: PageContextServer) {
  const { id } = pageContext.routeParams as { id: string };
  const cert = CERTIFICATES[id];
  const base = import.meta.env.BASE_URL || '/';

  if (!cert) {
    return escapeInject`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#f9f8f3" />
  <meta name="robots" content="noindex" />
  <link rel="icon" href="${base}favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="${base}src/styles.css" />
  <title>Certificate Not Found | hAIroMode</title>
</head>
<body>
  <main class="shell verify-page">
    <div class="verify-card verify-not-found">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
        <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <h1>Certificate Not Found</h1>
      <p>No certificate exists with ID: <code>${id}</code></p>
      <p class="verify-hint">Please check the QR code or URL and try again.</p>
    </div>
  </main>
</body>
</html>`;
  }

  const totalCourses = cert.courses.reduce((sum, c) => sum + c.count, 0);
  const coursesHtml = cert.courses.map(c => 
    `<li><span class="course-name">${c.category}</span><span class="course-count">${c.count}</span></li>`
  ).join('');
  const badgesHtml = cert.badges.map(b => 
    `<span class="verify-badge">${b}</span>`
  ).join('');

  return escapeInject`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#f9f8f3" />
  <meta name="robots" content="noindex" />
  <link rel="icon" href="${base}favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="${base}src/styles.css" />
  <title>Verified: ${cert.name} | hAIroMode</title>
</head>
<body>
  <main class="shell verify-page">
    <div class="verify-card">
      <div class="verify-status">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
          <path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Verified Certificate</span>
      </div>

      <h1>${cert.name}</h1>
      
      <dl class="verify-details">
        <div>
          <dt>Certificate ID</dt>
          <dd>${cert.certId}</dd>
        </div>
        <div>
          <dt>Verification Code</dt>
          <dd class="verify-code">${cert.verifyCode}</dd>
        </div>
        <div>
          <dt>Date Issued</dt>
          <dd>${cert.date}</dd>
        </div>
        <div>
          <dt>Total Courses</dt>
          <dd><strong>${String(totalCourses)}</strong> AI Learning Paths</dd>
        </div>
      </dl>

      <section class="verify-courses">
        <h2>Course Breakdown</h2>
        <ul>${dangerouslySkipEscape(coursesHtml)}</ul>
      </section>

      <section class="verify-badges">
        <h2>Badges Earned</h2>
        <div class="badge-list">${dangerouslySkipEscape(badgesHtml)}</div>
      </section>

      <p class="verify-footer">
        This certificate was issued by hAIroMode AI Learning Excellence Program.
      </p>
    </div>
  </main>
</body>
</html>`;
}
