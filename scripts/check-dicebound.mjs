// Protect host routing, preserved product HTML, and the public update policy response.
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import handler from '../netlify/edge-functions/inject-canonical.ts';
import manifest from '../sites/dicebound/package-manifest.json' with { type: 'json' };

const root = new URL('../public/_sites/dicebound/', import.meta.url);
const mime = { html: 'text/html', css: 'text/css', json: 'application/json', svg: 'image/svg+xml', webp: 'image/webp', png: 'image/png', ttf: 'font/ttf', txt: 'text/plain', xml: 'application/xml' };
const agencyHTML = '<html lang="tr"><head><link rel="canonical" href="https://www.agens.studio"/></head><body>Agency / TryOn</body></html>';
let staticReads = 0;
async function invoke(url, method = 'GET') {
  const request = new Request(url, { method });
  return handler(request, { next: async () => {
    const path = new URL(url).pathname;
    if (!path.startsWith('/_sites/dicebound/')) return new Response(agencyHTML, { headers: { 'content-type': 'text/html' } });
    staticReads++;
    const file = path.slice('/_sites/dicebound/'.length);
    return new Response(await readFile(new URL(file, root)), { headers: { 'content-type': mime[file.split('.').pop()] || 'application/octet-stream', 'cache-control': 'public, max-age=31536000, immutable' } });
  } });
}
const realFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  assert.equal(new URL(url).hostname, 'dicebound.agens.studio');
  assert.match(new URL(url).pathname, /^\/_sites\/dicebound\//);
  return invoke(url);
};
try {
  const files = manifest.files.filter(f => f.path.startsWith('public/') && !['public/_headers', 'public/.htaccess'].includes(f.path));
  for (const file of files) {
    const relative = file.path.slice(7);
    const payload = await readFile(new URL(relative, root));
    assert.equal(createHash('sha256').update(payload).digest('hex'), file.sha256, relative);
    const response = await invoke(`https://dicebound.agens.studio/${relative}`);
    assert.equal(response.status, relative === '404.html' ? 404 : 200, relative);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), payload, relative);
    assert.doesNotMatch(response.headers.get('cache-control'), /immutable/);
  }
  for (const [path, lang] of [['/', 'en'], ['/tr/', 'tr'], ['/privacy.html', 'en'], ['/tr/privacy.html', 'tr']]) {
    const response = await invoke(`https://dicebound.agens.studio${path}`);
    const html = await response.text();
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.match(html, /rel="canonical" href="https:\/\/dicebound\.agens\.studio/);
    assert.equal(response.headers.get('x-robots-tag'), null);
    assert.match(response.headers.get('content-security-policy'), /script-src 'none'/);
  }
  const policy = await invoke('https://dicebound.agens.studio/config/ios.json?fresh=1');
  assert.equal(policy.headers.get('cache-control'), 'no-store');
  assert.equal(policy.headers.get('netlify-cdn-cache-control'), 'no-store');
  assert.equal(policy.headers.get('x-robots-tag'), 'noindex');
  assert.match(policy.headers.get('content-type'), /application\/json/);
  assert.equal((await policy.json()).applicationId, '');
  for (const path of ['/missing', '/assets/missing.js', '/config/missing.json', '/validate', '/_sites/dicebound/missing']) {
    assert.equal((await invoke(`https://dicebound.agens.studio${path}`)).status, 404, path);
  }
  const redirect = await invoke('https://dicebound.agens.studio/tr?x=1');
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('location'), 'https://dicebound.agens.studio/tr/?x=1');
  const head = await invoke('https://dicebound.agens.studio/', 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await invoke('https://dicebound.agens.studio/', 'POST')).status, 405);
  for (const host of ['agens.studio', 'www.agens.studio', 'tryon.agens.studio', 'vto.agens.studio', 'unrelated.example']) {
    const before = staticReads;
    assert.match(await (await invoke(`https://${host}/en/validate`)).text(), /Agency \/ TryOn/);
    assert.equal(staticReads, before, host);
  }
  // Verify that a broken/missing deployment cannot masquerade as a successful policy/page.
  globalThis.fetch = async () => new Response('missing', { status: 404 });
  assert.equal((await invoke('https://dicebound.agens.studio/config/ios.json')).status, 503);
  globalThis.fetch = async () => new Response(agencyHTML, { headers: { 'content-type': 'text/html' } });
  assert.equal((await invoke('https://dicebound.agens.studio/config/ios.json')).status, 503);
  console.log(`PASS: ${files.length} imported files hash-identical; host isolation, EN/TR canonicals, 404, HEAD, policy no-store, inactive rule, unavailable origin.`);
} finally { globalThis.fetch = realFetch; }

// Optional real Netlify Dev smoke: node scripts/check-dicebound.mjs http://127.0.0.1:8891
if (process.argv[2]) {
  const origin = new URL(process.argv[2]);
  // Node fetch rewrites Host; use the HTTP client to test real virtual-host routing.
  const hostFetch = (path, options = {}, host = 'dicebound.agens.studio') => new Promise((resolve, reject) => {
    const client = origin.protocol === 'https:' ? https : http;
    const req = client.request(new URL(path, origin), { ...options, headers: { Host: host } }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(new Response(Buffer.concat(chunks), { status: res.statusCode, headers: Object.fromEntries(Object.entries(res.headers).filter(([,v]) => typeof v === 'string')) })));
      res.on('error', reject);
    });
    req.setTimeout(20000, () => req.destroy(new Error('HTTP smoke timed out')));
    req.on('error', reject); req.end();
  });
  const files = manifest.files.filter(f => f.path.startsWith('public/') && !['public/_headers', 'public/.htaccess'].includes(f.path));
  for (const file of files) {
    const relative = file.path.slice(7);
    const response = await hostFetch(`/${relative}`);
    assert.equal(response.status, relative === '404.html' ? 404 : 200, relative);
    const body = Buffer.from(await response.arrayBuffer());
    assert.equal(createHash('sha256').update(body).digest('hex'), file.sha256, relative);
  }
  for (const [path, lang] of [['/', 'en'], ['/tr/', 'tr']]) {
    const response = await hostFetch(path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(`<html lang="${lang}"`));
    assert.equal(response.headers.get('x-robots-tag'), null);
  }
  const policy = await hostFetch('/config/ios.json');
  assert.equal(policy.headers.get('cache-control'), 'no-store');
  assert.equal(policy.headers.get('x-robots-tag'), 'noindex');
  assert.match(policy.headers.get('content-type'), /application\/json/);
  assert.equal((await policy.json()).applicationId, '');
  assert.equal((await hostFetch('/unknown')).status, 404);
  assert.equal((await hostFetch('/assets/unknown.webp')).status, 404);
  assert.equal((await hostFetch('/tr')).status, 308);
  assert.equal(await (await hostFetch('/', { method: 'HEAD' })).text(), '');
  assert.equal((await hostFetch('/', { method: 'POST' })).status, 405);
  for (const host of ['www.agens.studio', 'tryon.agens.studio', 'vto.agens.studio']) {
    const response = await hostFetch('/', {}, host);
    assert.equal(response.status, 200);
    assert.doesNotMatch(await response.text(), /class="hero hero-scene"/);
  }
  console.log('PASS: actual Netlify Dev HTTP routing, 32 unchanged payloads, JSON headers, locales, real 404, methods and agency/TryOn isolation.');
}
