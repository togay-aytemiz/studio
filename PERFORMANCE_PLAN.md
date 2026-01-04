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
   - [x] `components/Hero.tsx`: set `fetchPriority="high"`, `loading="eager"`, `decoding="async"` on the hero image.
   - [x] `index.html`: add `rel="preload"` for `/herobg.webp` and `/herobg-mobile.webp` with breakpoint media.
   - [ ] `public/herobg.webp` and `public/herobg-mobile.webp`: re-check compression and dimensions; ensure no oversized assets.

2) Reduce render-blocking on first paint
   - [x] Remove blur/filter animations in hero on initial load (`components/Hero.tsx`).
   - [x] Add `preconnect` / `dns-prefetch` for third-party domains used on first paint (ex: `https://cdn.jsdelivr.net`) in `index.html`.

3) Image lazy-loading for below-the-fold sections
   - [x] `components/Contact.tsx`, `components/Process.tsx`, `pages/ValidatePage.tsx`: background images lazy-load via IntersectionObserver hook.
   - [x] `components/FounderMessage.tsx`: portrait images use `loading="lazy"` + `decoding="async"`.

4) Accessibility quick fixes (affects Lighthouse)
   - [x] `components/Navbar.tsx`: add `aria-label`, `aria-expanded`, `aria-controls` to the mobile menu button.
   - [x] `components/Footer.tsx`: add `aria-label` for icon-only social links.
   - [ ] Verify contrast for `text-slate-400` on dark backgrounds and ensure heading order is sequential.

5) robots.txt + cache headers
   - [x] Add `public/robots.txt` (valid syntax, allow crawl).
   - [x] `netlify.toml`: add caching headers for static assets (long cache with immutable).

## P1 (1-2 weeks) - Bundle + CPU Optimizations
1) Code splitting and lazy load
   - [x] `App.tsx`: route-based split for `/validate` with `React.lazy` + `Suspense`.
   - [x] Lazy load below-the-fold sections on the home page (Expertise/Process/Work/FounderMessage/Team/Contact).

2) Reduce unused JS
   - [x] `pages/ValidatePage.tsx`: dynamic import for `emailService` (smaller initial bundle).
   - [ ] Move email HTML/text templating fully behind `netlify/functions/send-email.ts` to shrink client payload.
   - [x] Remove unused `@google/genai` dependency.

3) Animation and DOM size
   - [x] Hero blur/filter animation removed from initial load (`components/Hero.tsx`).
   - [x] `components/TechStack.tsx`: marquee duplication reduced 4x -> 2x.
   - [x] `components/Hero.tsx` + `components/TechStack.tsx`: add `prefers-reduced-motion` handling.
   - [ ] Review remaining animations and heavy DOM sections for further reductions.

4) Third-party assets
   - [ ] Self-host tech logos or bundle as SVG sprite; add caching headers if kept on CDN.

## P2 (2-4 weeks) - Structural Improvements
- Add a build-time image pipeline (sharp/imagetools) for consistent resizing and compression.
- Enable real-user monitoring for Web Vitals and track LCP/CLS in production.
- Confirm static HTML is served from CDN edge with low TTFB.

## Validation Checklist
- Run Lighthouse in production build (`npm run build` + `npm run preview`).
- Confirm the LCP element is the hero image and loads within 2.5s on mobile.
- Verify no regressions in CLS or accessibility warnings.
- Re-check "Render blocking requests" and "Unused JS" after changes.
