import { describe, expect, test } from 'bun:test';

describe('typography units', () => {
  test('font sizes use rem tokens without px values', async () => {
    const css = await Bun.file(new URL('../../src/styles.css', import.meta.url)).text();
    const declarations = [
      ...css.matchAll(/(?:font-size|--type-(?:caption|xs|sm|md|lg|display))\s*:\s*([^;}]+)/g),
    ].map(match => match[1].trim());

    expect(declarations.length).toBeGreaterThan(5);
    expect(declarations.some(value => value.includes('px'))).toBe(false);
    expect(css).toContain('--type-xs: 1rem');
  });
});