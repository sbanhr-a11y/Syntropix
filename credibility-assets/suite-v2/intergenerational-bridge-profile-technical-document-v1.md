# Intergenerational Bridge Profile — Technical Document

Document ID: SX-IBP-TD-1.0
Technical-document version: 1.0
Instrument/scoring version: **1.0.0**
Evidence status: **DEVELOPMENTAL / RESEARCH-INFORMED / VALIDATION IN PROGRESS**
Effective date: 2026-09-23
Canonical implementation family: **Suite v2**

## Intended use and boundary
Intergenerational Bridge Profile is implemented as a developmental self-report instrument for structured reflection. It is not a clinical, diagnostic, neurological, population-normed or employment-selection instrument. The current Suite v2 governance blocks self-serve access below age 18.

Definition metadata audience: **18+**  
Current operational age posture: **18+ self-serve**

Where catalogue/definition age positioning is narrower than the platform minimum, the narrower product positioning should be respected in public use. Youth use below 18 remains disabled until jurisdiction-specific guardian/assent and data-handling requirements are implemented.

## Canonical implementation
- Definition: `assessment-suite-v2.js`
- Shared scoring/validation: `assessment-validation-v2.js`
- Runner: `assessment-suite-v2-runner.js`
- Governance: `assessment-suite-v2-governance.js`
- Catalogue/commercial presentation: `assessment-suite-v2-catalogue.js`
- Validation status in code: `research-informed`
- Intended use in code: `developmental`
- Norms: false
- Selection use: false
- Clinical use: false
- Governance policy version: `2026.09.16`

## Construct structure
Declared constructs:
- perspective taking
- stereotype restraint
- communication flexibility
- reciprocal learning

Runtime dimensions:
- `perspective` — 3 items
- `stereotype` — 3 items
- `communication` — 3 items
- `learning` — 3 items

Total items: **12**
Reverse-keyed items: **2, 4, 6, 8**

## Response scale
1. Strongly disagree
2. Disagree
3. Neither agree nor disagree
4. Agree
5. Strongly agree

All 12 responses are required before scoring.

## Scoring
Forward-keyed value = raw response.  
Reverse-keyed value = `6 - raw`.

Each dimension is the arithmetic mean of its three transformed item values, rounded to two decimals.

Percent-of-scale = `((mean - 1) / 4) × 100`, rounded to one decimal.

Overall = unweighted mean of the four dimension means, rounded to two decimals. Overall percent-of-scale uses the same transform.

## Report interpretation
Runner labels:
- >= 4.25 — Consistently expressed
- >= 3.50 — Frequently expressed
- >= 2.75 — Context-dependent
- >= 2.00 — Less consistently expressed
- < 2.00 — Potential development focus

These are internal descriptive thresholds, **not norms, percentiles, validated cut scores or decision thresholds**.

The report highlights highest/lowest dimensions and generates deterministic developmental reflection, a behavioural experiment and a follow-up coach question. It explicitly frames score differences as hypotheses to test in real situations rather than fixed traits.

## Evidence status
Current implementation facts do not establish reliability, factor structure, external validity, predictive utility, fairness, norms, causal effects or suitability for consequential decisions. Stronger claims require exact-version Syntropix evidence.

## Validation roadmap
content review → cognitive interviews → pilot → item analysis → reliability → EFA/CFA → convergent/discriminant evidence → test–retest where relevant → fairness/DIF → measurement invariance → norms only if supported.

## Data / access controls
Commercial release requires server-verified entitlement. Any research participation must remain separately consented and governed. Self-serve use is blocked below 18 under current governance.

## Limitations
- self-report/common-method limitations;
- descriptive thresholds are not normative;
- conceptual/catalogue audience may be narrower than platform age gate;
- external theory does not automatically validate the Syntropix instrument;
- future locale adaptations require separate adaptation/evidence review.

## Change control
Instrument version: **1.0.0**.  
Item, reverse-key, construct, response-scale or scoring changes must follow the Assessment Version & Change-Control Standard.

## Approval record
Implementation verified from repository: 2026-09-23
Method review: [ ]
Privacy/security review: [ ]
Legal/employment review if consequential use is contemplated: [ ]
Evidence IDs supporting stronger claims: [NONE YET]
Next review: [ ]
