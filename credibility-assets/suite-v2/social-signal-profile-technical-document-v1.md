# Social Signal Profile — Technical Document

Document ID: SX-SSP-TD-1.0
Technical-document version: 1.0
Instrument/scoring version: **1.0.0**
Evidence status: **DEVELOPMENTAL / RESEARCH-INFORMED / VALIDATION IN PROGRESS**
Effective date: 2026-09-23
Canonical implementation family: **Suite v2**

## Intended use and boundary
Social Signal Profile is implemented as a developmental self-report instrument for structured reflection. It is not a clinical, diagnostic, neurological, population-normed or employment-selection instrument. The current Suite v2 governance blocks self-serve access below age 18.

Definition metadata audience: **16+**  
Current operational age posture: **18+ self-serve despite definition metadata 16+**

Where definition metadata and operational age gating differ, the stricter current governance controls actual self-serve release. Youth use remains disabled until jurisdiction-specific guardian/assent and data-handling requirements are implemented.

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
- expressiveness
- perspective taking
- assertiveness
- social calibration

Runtime dimensions:
- `expressiveness` — 3 items
- `perspective` — 3 items
- `assertiveness` — 3 items
- `calibration` — 3 items

Total items: **12**
Reverse-keyed items: **2, 4, 6, 8**

## Response scale
1. Strongly disagree
2. Disagree
3. Neither agree nor disagree
4. Agree
5. Strongly agree

All 12 responses are required by the shared validator before scoring.

## Scoring
For each item:
- forward-keyed value = raw response;
- reverse-keyed value = `6 - raw`.

Each dimension score is the arithmetic mean of its three transformed item values, rounded to two decimals.

Percent-of-scale for each dimension is:
`((mean - 1) / 4) × 100`, rounded to one decimal.

Overall score is the unweighted arithmetic mean of the four dimension means, rounded to two decimals. Overall percent-of-scale uses the same transformation.

## Report interpretation
The Suite v2 runner uses descriptive labels:
- >= 4.25 — Consistently expressed
- >= 3.50 — Frequently expressed
- >= 2.75 — Context-dependent
- >= 2.00 — Less consistently expressed
- < 2.00 — Potential development focus

These thresholds are internal descriptive report rules, **not population norms, percentiles, validated cut scores or decision thresholds**.

The runner identifies the highest and lowest dimension means and produces deterministic development-coach text, a one-week behavioural experiment and a follow-up reflection. The difference between dimensions is explicitly framed as a hypothesis to test in real situations, not a fixed trait.

## Evidence status
Implementation facts establish what the current software does. They do not establish:
- reliability or precision;
- factor structure;
- convergent/discriminant validity;
- criterion or predictive validity;
- fairness or measurement invariance;
- population norms;
- causal effects;
- suitability for consequential decisions.

Stronger claims require version-specific Syntropix evidence under the Validation Study Protocol.

## Current validation roadmap
Suite v2 governance declares the following evidence stages:
content review → cognitive interviews → pilot → item analysis → reliability → EFA/CFA → convergent/discriminant evidence → test–retest where relevant → fairness/DIF → measurement invariance → norms only if supported.

## Data / access controls
Commercial release requires a server-verified entitlement. The runner stores responses locally for session continuity and uses the current access/age gates before beginning. Any research-data collection must remain separately consented and governed by the applicable privacy/retention controls.

## Limitations
- self-report and common-method limitations;
- current descriptive thresholds are not normative;
- operational self-serve age policy may be stricter than historical definition metadata;
- evidence from source theories does not automatically validate this Syntropix instrument;
- English-language implementation evidence does not automatically transfer to future translations/locales.

## Change control
Instrument version: **1.0.0**.
Any item, reverse-key, construct, response-scale or scoring change must follow the Assessment Version & Change-Control Standard. Wording changes that can alter response interpretation must be treated as evidence-impacting, not cosmetic.

## Approval record
Implementation verified from repository: 2026-09-23
Method review: [ ]
Privacy/security review: [ ]
Legal/employment review if consequential use is contemplated: [ ]
Evidence IDs supporting stronger claims: [NONE YET]
Next review: [ ]
