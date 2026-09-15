# Website v2 live smoke test

Run after merge/deploy.

- `/` loads without console-breaking errors.
- Existing assessment catalogue opens and assessment entry/auth/payment paths remain reachable.
- `/enterprise.html` returns the Organizations journey.
- `/professionals.html` returns the Professionals journey.
- `/science.html` returns Evidence & Claims.
- `/trust.html` returns Security & Trust.
- `/privacy.html` remains reachable from public journeys.
- Architecture navigation links resolve on desktop and mobile.
- Navigation enhancement is fail-open: blocking `architecture-v2-nav.js` does not block the core homepage.
- No page claims Syntropix inherits SOC 2/ISO certification from infrastructure providers.
- Developmental assessments are not described as medical/clinical diagnostics or validated predictors unless instrument-specific evidence supports the exact claim.
- Existing API endpoint configuration and assessment JavaScript are unchanged by the architecture release.

Rollback: revert the homepage's single loader reference if the navigation enhancement causes a regression; the public journey pages may remain independently available.
