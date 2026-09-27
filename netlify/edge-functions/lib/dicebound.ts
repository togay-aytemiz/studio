import type { Context } from '@netlify/edge-functions';
import manifest from '../../../sites/dicebound/package-manifest.json' with { type: 'json' };

export const DICEBOUND_HOST = 'dicebound.agens.studio';
export const DICEBOUND_ROOT = '/_sites/dicebound';
const files = new Set(manifest.files
  .filter(({ path }) => path.startsWith('public/') && !['public/_headers', 'public/.htaccess'].includes(path))
  .map(({ path }) => `/${path.slice('public/'.length)}`));
const policy = "default-src 'self'; script-src 'none'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

function publicLinks(html: string) {
  // Netlify Pretty URLs rewrites relative anchors at build time using the storage
  // directory. Restore only registered product destinations on the public host.
  return html.replace(/\bhref=(['"])(\/_sites\/dicebound\/[^'"\s]*)\1/g, (attribute, quote, value) => {
    const link = new URL(value, `https://${DICEBOUND_HOST}`);
    let path = link.pathname.slice(DICEBOUND_ROOT.length);
    const file = path.endsWith('/') ? `${path}index.html` : files.has(path) ? path : `${path}.html`;
    if (!files.has(file)) return attribute;
    path = file.endsWith('/index.html') ? file.slice(0, -10) : file;
    return `href=${quote}${path}${link.search}${link.hash}${quote}`;
  });
}

function responseHeaders(response: Response, pathname: string, internal = false) {
  const headers = new Headers(response.headers);
  // These filenames are stable; never inherit the agency's year-long immutable cache.
  headers.set('Cache-Control', pathname.startsWith('/assets/') ? 'public, max-age=3600' : 'public, max-age=0, must-revalidate');
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('Netlify-CDN-Cache-Control');
  headers.delete('CDN-Cache-Control');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Content-Security-Policy', policy);
  if (internal || pathname === '/404.html') headers.set('X-Robots-Tag', 'noindex');
  if (pathname.startsWith('/config/')) {
    headers.set('Cache-Control', 'no-store');
    headers.set('Netlify-CDN-Cache-Control', 'no-store');
    headers.set('CDN-Cache-Control', 'no-store');
    headers.set('X-Robots-Tag', 'noindex');
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }
  return headers;
}

export async function serveDicebound(request: Request, context: Context): Promise<Response | undefined> {
  const url = new URL(request.url);
  // Internal static fetches must bypass both host routing and the agency canonical rewriter.
  if (url.pathname.startsWith(`${DICEBOUND_ROOT}/`)) {
    const pathname = url.pathname.slice(DICEBOUND_ROOT.length);
    if (!files.has(pathname)) return new Response('Not found', { status: 404 });
    const response = await context.next();
    return new Response(response.body, { status: response.status, headers: responseHeaders(response, pathname, true) });
  }
  if (url.hostname !== DICEBOUND_HOST) return undefined;
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' } });
  }
  if (url.pathname === '/tr') {
    url.pathname = '/tr/';
    return Response.redirect(url, 308);
  }
  const pathname = url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname;
  const exists = files.has(pathname);
  const target = exists ? pathname : '/404.html';
  // Fetch only a known, same-site static file; unknown URLs never reach the agency SPA.
  const response = await fetch(new URL(`${DICEBOUND_ROOT}${target}`, url), { redirect: 'manual' });
  const wrongPolicyType = target.startsWith('/config/') && !response.headers.get('Content-Type')?.includes('application/json');
  if (response.status !== 200 || wrongPolicyType) {
    return new Response('Dicebound is temporarily unavailable.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
  const headers = responseHeaders(response, target);
  if (exists && pathname !== '/404.html' && !pathname.startsWith('/config/')) headers.delete('X-Robots-Tag');
  const body = request.method === 'HEAD' ? null : target.endsWith('.html') ? publicLinks(await response.text()) : response.body;
  return new Response(body, { status: exists && target !== '/404.html' ? 200 : 404, headers });
}
