import { mkdir, readFile, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const families: Record<string, string> = { zh: 'sc', ar: 'arabic', hi: 'devanagari', bn: 'bengali', ta: 'tamil' };
await mkdir('public/fonts', { recursive: true });
for (const [locale, family] of Object.entries(families)) {
  const root = path.resolve(`node_modules/@fontsource/noto-sans-${family}`);
  await copyFile(path.join(root, 'LICENSE'), `public/fonts/noto-sans-${family}-LICENSE.txt`);
  let css = await readFile(path.join(root, '400.css'), 'utf8');
  const filenames = [...css.matchAll(/url\(\.\/files\/([^)]*)\)/g)].map(match => match[1]);
  for (const file of new Set(filenames)) await copyFile(path.join(root, 'files', file), path.join('public/fonts', file));
  css = css.replaceAll('./files/', './');
  await writeFile(`public/fonts/${locale}.css`, css);
}
for (const family of ['dm-sans', 'space-grotesk']) {
  await copyFile(`node_modules/@fontsource-variable/${family}/LICENSE`, `public/fonts/${family}-LICENSE.txt`);
}
console.log('Prepared self-hosted Noto fonts for zh, ar, hi, bn, ta; font licenses included.');
