# Integration verification — 2026-09-27

- `npm ci --no-audit --no-fund`: PASS, lockfile unchanged.
- `npm run build`: PASS; Vite build plus all four existing agency prerender routes. Existing >500kB bundle-size advisory remains unrelated.
- `node scripts/check-dicebound.mjs http://127.0.0.1:8891`: PASS against actual Netlify Dev edge chain. All32 imported public payloads match approved source hashes, host routing is isolated, EN/TR canonical/language metadata stays intact, unknown paths return404, HEAD/405 and missing-policy503 behave correctly. A200HTML SPA fallback is rejected for the JSON policy.
- Policy: application/json, Cache-Control:no-store, X-Robots-Tag:noindex, applicationId still empty. No game configuration or minimum-version activation changed.
- Browser smoke: actual hostname resolution to local Netlify, EN1440×1000 and TR390×844; JavaScript disabled for product pages; every image/font loaded, privacy links and language switch passed. Agency and TryOn React routes render with JavaScript enabled. See `browser.json` and two captures.
- Art impact: NOT REQUIRED — transport-only integration; all32 approved public files are byte-identical. No new visual or gameplay work; product's existing approved Agens Studio footer remains intact.
- Production Netlify domain alias, DNS, certificate, deployed commit and live headers were not changed or certified. See integration README for activation.
