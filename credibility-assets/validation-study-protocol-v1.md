# Syntropix Validation Study Protocol — v1

Date: 2026-09-23  
Status: CONTROLLED RESEARCH PROTOCOL / PRE-DATA  
Scope: developmental self-report assessments unless an instrument-specific protocol states otherwise

## 1. Purpose

This protocol defines how Syntropix will build and document instrument-specific evidence without overstating what has been demonstrated. It applies separately to each instrument/version and does not allow evidence to transfer automatically across Professional Runtime v3, Suite v2, Consumer Insight Suite or future assessment families.

The protocol is informed by established test-quality frameworks, including the Standards for Educational and Psychological Testing, the EFPA Test Review Model (2025), and International Test Commission guidance. These are methodological references only; they do not constitute accreditation or certification of Syntropix instruments.

## 2. Evidence hierarchy

Evidence must be accumulated in stages. A later stage does not erase weaknesses found earlier.

1. construct and intended-use definition;
2. content mapping and expert review;
3. cognitive interviewing / response-process evidence;
4. pilot administration and data-quality review;
5. item analysis and reliability/precision;
6. internal-structure evaluation;
7. relations with external variables;
8. test–retest where temporal stability is relevant;
9. fairness, comparability and accessibility;
10. norms/benchmarks only if the sampling design justifies them;
11. decision-utility studies only if consequential use is contemplated.

No stage authorizes stronger public claims unless the exact wording is mapped to the resulting evidence record.

## 3. Study registration and version freeze

Before collecting data for a confirmatory study:
- freeze instrument name, version, item set, scoring key, reverse-keying, response scale and report logic;
- record repository commit/checksum;
- define intended population, locale and administration mode;
- preregister primary hypotheses/analyses where feasible;
- record planned exclusions, missing-data handling, multiplicity approach and model-comparison strategy;
- separate exploratory and confirmatory analyses.

Any item/scoring change after data collection must be recorded and may require a new evidence cycle.

## 4. Phase A — construct/content evidence

For every dimension:
- operational definition;
- intended behavioural scope;
- explicit exclusions;
- literature map distinguishing external theory from Syntropix hypotheses;
- item-to-construct mapping;
- expert review for relevance, clarity, redundancy and construct contamination;
- reading/accessibility review;
- sensitivity review for clinical, diagnostic, demographic or protected-characteristic implications.

Recommended evidence artefacts:
- construct map;
- item lineage register;
- content-review form;
- reviewer disagreement/resolution log.

## 5. Phase B — cognitive interviews

Use think-aloud/probing interviews with participants reasonably representative of the intended population.

Examine:
- item comprehension;
- interpretation consistency;
- ambiguous time frames;
- double-barrelled wording;
- response-scale use;
- social-desirability pressure;
- reading/accessibility barriers;
- unintended clinical or identity implications.

Do not use cognitive interviews as evidence of reliability, factorial validity or predictive utility.

## 6. Phase C — pilot and data-quality review

Pilot targets must be justified instrument-by-instrument rather than using a universal magic number. For short 12–20 item instruments, an initial analytic pilot will ordinarily target several hundred usable responses when feasible, with larger samples for subgroup/fairness work.

Before psychometric modelling, report:
- recruitment source and dates;
- geography/language;
- intended-population fit;
- completion rate;
- missingness;
- response times where ethically captured;
- straight-lining/low-effort indicators;
- duplicate/bot controls;
- item distributions;
- floor/ceiling effects;
- subgroup composition relevant to fairness;
- exclusions with counts and reasons.

## 7. Item analysis and reliability/precision

Primary internal-consistency evidence should use coefficients appropriate to the score model; omega is preferred where model assumptions support it. Alpha may be reported for comparability but must not be treated as proof of unidimensionality or validity.

Report where appropriate:
- omega with uncertainty interval;
- alpha as supplementary;
- corrected item–total or item–rest relationships;
- inter-item patterns;
- conditional precision / SEM where meaningful;
- sensitivity of reliability to item deletion.

Avoid mechanical item deletion solely to maximize a coefficient. Content validity and construct coverage remain primary constraints.

## 8. Internal structure

Exploratory and confirmatory modelling must be separated where feasible.

For factor-analytic work:
- use an estimator appropriate to ordinal Likert data;
- justify number of factors;
- inspect factor loadings, cross-loadings/residuals and factor correlations;
- compare plausible competing structures;
- use hold-out or independent confirmation where feasible;
- report fit statistics with substantive interpretation, not threshold-only pass/fail language.

A good-fitting model is not proof of predictive validity or consequential-use suitability.

## 9. Relations with external variables

Select external measures/outcomes before analysis where possible.

For convergent/discriminant evidence:
- use measures with documented evidence for the relevant population;
- state why each relation is expected;
- report effect sizes and uncertainty;
- distinguish expected non-relations from null findings discovered after the fact.

