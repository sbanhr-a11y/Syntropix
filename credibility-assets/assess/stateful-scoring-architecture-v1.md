# Syntropix Assess — Stateful Scoring Architecture v1

Date: 2026-09-23
Status: SCORING DESIGN STANDARD / PRE-EMPIRICAL
Scope: Manager Signal, Campus Signal

## Core principle

Syntropix does not score “the correct personality.” It scores the quality of decisions against documented job-relevant response rubrics.

Initial scoring is **expert-keyed and evidence-bounded**, then empirically evaluated and recalibrated.

## 1. Decision-unit scoring

Each scored decision unit uses an ordinal rubric, initially:

- **0 — Poorly aligned evidence:** misses critical constraint / creates material avoidable risk
- **1 — Limited evidence:** addresses part of the problem but misses important trade-off
- **2 — Reasonable evidence:** defensible action with some limitations
- **3 — Strong evidence:** well-balanced, job-relevant action that protects critical constraints

Not every item must use exactly 0–3 if a different format is methodologically justified, but scoring must be defined before pilot administration.

## 2. No simplistic “correct answer” where trade-offs exist

For CX2–CX4 scenarios, multiple responses may receive partial credit.

Rubric must identify:
- critical constraints;
- acceptable trade-offs;
- unacceptable risks;
- sequencing quality;
- escalation appropriateness;
- evidence use.

## 3. Expert key development

Each scenario must be independently rated by multiple qualified SMEs.

Recommended workflow:
1. role/context SMEs review realism;
2. assessment/psychometric reviewer checks construct alignment;
3. SMEs independently rate response quality;
4. disagreement is recorded;
5. consensus/rubric refinement occurs before pilot;
6. ambiguous items are revised or removed.

Do not average disagreement away without understanding it.

## 4. Stateful testlet scoring

A testlet can contain:
- initial decision;
- consequence;
- new evidence;
- revised decision;
- challenge-back.

Score both:
### Decision quality
quality at each stage.

### Adaptive update
whether new evidence is used appropriately.

Changing a decision is not automatically positive or negative.

The question is whether the revision is justified by the new information.

## 5. Construct scoring

Initial construct score:
weighted aggregation of its decision-unit evidence, with weights set by design and frozen before pilot.

Avoid arbitrary precision.

Before validation, report construct evidence in descriptive bands rather than population percentiles.

## 6. Complexity handling

CX level does not automatically increase score weight.

A strong CX4 response may be more informative, but increased weighting must be empirically justified.

Initially:
- ensure sufficient construct coverage across CX;
- calculate construct result without hidden “seniority bonus”;
- separately report Complexity Range.

Later calibration may support complexity-aware scoring.

## 7. Role relevance

Role Intelligence selects scenario contexts and may influence sampling emphasis.

It must not invent ad hoc scoring weights per employer.

Any role-family weighting model must be versioned and validated.

## 8. Evidence confidence

Separate score from confidence.

Working confidence inputs:
- number of independent observations;
- convergence across scenarios;
- coverage across complexity;
- contradictions;
- missing/interrupted evidence;
- verification outcome where applicable.

Evidence Confidence is not candidate quality.

## 9. Contradictions

Contradictory evidence should not be “smoothed away.”

Record:
- contexts in which behaviour changes;
- complexity shift;
- stakeholder/risk differences;
- whether contradiction is theoretically interpretable.

Use contradictions to generate verification/interview probes.

## 10. Role Evidence Barometer

Before criterion calibration, barometer is evidence synthesis, not predicted probability.

Allowed language:
- Strong evidence for progression
- Positive evidence
- Mixed evidence
- Limited evidence
- Insufficient evidence

The algorithm/rules producing the barometer must be versioned and documented.

No “78% likely to succeed” before calibration with relevant outcome data.

## 11. Evidence Integrity separation

Integrity signals do not directly reduce capability scores unless the assessment's governed policy explicitly invalidates/withholds a result.

Possible outputs:
- Higher confidence
- Standard remote-assessment confidence
- Verification advised
- Result withheld pending verification

Never silently subtract points because of tab switching or response time anomalies.

## 12. Empirical calibration

Pilot research must evaluate:
- item/testlet difficulty;
- discrimination;
- inter-SME agreement;
- construct structure;
- reliability/precision where appropriate;
- local dependence within testlets;
- subgroup/fairness patterns;
- criterion relationships;
- incremental value beyond simpler measures;
- CX behaviour.

Expert keys may be changed only through version-controlled evidence review.

## 13. Missing/interrupted sessions

Do not impute high-stakes selection evidence casually.

Rules must define:
- minimum completed evidence;
- restart/recovery;
- invalidated testlet;
- technical-failure reschedule;
- report withholding.

## 14. Report boundary

The report explains:
- what was observed;
- where evidence was consistent;
- where it changed;
- what requires verification.

It does not claim psychological certainty or make the employment decision.

## 15. Pre-build gate

Before scored items enter production:
- rubric template approved;
- SME qualifications defined;
- inter-rater process defined;
- scoring fixtures implemented;
- testlet local-dependence analysis planned;
- barometer remains descriptive;
- fairness/validation study plan linked.
