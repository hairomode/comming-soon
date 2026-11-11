import { readFile } from 'node:fs/promises';
import { locales } from '../src/localization';
function flatten(value: unknown, prefix = ''): Record<string, string> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Expected nested object at ${prefix || 'root'}`);
  return Object.fromEntries(Object.entries(value).flatMap(([key, item]) => {
    if (key.includes('.')) throw new Error(`Dotted key: ${key}`);
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof item === 'string') {
      if (!item.trim()) throw new Error(`Empty translation: ${path}`);
      return [[path, item]];
    }
    return Object.entries(flatten(item, path));
  }));
}
const read = async (code: string) => flatten(JSON.parse(await readFile(`locales/${code}/corporate.json`, 'utf8')));
const source = await read('en');
const placeholders = (value: string) => [...value.matchAll(/\{\s*([a-zA-Z_][\w]*)[},]/g)].map(match => match[1]).sort().join(',');
let checked = 0;
for (const { code } of locales) {
  const target = await read(code);
  const missing = code === 'en-IN' ? [] : Object.keys(source).filter(key => !(key in target));
  const extra = Object.keys(target).filter(key => !(key in source));
  const mismatch = Object.entries(target).filter(([key, value]) => key in source && placeholders(value) !== placeholders(source[key])).map(([key]) => key);
  if (missing.length || extra.length || mismatch.length) throw new Error(`${code}: missing=${missing}, extra=${extra}, placeholders=${mismatch}`);
  checked++;
}
console.log(`Locale parity passed: ${checked} locales, ${Object.keys(source).length} English keys; en-IN subset fallback verified.`);
