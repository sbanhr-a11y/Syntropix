# Syntropix visual regression — linked-page audit checkpoint (2026-10-12)

Status: **SOURCE INSPECTED, BROWSER EXECUTION PENDING**. Not a gold-standard pass report.

## Confirmed source findings
1. **Professional catalogue**: `assessment-card .assessment-meta` explicitly uses `flex-wrap:nowrap!important`, while `.assessment-card` has `overflow:hidden` in `assessment-cards-v7.css`. This matches the screenshot's clipped duration labels. A scoped fix has been added to this draft branch.
2. **Cross-page exposure**: `enterprise.html` and `pricing.html` also reference `v6-assessment-cards.css` with analogous non-wrapping metadata definitions. Treat these as candidates for regression, not visually confirmed defects.
3. **Multiple CSS systems**: homepage uses v6 and v7 styles; inner pages share v6 foundation with different v7 styles; signin/runtime use site-v5/premium styles. CSS differences merit full breakpoint regression before a universal stylesheet change.
4. **Assessment journey**: Professionals links into `assessment-runtime-v3.html`; include CTA layout and continuity, but avoid purchase submission, authentication side effects, or real billing during screenshot QA.
5. **Linked route inventory**: homepage, solutions, organizations, professionals, talent solutions, manager development, coaching, Prism360, employee experience, compliance learning, pricing, company, science, evidence, technical notes, trust, trust center, privacy, terms, refund/cancellation, sign-in, assessment runtime and assessment intelligence.

## Test approach
`tests/visual-linked-pages.spec.js` visits 23 route definitions at 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920 widths (253 page/viewport combinations). It captures full-page screenshots, flags horizontal scrolling, detected interactive-card clipping, missing button names and HTTP failures. Set `BASE_URL` to an isolated staging host. Baseline snapshots and pixel diff approval are separate gates; do not mistake generated screenshots for approved baselines.

## Blockers
The current execution container cannot DNS-resolve `syntropix.in`; the external web accessor likewise cannot open it. There is no verified live/staging browser run, no pixel-difference score and no accessibility certification.

## Release gate
Keep PR in draft; no merge or deployment until 253 screenshots and failures have been reviewed, defects remediated, main customer journeys exercised on staging, and reviewer/Command isolation is confirmed. Production and main stay unchanged.
