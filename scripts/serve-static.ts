import path from 'node:path';
const root = path.resolve('dist/client');
const base = (process.env.TEST_BASE_PATH || '/').replace(/\/?$/, '/');
Bun.serve({
  hostname: '0.0.0.0',
  port: Number(process.env.PORT || 3000),
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/' && base !== '/') return Response.redirect(new URL(base, url).href);
    if (!url.pathname.startsWith(base)) return new Response('Not found', { status: 404 });
    let relative: string;
    try { relative = decodeURIComponent(url.pathname.slice(base.length)); } catch { return new Response('Bad request', { status: 400 }); }
    const candidate = path.resolve(root, relative + (url.pathname.endsWith('/') ? 'index.html' : ''));
    if (!candidate.startsWith(root + path.sep) && candidate !== root) return new Response('Forbidden', { status: 403 });
    const file = Bun.file(candidate);
    return await file.exists() ? new Response(file) : new Response('Not found', { status: 404 });
  },
});
console.log(`Static Pages artifact at http://localhost:${process.env.PORT || 3000}${base}`);
