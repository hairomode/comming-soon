import { readFile, writeFile, access } from 'node:fs/promises';
import { locales } from '../src/localization';
const output = 'dist/client';
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const site = (process.env.VITE_SITE_URL || '').replace(/\/$/, '');
await writeFile(`${output}/.nojekyll`, '');
const fallback = (await readFile(`${output}/en/index.html`, 'utf8')).replace('<head>', '<head><meta name="robots" content="noindex">');
await writeFile(`${output}/404.html`, fallback);
for (const { code } of locales) {
  await access(`${output}/${code}/index.html`);
  await access(`${output}/${code}/enterprise/index.html`);
}
if (site) {
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  const homeAlts = locales.map(({ code }) => `<xhtml:link rel="alternate" hreflang="${code}" href="${escape(site)}/${code}/"/>`).join('');
  const entAlts = locales.map(({ code }) => `<xhtml:link rel="alternate" hreflang="${code}" href="${escape(site)}/${code}/enterprise/"/>`).join('');
  const homeUrls = locales.map(({ code }) => `<url><loc>${escape(site)}/${code}/</loc>${homeAlts}<xhtml:link rel="alternate" hreflang="x-default" href="${escape(site)}/"/></url>`).join('');
  const entUrls = locales.map(({ code }) => `<url><loc>${escape(site)}/${code}/enterprise/</loc>${entAlts}<xhtml:link rel="alternate" hreflang="x-default" href="${escape(site)}/enterprise/"/></url>`).join('');
  await writeFile(`${output}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${homeUrls}${entUrls}</urlset>`);
  await writeFile(`${output}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
} else {
  await writeFile(`${output}/robots.txt`, 'User-agent: *\nAllow: /\n');
  console.warn('VITE_SITE_URL not set: canonical/hreflang links are relative; sitemap is omitted. CI sets the real Pages URL.');
}
console.log(`Static site ready: ${locales.length} locales (home + enterprise), base ${base}.`);
