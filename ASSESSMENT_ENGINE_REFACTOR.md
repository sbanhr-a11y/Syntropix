# Assessment engine refactor — zero-downtime gate

## Objective
Reduce the generated assessment application from a single ~800KB HTML/JS artifact into independently testable runtime, instrument-definition, reporting, commerce and integration modules without changing assessment scores or customer-visible behaviour.

## Safety rules
1. Never rewrite scoring and extraction in the same release.
2. Existing inline `assessmentBank` remains the production fallback until every extracted instrument passes parity tests.
3. Every extracted instrument must preserve: question ids/order/text, dimension codes, reverse-scoring flags, score formula, thresholds/archetypes, phases, report language and assessment display name.
4. No module becomes canonical until old-vs-new output matches for deterministic fixture responses.
5. Rollback is removal of module registration; the inline bank continues to work.

## Target boundaries
- `engine/runtime.js`: session state, rendering orchestration, answer collection.
- `engine/scoring.js`: generic scoring primitives only.
- `assessments/<code>.js`: immutable assessment definition/data.
- `reports/`: report rendering and print/PDF behaviour.
- `commerce/`: pricing/payment/entitlement client orchestration.
- `integrations/`: API calls, ratings, contact, enterprise and Prism360 bridges.

## Migration sequence
A. Compatibility registry/validator (this branch).
B. Extract one 20-question assessment and add deterministic parity fixtures.
C. Run browser smoke test + parity test; only then register it ahead of inline fallback.
D. Repeat instrument-by-instrument.
E. Extract shared dimension/report data after all instruments have parity coverage.
F. Extract runtime/scoring last, when the data layer is no longer embedded.
G. Remove inline assessment bank only after full regression suite passes.

## Production gate
The refactor is complete only when all instruments pass deterministic score parity, report smoke tests, session resume, payment/entitlement launch, enterprise assignment, rating submission and mobile/desktop launch checks. File-size reduction alone is not success.
