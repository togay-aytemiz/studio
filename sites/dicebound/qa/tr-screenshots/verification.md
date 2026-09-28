# Turkish gameplay backgrounds

- Founder request: use existing native Turkish screenshots behind the approved artwork; do not reconstruct labels.
- Five feature backgrounds replaced as whole images. Same SVG transforms, masks and foreground artwork.
- `npm run build`: PASS.
- `node scripts/check-dicebound.mjs`: PASS, 42 registered public payloads, routing, policy headers and host isolation.
- Every pre-existing public file is byte-identical to `origin/main`, except the five image references in `tr/index.html`.
- Browser: 1440×1000 and 390×844. All five TR feature images load; desktop selects 1600px and mobile selects 640px. Mobile has no horizontal overflow.
- Fresh evidence: `desktop.png`, `mobile.png`. Hero remains the approved common artwork; its authored card labels are outside this screenshot-only change.
- Captures remain archived native evidence, not new App Store device certification. No Unity/runtime or game save changes.
