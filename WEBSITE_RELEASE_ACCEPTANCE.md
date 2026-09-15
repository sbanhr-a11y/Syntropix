# Syntropix Website Architecture v2 — Release Acceptance

## Purpose
Safely introduce explicit B2B/B2C/evidence/trust journeys without replacing or destabilising the existing assessment application embedded in `index.html`.

## Architecture decisions
- `/` remains the existing application-capable homepage during this release.
- `/enterprise.html` is the public organization/procurement journey, not an authenticated enterprise administration console.
- `/professionals.html` is the individual developmental journey.
- `/science.html` is the evidence and claims boundary.
- `/trust.html` is the security/privacy/procurement boundary.
- Provider certifications must never be represented as Syntropix certifications.
- Developmental assessments must not be described as medical/clinical diagnostics or validated employment predictors unless instrument/use-case evidence supports the claim.
- Authenticated enterprise administration is a later security-gated application surface.

## Release gates
- [x] Architecture blueprint v2 documented.
- [x] Organizations page committed.
- [x] Professionals page committed.
- [x] Evidence page committed.
- [x] Trust page committed.
- [x] Existing homepage preserved rather than destructively rewritten.
- [x] Isolated release branch created from production baseline.
- [x] Non-invasive audience/trust navigation layer created on release branch.
- [ ] Reference navigation script from homepage after code-level integration review.
- [ ] Verify homepage assessment flows still initialize after integration.
- [ ] Verify Organizations / Professionals / Evidence / Trust links on desktop and mobile.
- [ ] Verify privacy link and assessment catalogue anchor.
- [ ] Verify custom-domain serving after merge.
- [ ] Merge only after acceptance gates pass.

## Explicitly out of scope for this public-site release
- Enterprise multi-tenancy and RBAC.
- Enterprise CSV/XLSX employee ingestion.
- Arbitrary HTML communication templates.
- Checkout-bypass links.
- HRIS/webhook claims not backed by tested integrations.
- Automated consequential employment decisions.

## Rollback
The release is additive. If integration causes a regression, remove the homepage reference to `architecture-v2-nav.js`; existing assessment logic remains unchanged.
