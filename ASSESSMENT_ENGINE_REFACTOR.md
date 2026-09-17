# Canonical assessment runtime — migration complete

## Production state
Flagship and Focused Professionals assessments now run exclusively through `assessment-runtime-v3.html`, `assessment-runtime-v3.js` and the committed immutable `assessment-registry-v3.js`.

The historical monolithic assessment front has been retired. `index.html` is the canonical Syntropix homepage in source control and production. `assessments.html` is not generated or deployed. The DOM compatibility shell and one-time migration/extraction tooling have been removed.

## Preserved capabilities
- Exact migrated question ids/order/text/dimension/reverse-scoring flags.
- Assessment archetypes, dimension metadata and development phases.
- 1–6 response scale and equivalent normalized scoring formula.
- Regional pricing and server-authoritative payment verification.
- Research-consent eligibility and 15% discount.
- Automatic 20% multi-assessment eligibility from the backend.
- Executive upgrade eligibility.
- India UPI submission/verification workflow.
- PayPal checkout outside the India UPI branch.
- Enterprise entitlement detection and claim flow.
- Invite routing, including multi-assessment bundles.
- Three-hour local resume window tied to the registry fingerprint.
- Validation submission with test/admin accounts excluded.
- Report persistence and completion lifecycle submission, with retry queue on transient failure.
- PDF/print report path.

## Deliberate removal
Unsupported pseudo-normative cohort percentiles from the historical UI were not migrated. No population percentile is shown without a separately validated normative sample.

## Release gates
Deployment fails if instrument counts/report data are incomplete, legacy `/assessments.html?assessment=` routes reappear, payment/entitlement/report endpoints disappear, invite routing is missing, or a retired assessment front file enters the Pages artifact.

## Engineering rule
No new feature may depend on `assessments.html`, the retired monolith, or DOM compatibility shims. New assessments must register with a canonical runner/registry and pass the applicable scoring, commerce, lifecycle and UX gates before production release.
