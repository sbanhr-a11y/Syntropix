# CogniMorph Index — Technical Document

Document ID: SX-CMI-TD-1.0
Technical-document version: 1.0
Instrument/scoring implementation: **canonical registry/runtime verified; empirical evidence status remains developmental**
Evidence status: **DEVELOPMENTAL / EVIDENCE-BUILDING**
Effective date: 2026-09-23

## Controlled status
This document instantiates the Syntropix full technical-document standard for CogniMorph Index. It must not be used to imply that psychometric validation has been completed. Any coefficient, norm, benchmark, validity statement or fairness conclusion remains withheld until mapped to version-specific evidence.

## Current public-use boundary
Use for developmental reflection and structured development conversations consistent with the current public instrument register. Do not silently repurpose the instrument for consequential employment decisions, clinical diagnosis, neurological inference or deterministic identity labelling.

## Canonical implementation facts verified
- Runtime sources: `assessment-registry-v3.js + assessment-runtime-v3.js`.
- Canonical registry source hash declared in `assessment-registry-v3.js`: `fc3277609366dcd733112f02d0a955af31dc9becd39ec07f517eb94e94569098`.
- Item count: **20**.
- Dimension keys: **ALOR, ERAE, CTAP, FRUP**.
- Reverse-keyed items: **8**.
- Response scale: **six-point integer scale, 1–6**.
- Reverse scoring: **7 − raw response**.
- Dimension score: mean of keyed item values transformed to 0–100 with `round(((mean-1)/5)*100)`.
- Overall score: mean across all keyed item values transformed to 0–100 and rounded to one decimal.
- Runtime descriptive tiers: **high ≥80; mid ≥60; low <60**. Report dimension bands are **Established strength ≥80; Developing capability ≥60; Development priority ≥40; Immediate development focus <40**. These are internal descriptive report rules, not population norms or validated cut scores.
- Missing responses: production submission is gated until every configured item has a response; partial-score interpretation is not an approved pathway.
- Runtime/report version observed: **3.0.0** report payload; registry integrity hash is submitted with reports.

### Important evidence boundary
These implementation facts establish what the software currently does. They do **not** establish reliability, factor structure, criterion validity, predictive validity, fairness, norms or decision utility.

## Evidence file
Populate the following sections only from traceable evidence IDs: construct definition and literature map; content-development record; cognitive interviews; pilot sample; item analysis; reliability/precision; internal structure; external-variable evidence; test–retest where relevant; fairness/comparability; norms/benchmarks if justified; accessibility; limitations; and change-control history.

## Interpretation
Scores are patterns to investigate rather than verdicts. Interpretation must state uncertainty and contextual limitations. Reliability does not establish validity; correlation does not establish causality; a polished report does not establish predictive utility.

## Consequential-use gate
Selection, promotion, performance, redundancy or other high-stakes employment use requires separate job-related evidence, fairness analysis, human decision governance and applicable-law review for the exact deployment.

## Approval record
Release implementation verified by: [ ]
Method review: [ ]
Privacy/security review: [ ]
Legal/employment review if applicable: [ ]
Evidence IDs supporting stronger claims: [NONE YET]
Next review: [ ]
