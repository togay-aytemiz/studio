# PageSpeed Optimization Plan

## Baseline (Mobile, Lighthouse)
- Performance: 69
- Accessibility: 83
- Best Practices: 100
- SEO: 92
- FCP: 4.0s
- LCP: 5.1s
- Speed Index: 5.8s
- TBT: 0ms
- CLS: 0.007

## Targets
- LCP < 2.5s, FCP < 1.8s, Speed Index < 3.4s
- CLS < 0.1, TBT < 200ms
- Performance score 85+

## P0 (0-3 days) - Highest Impact
1) LCP hero image priority
   - `components/Hero.tsx`: set `fetchpriority="high"`, `loading="eager"`, `decoding="async"` on the hero image.
   - `index.html`: add `rel="preload"` for `/herobg.webp` and `/herobg-mobile.webp` with `imagesrcset`.
   - `public/herobg.webp` and `public/herobg-mobile.webp`: re-check compression and dimensions; ensure no oversized assets.

2) Reduce render-blocking on first paint
   - Remove or delay blur/filter animations in hero on initial load (`components/Hero.tsx`).
   - Add `preconnect` / `dns-prefetch` for third-party domains used on first paint (ex: `https://cdn.jsdelivr.net`).

3) Image lazy-loading for below-the-fold sections
   - `components/Contact.tsx`, `components/Process.tsx`, `pages/ValidatePage.tsx`: background images currently load immediately; lazy-load them with IntersectionObserver or switch to `<img loading="lazy">` when possible.
   - `components/FounderMessage.tsx`: ensure portrait images use `loading="lazy"` and `decoding="async"`.

4) Accessibility quick fixes (affects Lighthouse)
   - `components/Navbar.tsx`: add `aria-label` and `aria-expanded` to the mobile menu button.
   - `components/Footer.tsx`: add `aria-label` for icon-only social links.
   - Verify contrast for `text-slate-400` on dark backgrounds and ensure heading order is sequential.

5) robots.txt + cache headers
   - Add `public/robots.txt` (valid syntax, allow crawl).
   - `netlify.toml`: add caching headers for static assets (long cache with immutable).

## P1 (1-2 weeks) - Bundle + CPU Optimizations
1) Code splitting and lazy load
   - Lazy load below-the-fold sections and heavy views with `React.lazy` + `Suspense`.
   - `pages/ValidatePage.tsx`: load on-demand (route-based split).

2) Reduce unused JS
   - Move email logic fully behind the Netlify function (`netlify/functions/send-email.ts`) and keep client payload minimal.
   - Audit dependencies not needed on the client; ensure `@google/genai` is not bundled into the main app.

3) Animation and DOM size
   - Replace non-composited animations (blur/filter) with `opacity` and `transform`.
   - `components/TechStack.tsx`: reduce marquee duplication from 4x to 2x or use CSS keyframes to shrink DOM.
   - Add `prefers-reduced-motion` handling for low-end devices.

4) Third-party assets
   - Self-host tech logos or bundle as SVG sprite; add caching headers if kept on CDN.

## P2 (2-4 weeks) - Structural Improvements
- Add a build-time image pipeline (sharp/imagetools) for consistent resizing and compression.
- Enable real-user monitoring for Web Vitals and track LCP/CLS in production.
- Confirm static HTML is served from CDN edge with low TTFB.

## Validation Checklist
- Run Lighthouse in production build (`npm run build` + `npm run preview`).
- Confirm the LCP element is the hero image and loads within 2.5s on mobile.
- Verify no regressions in CLS or accessibility warnings.
- Re-check "Render blocking requests" and "Unused JS" after changes.