For criterion/predictive work:
- define outcome, timing and decision context;
- prevent criterion leakage;
- use hold-out/cross-validation where feasible;
- report calibration/uncertainty rather than only significance;
- do not convert correlational evidence into causal claims.

## 10. Test–retest

Use test–retest only where the construct is expected to show meaningful temporal stability. Predefine interval and expected stability. For deliberately state-sensitive constructs, lower stability may be substantively expected and should not automatically be labelled measurement failure.

## 11. Fairness, comparability and accessibility

Before any stronger deployment claim:
- identify relevant groups and why they matter;
- inspect missingness and score distributions by group;
- evaluate measurement invariance where sample/design support it;
- consider DIF/item-bias analyses where appropriate;
- examine language/adaptation effects;
- test accessibility/accommodation impacts;
- document untested groups.

“No statistically significant difference” must not be marketed as “bias-free.”

High-stakes employment use additionally requires job-related validation, adverse-impact/fairness review, human decision governance and applicable-law review.

## 12. Norms and benchmarks

Do not publish percentiles, population norms or benchmark labels unless the reference sample is explicitly designed and documented for that purpose.

If norms are later developed, record:
- reference population;
- sampling method;
- geography/industry/role mix as relevant;
- data-collection period;
- sample size;
- weighting;
- uncertainty;
- refresh/re-norming plan;
- populations to which the norms do not generalize.

Internal descriptive report bands are not norms.

## 13. Suite-specific considerations

### Professional Runtime v3
- 1–6 response scale;
- reverse transform 7 - raw where keyed;
- 0–100 report transformations;
- existing report bands are descriptive, not validated cut scores;
- copy/report claims require the same evidence control as scoring claims.

### Suite v2
- 12 items, four constructs, three items per construct;
- 1–5 response scale;
- reverse transform 6 - raw;
- dimension means plus percent-of-scale;
- deterministic development-coach output;
- current self-serve governance blocks under-18 use even where historical definition metadata names a younger conceptual audience.

### Consumer Insight Suite
- current verified trio version 1.0.1;
- 20 items, four dimensions, five items each;
- 1–5 response scale;
- current verified trio has no reverse-keyed items;
- explicit non-clinical/non-neurological boundaries.

## 14. Analysis reproducibility

Preferred analysis environment:
- R and/or Python;
- scripted, version-controlled analysis;
- deterministic random seeds where relevant;
- locked package/environment manifest;
- de-identified analysis datasets;
- separate raw, cleaned and analysis-ready layers;
- machine-readable analysis outputs plus human-readable report.

Every reported number should be reproducible from an evidence ID, dataset version and analysis script commit.

## 15. Evidence IDs

Use:
- SX-EV-[INSTRUMENT]-[STUDY]-[YYYY]-[NN]
- SX-DATA-[INSTRUMENT]-[VERSION]-[YYYY]-[NN]
- SX-AN-[INSTRUMENT]-[VERSION]-[YYYY]-[NN]

No public scientific claim is approved without:
1. exact instrument version;
2. evidence ID;
3. approved wording;
4. stated population/context;
5. limitation note where material.

## 16. Publication states

Allowed evidence states:
- DEVELOPMENTAL / EVIDENCE-BUILDING
- PILOT EVIDENCE AVAILABLE
- STRUCTURAL EVIDENCE AVAILABLE
- SUPPORTED FOR SPECIFIED DEVELOPMENTAL INTERPRETATION
- SUPPORTED FOR SPECIFIED CONSEQUENTIAL USE — only after separate job-related/fairness/legal gate

Avoid the standalone word “validated” when a more specific statement can describe what evidence actually supports.

## 17. Data and ethics controls

Before human-subject data collection:
- privacy notice and consent basis;
- purpose limitation;
- minimum necessary data fields;
- de-identification/pseudonymisation where feasible;
- retention/deletion schedule;
- participant withdrawal handling where applicable;
- access control;
- incident path;
- appropriate ethics/independent review where the study design or jurisdiction requires it.

Research participation must not be bundled deceptively with paid access or employment decisions.

## 18. Study closeout

Each study closes with:
- sample/accounting table;
- protocol deviations;
- analysis outputs;
- interpretation;
- limitations;
- claim-impact decision;
- instrument-change decision;
- technical-document update;
- evidence-register update;
- approval record.

A null or disappointing result remains part of the evidence record; it must not be silently discarded.

## 19. Methodological references

Methodological alignment should be reviewed against the current editions/guidance in force at the time of each study. Current reference set for this protocol:
- AERA, APA & NCME — *Standards for Educational and Psychological Testing* (2014 edition; current open-access edition at protocol date).
- European Federation of Psychologists’ Associations — *EFPA Test Review Model, Version 2025*.
- International Test Commission — guidelines on test use, test adaptation, and computer-/internet-delivered testing.

These references inform study quality and reporting expectations. They do not constitute endorsement, accreditation, certification or independent review of any Syntropix instrument.
