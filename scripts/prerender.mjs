import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

const routes = [
  { path: '/', canonical: 'https://www.agens.studio' },
  { path: '/validate', canonical: 'https://www.agens.studio/validate' },
  { path: '/en', canonical: 'https://www.agens.studio/en' },
  { path: '/en/validate', canonical: 'https://www.agens.studio/en/validate' }
];

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const ensureDoctype = (html) => {
  const trimmed = html.trimStart().toLowerCase();
  if (trimmed.startsWith('<!doctype')) {
    return html;
  }
  return `<!DOCTYPE html>\n${html}`;
};

const toOutputPath = (routePath) => {
  if (routePath === '/') {
    return path.join(distDir, 'index.html');
  }
  const normalized = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  return path.join(distDir, normalized, 'index.html');
};

const startServer = async () => {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost');
      let pathname = decodeURIComponent(url.pathname || '/');
      if (!pathname.startsWith('/')) {
        pathname = `/${pathname}`;
      }

      let filePath = path.join(distDir, pathname);
      if (pathname.endsWith('/')) {
        filePath = path.join(distDir, pathname, 'index.html');
      } else if (!path.extname(filePath)) {
        filePath = path.join(distDir, 'index.html');
      }

      filePath = path.normalize(filePath);
      if (!filePath.startsWith(distDir)) {
        filePath = path.join(distDir, 'index.html');
      }

      let stats = null;
      try {
        stats = await stat(filePath);
      } catch {
        stats = null;
      }

      if (!stats || stats.isDirectory()) {
        filePath = path.join(distDir, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const data = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Prerender server error.');
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 4173;
  return { server, port };
};

const renderRoute = async (page, baseUrl, route) => {
  const url = `${baseUrl}${route.path}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    (expected) => {
      const canonical = document.querySelector('link[rel="canonical"]');
      return canonical?.getAttribute('href') === expected;
    },
    { timeout: 15000 },
    route.canonical
  );
  await page.waitForFunction(() => {
    const ogImage = document.querySelector('meta[property="og:image"]');
    return Boolean(ogImage?.getAttribute('content'));
  }, { timeout: 15000 });

  const html = ensureDoctype(await page.content());
  const outputPath = toOutputPath(route.path);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
  console.log(`prerendered ${route.path} -> ${path.relative(distDir, outputPath)}`);
};

const main = async () => {
  const indexPath = path.join(distDir, 'index.html');
  await stat(indexPath);

  let server;
  let browser;
  try {
    const serverInfo = await startServer();
    server = serverInfo.server;
    const baseUrl = `http://127.0.0.1:${serverInfo.port}`;

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    for (const route of routes) {
      await renderRoute(page, baseUrl, route);
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
};

main().catch((error) => {
  console.error('prerender failed:', error);
  process.exitCode = 1;
});
