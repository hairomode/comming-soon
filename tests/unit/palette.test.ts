import { describe, expect, test } from 'bun:test';
import { PALETTES, paletteBootScript } from '../../src/palette';

describe('palette test rotation', () => {
  test('starts with the current forest green and defines unique two-color palettes', () => {
    expect(PALETTES[0]).toMatchObject({ id: 'forest', ink: '#203e2e', accent: '#d8f879', paper: '#f8f9f1' });
    expect(PALETTES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(PALETTES.map(palette => palette.id)).size).toBe(PALETTES.length);
    for (const palette of PALETTES) {
      for (const color of [palette.ink, palette.accent, palette.paper]) expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  test('includes more indigo, jade and amber combinations without removing the originals', () => {
    expect(PALETTES).toHaveLength(12);
    for (const id of ['indigo-jade', 'jade-amber', 'midnight-amber', 'aubergine-amber', 'indigo-apricot']) {
      expect(PALETTES.some(palette => palette.id === id)).toBe(true);
    }
    expect(PALETTES.find(palette => palette.id === 'indigo')).toMatchObject({ ink: '#232a5c', accent: '#ffd166' });
  });

  test('boot script embeds every palette', () => {
    for (const palette of PALETTES) expect(paletteBootScript).toContain(palette.id);
  });

  test('stylesheet has no hardcoded brand greens outside the palette defaults', async () => {
    const css = await Bun.file(new URL('../../src/styles.css', import.meta.url)).text();
    const outsideTheme = css.replace(/@plugin 'daisyui\/theme' \{[\s\S]*?\n\}/, '');
    const hexes = [...outsideTheme.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(match => match[0].toLowerCase());
    const allowed = new Set(['#203e2e', '#d8f879', '#f8f9f1', '#fff', '#000', '#a33432', '#e8a58b']);
    expect(hexes.filter(hex => !allowed.has(hex))).toEqual([]);
  });
});
