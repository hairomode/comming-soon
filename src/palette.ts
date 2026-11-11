// TEMPORARY color exploration: every page load applies the next palette (round robin).
// Remove this file, its <script> in pages/+Head.tsx, <PaletteBadge /> in pages/+Layout.tsx,
// the `.palette-badge` CSS rule and tests/*/palette.* once a palette is chosen;
// then hardcode the chosen ink/accent/paper in the `:root` rule of src/styles.css.

export type Palette = { id: string; label: string; ink: string; accent: string; paper: string };

export const PALETTES: readonly Palette[] = [
  { id: 'forest', label: 'Forest + Lime', ink: '#203e2e', accent: '#d8f879', paper: '#f8f9f1' },
  { id: 'indigo', label: 'Indigo + Amber', ink: '#232a5c', accent: '#ffd166', paper: '#f9f8f3' },
  { id: 'plum', label: 'Plum + Pink', ink: '#3d1f47', accent: '#ffb3d9', paper: '#faf7f8' },
  { id: 'teal', label: 'Teal + Mint', ink: '#0f3d45', accent: '#9af2d6', paper: '#f5faf8' },
  { id: 'navy', label: 'Navy + Coral', ink: '#172a4f', accent: '#ffab91', paper: '#faf8f6' },
  { id: 'espresso', label: 'Espresso + Orange', ink: '#3b2418', accent: '#ffbf69', paper: '#faf7f2' },
  { id: 'graphite', label: 'Graphite + Lime', ink: '#25282c', accent: '#d8f879', paper: '#f7f8f4' },
  { id: 'indigo-jade', label: 'Indigo + Jade', ink: '#232a5c', accent: '#8de0bc', paper: '#f6f9f7' },
  { id: 'jade-amber', label: 'Jade + Amber', ink: '#12483b', accent: '#ffd166', paper: '#faf9f2' },
  { id: 'midnight-amber', label: 'Midnight + Amber', ink: '#182440', accent: '#ffd166', paper: '#f9f8f3' },
  { id: 'aubergine-amber', label: 'Aubergine + Amber', ink: '#402743', accent: '#ffd166', paper: '#faf7f4' },
  { id: 'indigo-apricot', label: 'Indigo + Apricot', ink: '#232a5c', accent: '#ffc499', paper: '#faf7f3' },
];

export const PALETTE_STORAGE_KEY = 'hairomode-palette-index';

export function applyPalette(root: HTMLElement, palette: Palette) {
  root.dataset.palette = palette.id;
  root.style.setProperty('--ink', palette.ink);
  root.style.setProperty('--lime', palette.accent);
  root.style.setProperty('--paper', palette.paper);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette.paper);
}

// Runs synchronously in <head> so the first paint already uses the selected palette.
// `?palette=<id>` pins a palette without advancing the rotation.
export const paletteBootScript = `(function(){var p=${JSON.stringify(PALETTES)},k=${JSON.stringify(PALETTE_STORAGE_KEY)},i=0;try{var q=new URLSearchParams(location.search).get('palette'),f=-1;for(var j=0;j<p.length;j++)if(p[j].id===q)f=j;if(f>-1)i=f;else{var n=parseInt(localStorage.getItem(k),10);i=isNaN(n)?0:(n+1)%p.length;localStorage.setItem(k,String(i))}}catch(e){}var r=document.documentElement,c=p[i];r.setAttribute('data-palette',c.id);r.style.setProperty('--ink',c.ink);r.style.setProperty('--lime',c.accent);r.style.setProperty('--paper',c.paper);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',c.paper)})();`;
