# Shadow Pattern Map — Technical Document

Document ID: SX-SPM-TD-1.0
Technical-document version: 1.0
Instrument/scoring version: **1.0.1**
Evidence status: **DEVELOPMENTAL / EVIDENCE-BUILDING**
Effective date: 2026-09-23
Canonical implementation family: **Consumer Insight Suite**

## Controlled status
This document records verified implementation facts for the current Consumer Insight Suite release. It must not be used to imply that psychometric validation has been completed. Reliability, factor structure, external validity, norms, fairness/comparability and predictive utility remain evidence-building unless supported by version-specific Syntropix data.

## Canonical implementation
- Definition source: `consumer-insight-suite.js`
- Runner: `consumer-insight-runner.js`
- Shared scoring/validation: `assessment-validation-v2.js`
- Checkout path: `consumer-series-checkout-v1.js` where applicable
- Slug: `shadow-pattern-map`
- Instrument version: `1.0.1`
- Intended use declared in implementation: developmental self-reflection
- Validation status declared in implementation: research-informed; Syntropix instrument validation in progress
- Population norms: false
- Selection use: false
- Clinical use: false
- Self-serve age gate: adults 18+
- Research participation: optional; de-identified item-response submission only when separately opted in

## Item and dimension structure
- Item count: **20**
- Dimensions: **4**
- Items per dimension: **5**
- Dimensions: image protection, threat projection, impulse leverage, adaptive ownership
- Response scale: **1–5**
  - 1 Not like me
  - 2 Rarely like me
  - 3 Sometimes like me
  - 4 Often like me
  - 5 Very like me
- Reverse-keyed items in version 1.0.1: **0**
- Missing responses: all items are required before scoring

## Scoring
The shared `assessment-validation-v2.js` scoring path calculates each dimension as the arithmetic mean of its item responses. Where reverse-keyed items exist in that scoring engine, the transform is `6 - raw`; this instrument version currently contains no reverse-keyed items.

For each dimension:
- mean is rounded to 2 decimals;
- percent-of-scale = `((mean - 1) / 4) × 100`, rounded to 1 decimal.

Overall score is the unweighted mean of the four dimension means, rounded to 2 decimals, with the same percent-of-scale transformation.

Runner descriptive labels are:
- >= 4.2: Highly expressed
- >= 3.5: Frequently expressed
- >= 2.7: Context-dependent
- >= 2.0: Less expressed
- < 2.0: Low endorsement

These are **within-instrument descriptive thresholds**, not population norms, clinical cutoffs or validated decision thresholds.

## Report logic
The runner ranks dimensions by mean score and selects a current pattern lens from the archetype mapped to the highest-scoring dimension. The report also displays the highest and lowest endorsed dimensions, plain-language interpretation, a development-coach prompt, a suggested script/system, a 7-day experiment and reflection prompt.

Interpretation copy explicitly states that the useful information is the shape between dimensions rather than a single label. Scores are within-scale descriptions, not population percentiles.

## Scientific and clinical boundary
The instrument is described as original Syntropix work informed by published research constructs. Evidence from those source literatures does **not** transfer automatically to reliability, validity, norms, factor structure, predictive utility or cross-cultural performance of this instrument.

The Consumer Insight runner explicitly states that this suite does not diagnose attachment disorders, personality disorders, ADHD, autism, neurological conditions or mental-health conditions, and does not measure brain chemistry or dopamine.

## Consequential-use gate
Do not use this instrument as a standalone basis for employment selection, promotion, performance action, redundancy, clinical diagnosis, neurological inference or other high-stakes decisions. Any consequential employment use would require separate job-related evidence, fairness analysis, human decision governance and applicable-law review for the exact deployment.

## Evidence still required
Before stronger psychometric claims are made, maintain version-specific evidence for: construct/content mapping, content-development review, cognitive interviews, pilot sample, item analysis, reliability/precision, internal structure, external-variable evidence, test–retest where relevant, fairness/comparability, accessibility, cross-cultural performance and change-control history.

## Approval record
Release implementation verified from repository: **2026-09-23**
Method review: [ ]
Privacy/security review: [ ]
Legal/employment review if applicable: [ ]
Evidence IDs supporting stronger claims: [NONE YET]
Next review: [ ]
