# Integration verification — 2026-09-27

- `npm ci --no-audit --no-fund`: PASS, lockfile unchanged.
- `npm run build`: PASS; Vite build plus all four existing agency prerender routes. Existing >500kB bundle-size advisory remains unrelated.
- `node scripts/check-dicebound.mjs http://127.0.0.1:8891`: PASS against actual Netlify Dev edge chain. All32 imported public payloads match approved source hashes, host routing is isolated, EN/TR canonical/language metadata stays intact, unknown paths return404, HEAD/405 and missing-policy503 behave correctly. A200HTML SPA fallback is rejected for the JSON policy.
- Policy: application/json, Cache-Control:no-store, X-Robots-Tag:noindex, applicationId still empty. No game configuration or minimum-version activation changed.
- Browser smoke: actual hostname resolution to local Netlify, EN1440×1000 and TR390×844; JavaScript disabled for product pages; every image/font loaded, privacy links and language switch passed. Agency and TryOn React routes render with JavaScript enabled. See `browser.json` and two captures.
- Art impact: NOT REQUIRED — transport-only integration; all32 approved public files are byte-identical. No new visual or gameplay work; product's existing approved Agens Studio footer remains intact.
- Production Netlify domain alias, DNS, certificate, deployed commit and live headers were not changed or certified. See integration README for activation.

## Production activation follow-up — 2026-09-28

- Founder saved the Netlify alias, Cloudflare DNS-only CNAME and certificate renewal, then merged PR #1. Netlify published main `a115e5b`; HTTPS, EN/TR pages, inactive JSON/no-store and real404 verified at the public hostname.
- Live verification found Netlify Pretty URLs rewriting page anchors to `/_sites/dicebound/` paths. The edge now restores only registered product links to public routes; it preserves query strings/fragments and leaves external links unchanged. A regression fixture covers the production transformation absent from Netlify Dev.
- `node scripts/check-dicebound.mjs` and `npm run build`: PASS after the correction. All32 imported source files retain their approved hashes; all23 non-HTML live payloads match their hashes. Live HTML navigation requires the follow-up deployment.
- Art impact: NOT REQUIRED — URL restoration only, no artwork, layout, copy or gameplay changes.
