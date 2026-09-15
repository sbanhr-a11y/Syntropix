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
- [x] Non-invasive audience/trust navigation layer created.
- [x] Production GitHub Pages workflow added on `main`.
- [x] Homepage navigation loader is injected into the deployment artifact without rewriting the 800KB source `index.html`.
- [x] Deployment workflow verifies `index.html`, loader/navigation scripts, all four public journey pages, and `CNAME` before publishing.
- [ ] Verify homepage assessment flows still initialize on the deployed custom domain.
- [ ] Verify Organizations / Professionals / Evidence / Trust links on desktop and mobile.
- [ ] Verify privacy link and assessment catalogue anchor.
- [ ] Verify custom-domain serving after workflow deployment.

## Deployment design
The production workflow `.github/workflows/deploy-pages.yml` runs on every push to `main` and can also be dispatched manually. It checks out the production tree, configures GitHub Pages, injects `/architecture-v2-loader.js` into the deployment copy of `index.html` only when absent, refuses deployment if the homepage lacks a closing body tag, verifies required files, uploads the static artifact, and deploys it through GitHub Pages. The repository copy of the existing assessment homepage is intentionally left unchanged.

## Explicitly out of scope for this public-site release
- Enterprise multi-tenancy and RBAC.
- Enterprise CSV/XLSX employee ingestion.
- Arbitrary HTML communication templates.
- Checkout-bypass links.
- HRIS/webhook claims not backed by tested integrations.
- Automated consequential employment decisions.

## Rollback
The release is additive. If the navigation layer causes a regression, disable/remove the deployment-artifact loader injection from `.github/workflows/deploy-pages.yml`; the source assessment application in `index.html` remains unchanged.
