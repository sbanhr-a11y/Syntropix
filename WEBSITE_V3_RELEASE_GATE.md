# Syntropix Website v3 — Phase 2A Release Gate

## Scope
Progressive enhancement only. Do not replace the existing assessment/payment application in `index.html`.

## Required before merge
- [ ] PR is based on current `main` with no unexpected production drift.
- [ ] `website-v3-loader.js`, `website-v3-seo.js`, `website-v3.js`, and `website-v3.css` are present.
- [ ] Loader failure leaves the existing homepage usable.
- [ ] Existing Architecture v2 navigation is not duplicated or obscured.
- [ ] Organizations, Professionals, Evidence and Trust routes remain reachable.
- [ ] Existing assessment catalogue remains reachable.
- [ ] Existing authentication/API/payment code is not modified by this release.
- [ ] Mobile widths 320, 375, 768 and desktop 1280+ remain usable.
- [ ] Keyboard focus is visible and interactive elements remain reachable.
- [ ] Reduced-motion preference is respected by CSS/JS enhancements.
- [ ] Page has one canonical URL and a non-duplicated description.
- [ ] Organization/WebSite JSON-LD parses successfully.
- [ ] No unsupported scientific, diagnostic, predictive or compliance claims are introduced.
- [ ] GitHub Pages deployment artifact contains all v3 assets.
- [ ] Production smoke test passes after deployment.

## Rollback
Revert the Phase 2A merge or remove the v3 loader from the deployment artifact. The underlying application remains the rollback baseline.

## Production rule
Website changes deploy through GitHub Pages. Do not manually deploy Render for Website Phase 2A.