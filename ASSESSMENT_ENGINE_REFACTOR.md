# Canonical assessment runtime — migration complete

## Production state
The Flagship and Focused Professionals assessments no longer execute the historical monolithic assessment UI. Production traffic routes to `assessment-runtime-v3.html` + `assessment-runtime-v3.js` with a generated, data-only `assessment-registry-v3.js`.

The historical `index.html` remains in source control only as a frozen migration source until the generated registry is committed independently. The deploy workflow replaces it with `homepage-v4.html` before artifact upload. It is not shipped as the production homepage or assessment runtime. `assessments.html` is not created or deployed.

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
- Three-hour local resume window tied to registry fingerprint.
- Validation submission with test/admin accounts excluded.
- Report persistence and completion lifecycle submission, with retry queue on transient failure.
- PDF/print report path.

## Deliberate removals
Unsupported pseudo-normative cohort percentiles from the historical UI are not reproduced. No population percentile is shown without a separately validated normative sample.

## Release gates
Deployment fails if instrument counts/report data are incomplete, legacy `/assessments.html?assessment=` routes reappear, canonical payment/entitlement/report endpoints disappear, invite routing is missing, or the old executable assessment front is present in the Pages artifact.

## Remaining source cleanup
The historical monolith is retained only as a frozen source-of-truth for reproducible registry compilation. It has no production route. Once the generated registry is checked into source as an independently reviewed immutable data asset, the historical source file and migration compiler can be archived outside the production repository without changing runtime behaviour.
