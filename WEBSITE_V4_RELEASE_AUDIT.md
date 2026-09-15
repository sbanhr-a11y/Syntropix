# Website v4 Full Transformation — Release Audit

## Non-negotiable architecture
- Public `/` is the new marketing homepage, not the legacy application with a new section stacked above it.
- Legacy assessment application is preserved byte-for-byte from repository `index.html` into deployment artifact `/assessments.html` before public homepage replacement.
- No assessment/auth/payment/API source logic is rewritten by Website v4.
- Rollback baseline is `archive/legacy-assessment-app-v3` / pre-v4 main.

## Content and conversion
- [x] Premium purpose-led hero and two-audience entry points.
- [x] Clear problem framing.
- [x] Capability-system presentation: assessments, manager development, Prism360, talent solutions.
- [x] Assess → Diagnose → Develop → Apply → Measure method.
- [x] Organization and professional journeys.
- [x] Evidence/claims section.
- [x] Human-judgement and developmental-use guardrails.
- [x] Enterprise and assessment CTAs.
- [x] Premium footer with evidence/trust/privacy/terms routes.

## Claims and trust
- [x] No medical/clinical positioning.
- [x] No unsupported predictive-validity claim.
- [x] No fabricated customer logos, testimonials, ratings or usage metrics.
- [x] No claim that established construct theory automatically validates a proprietary instrument.
- [x] Employment decisions explicitly retain human judgement and job-related evidence.
- [x] Outdated privacy references to Google Sheets, support@syntropix.com and named AI providers removed.
- [x] Terms route created; privacy contact uses team@syntropix.in.

## SEO
- [x] Unique homepage title and description.
- [x] Canonical HTTPS URL.
- [x] Open Graph title/description/type/url.
- [x] Twitter card declaration.
- [x] Conservative Organization + WebSite JSON-LD only; no fake review/rating schema.

## Accessibility/responsive
- [x] Semantic header/nav/main/sections/footer.
- [x] Skip-to-content link.
- [x] Keyboard-visible focus.
- [x] Mobile navigation exposes aria-expanded state and Escape close.
- [x] Reduced-motion media query.
- [x] Responsive layouts at desktop/tablet/mobile breakpoints.
- [x] No content depends on animation to be understood.

## Deployment guards
- [x] Refuse deploy if legacy application is missing or unexpectedly small.
- [x] Refuse deploy if new homepage is missing or unexpectedly small.
- [x] Verify public index contains v4 content/assets and assessment route.
- [x] Verify preserved assessment artifact still contains PayPal SDK and PapaParse markers.
- [x] Verify assessment artifact remains >500 KB.
- [x] Verify v3 loader does not leak into the new public homepage.
- [x] Verify custom-domain CNAME.

## Required after merge before completion may be reported
- [ ] GitHub Pages workflow completes successfully from exact v4 merge SHA.
- [ ] Download deployed Pages artifact and inspect `index.html` and `assessments.html` directly.
- [ ] Confirm deployed `index.html` is v4 homepage and not old app.
- [ ] Confirm deployed `assessments.html` contains preserved legacy application.
- [ ] HTTP smoke test live `/`, `/assessments.html`, `/enterprise.html`, `/professionals.html`, `/science.html`, `/trust.html`, `/privacy.html`, `/terms.html` where external network access permits.
- [ ] Only then report Website v4 complete.