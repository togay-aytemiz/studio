# Dicebound — Agens repo integration

The founder-approved EN/TR website is now part of this repository. Its design, Agens Studio product footer, all eight pages, original artwork and inactive update rule are preserved byte-for-byte from Dicebound commit `7cb70478f` (header V04). This is a product site with an approved custom layout; the agency React layout/CTA is not injected into it.

## Ownership and build

- Edit the canonical site files here: `public/_sites/dicebound/`.
- Vite copies them unchanged into `dist/_sites/dicebound/` during the existing `npm run build`. Agency prerendering remains unchanged.
- `netlify/edge-functions/inject-canonical.ts` invokes `lib/dicebound.ts` before agency SEO rewriting. Only hostname `dicebound.agens.studio` is routed to the product. Agens, `tryon`, `vto` and `/validate` keep their existing owners.
- Same Netlify site and deployment; no React wrapper, iframe, extra site build, tracking script or external font.
- Static internal paths bypass the agency canonical/language transform. Public unknown paths return the Dicebound 404 with HTTP404. Internal file URLs are `noindex`.
- Netlify production Pretty URLs rewrites relative anchors to the internal storage directory. The product edge response restores registered destinations to public URLs, including `.html` policy/support pages. Source files and artwork remain unchanged.
- `package-manifest.json` preserves the imported package's hashes and also defines the allowed public file set. After intentional site changes, update its `public/` entries' hashes/size; register new files there. Non-public entries document the original transfer package and are not served.
- `asset-provenance.json` retains original art/font provenance. `SOURCE-README.md` is the original portable-package guidance; this document owns integration in the Agens repository.

## Local verification

Use Node24+ for the TypeScript-importing verification script:

```sh
npm ci
npm run build
node scripts/check-dicebound.mjs
netlify dev --offline --framework '#static' --dir dist --port 8891 --no-open
# In another terminal:
node scripts/check-dicebound.mjs http://127.0.0.1:8891
```

The HTTP check supplies the Dicebound Host header to exercise the actual local Netlify edge chain. Browsing `localhost:8891` normally shows Agens. For a direct visual-only preview without edge routing:

```sh
python3 -m http.server 8831 --bind 127.0.0.1 --directory public/_sites/dicebound
```

Open `http://127.0.0.1:8831/tr/`. This simple preview does not certify Netlify headers; use the HTTP check above for those.

## Production activation — not performed by this change

1. Review and merge `codex/dicebound-site` into the Netlify production branch.
2. Add `dicebound.agens.studio` as a domain alias on the existing Agens Netlify site. Configure DNS as instructed by that site's domain panel, and ensure HTTPS is issued. Repository routing alone cannot create DNS or the alias. Do not enable an alias-to-primary-domain redirect for this hostname.
3. Verify the live EN `/`, TR `/tr/`, both privacy/support/contact pages, images/fonts, unknown-path404 and `/config/ios.json` response. Ensure host-level snippet/analytics injection and bot challenges do not alter this static product or its JSON.
4. Keep the app update rule inactive until the real Store listing exists. The current JSON has an empty `applicationId` and cannot force an update. Game configuration remains in the game repo.

Future Store URLs: `https://dicebound.agens.studio/privacy.html` and `https://dicebound.agens.studio/support.html` (TR equivalents under `/tr/`). Support email remains `hello@agens.studio`.

Header handling follows [Netlify's Edge Functions API](https://docs.netlify.com/build/edge-functions/api/): same-site fetches retrieve known static files; responses apply the product CSP and preserve canonical/language metadata. The JSON is `application/json`, `no-store`, `noindex`; stable artwork filenames use one-hour caching, never the agency's immutable year-long policy.
