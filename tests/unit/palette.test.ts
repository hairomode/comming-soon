import { describe, expect, test } from 'bun:test';

describe('chosen brand colors', () => {
  test('defines Indigo, Amber and contrast-safe Jade defaults', async () => {
    const css = await Bun.file(new URL('../../src/styles.css', import.meta.url)).text();
    expect(css).toContain('--ink: #232a5c');
    expect(css).toContain('--amber: #ffd166');
    expect(css).toContain('--paper: #f9f8f3');
    expect(css).toContain('--jade: #12483b');
    expect(css).toContain('--jade-light: #8de0bc');
    expect(css).not.toContain('--lime');
    expect(css).not.toContain('.palette-badge');
  });

  test('removes temporary palette scripts and controls from the document', async () => {
    const head = await Bun.file(new URL('../../pages/+Head.tsx', import.meta.url)).text();
    const layout = await Bun.file(new URL('../../pages/+Layout.tsx', import.meta.url)).text();
    expect(head).not.toContain('paletteBootScript');
    expect(head).toContain('#f9f8f3');
    expect(layout).not.toContain('PaletteBadge');
    expect(layout).not.toContain('PALETTE_STORAGE_KEY');
  });
});
