# ART DIRECTOR: APPROVED

Creative disposition: APPROVE  
Reviewer: Ayla Serrin — independent read-only implementation review  
Date: 2026-09-28  
Blockers: 0 · Majors: 0 · Minors: 0

## Scope and evidence

Website-only replacement of the five Turkish feature-image gameplay backgrounds: Town, Hunt, Adventure, Crafting and Gathering. Reviewed all ten exported WebP files at 640/1600 widths, the five native Turkish source captures, source SVG image placements, exporter, Turkish HTML diff, provenance, documentation, and desktop/mobile browser evidence (1440px and 390px viewports). This is not a Unity runtime change or fresh App Store screenshot certification.

The exporter preserves existing composition geometry, masks and foreground artwork, replacing exactly one whole gameplay capture in each composition. It removes the same two promotional headline groups as the English export. It does not redraw, translate or invent labels. All ten export hashes match provenance. Independently compared fifteen existing EN homepage, hero, stylesheet and EN feature assets against HEAD: byte-identical.

## Creative diagnosis and player-facing impact

Town now visibly reads Üretim, Av, Karakter and Macera within authentic game imagery. Crafting uses Turkish item names and requirements; Gathering uses its original Turkish place labels. Hunt preserves the early forest framing; Adventure preserves the Frost landscape, with the authentic source's stage 2-1 progress. The foreground mentor, animal ensemble, bosses, artisans and material props keep the approved silhouette, scale, warm light and depth. The correction solves the language mismatch without introducing a second visual language or a superficial text overlay.

Desktop retains the approved two-feature/three-feature hierarchy. Mobile retains the complete stacked compositions with no image clipping or layout regression visible in the supplied browser evidence. Small in-game copy remains secondary to the illustrations and the website captions; no increased text volume is introduced.

## System/progression impact and cross-screen consistency

No mechanics, progression, save data, runtime resources or game assets change. Town uses an authentic level-7 state, Adventure an authentic stage-2-1 state, and Crafting retains level-10 unlocked recipes. These bounded capture differences are documented and do not change the website's claims. EN assets, shared hero artwork and surrounding website layout remain unchanged. The hero's separate illustrated card lettering is outside the five-screenshot correction, consistent with the user's instruction not to reconstruct labels.

## What works; what holds it back

The original promotional art remains the focal layer, while Turkish gameplay underneath supplies credible localized detail. The existing crop/mask language holds together across all five images. Nothing blocks or materially weakens this bounded delivery. Archived native captures remain archived evidence; do not present this review as approval to upload fresh App Store screenshots without the separate current-capture requirement.

## Required changes and concrete direction

Required changes: none. Ship these reviewed website assets and preserve their recorded source hashes. Any subsequent content or visual change requires renewed review of the changed scope.

## Reviewed file hashes

- `public/_sites/dicebound/assets/town-tr-v1-640.webp` — `a01eaac6c449a64406e11f060cd23f722ab287ccbba5da541f9b71561b27b299`
- `public/_sites/dicebound/assets/town-tr-v1-1600.webp` — `f5ab84e317ccedbeeb32bbe74eb44a59fd509412e25130eddb032180bcbdfb7e`
- `public/_sites/dicebound/assets/hunt-tr-v1-640.webp` — `1641cda3bd88801bf23237109a71f3b46d0196e66de4ac0a82041c1870d91f84`
- `public/_sites/dicebound/assets/hunt-tr-v1-1600.webp` — `c0053d0e2bd8cf9ecaec7ebe8ea66f45ea7f7127a416a163c8d88d8e63c833ef`
- `public/_sites/dicebound/assets/adventure-tr-v1-640.webp` — `13b37ac3b03207a814ba53d8b046dd97fc1e894c416ce9ed119a5ed9802a4307`
- `public/_sites/dicebound/assets/adventure-tr-v1-1600.webp` — `de88d228112e54b4e5517ff89c696ead7288f7cc05ff353855b641af8c666644`
- `public/_sites/dicebound/assets/crafting-tr-v1-640.webp` — `dc1f5de282bcc04381b9978e10551439ea1212958c7a244a96558bd3f85cd2e6`
- `public/_sites/dicebound/assets/crafting-tr-v1-1600.webp` — `ce47aed1f975533fc27f0d228836bef23c9f5081713308cbebecd1fd42294ac2`
- `public/_sites/dicebound/assets/gathering-tr-v1-640.webp` — `9246ee4fe975c66d143dbb273a8eb4796a0b7bda06d7b544ce405575ce37693b`
- `public/_sites/dicebound/assets/gathering-tr-v1-1600.webp` — `1edb6fc4950a0a7557a8833545e0f000ca0b004da991f842023cab87130823f1`
- `public/_sites/dicebound/tr/index.html` — `4d42d0d43c86c6ee5e07b3f1d7aea4d39eed51e34c273a816ecfb8041cf05e0e`
- `scripts/export-dicebound-tr-art.cjs` — `b79583b6f614aeb5d4f70113d11d7bc78c30dca9a814e857c8ce816acc5f0cce`
- `sites/dicebound/qa/tr-screenshots/desktop.png` — `2939730b25dd7a7933c7b2d133fd5f749d7f70b4e865087edeaac9e6a10ef98c`
- `sites/dicebound/qa/tr-screenshots/mobile.png` — `48b825c9849ae18f82e0aa769b21e4a941d465dd07b37711e0f9b6d48123a83b`
