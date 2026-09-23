# Syntropix Assess — Evidence Integrity Rules v1

Date: 2026-09-23
Status: PRE-IMPLEMENTATION DESIGN STANDARD

## Purpose

Protect confidence that assessment evidence represents the candidate without pretending remote assessment can perfectly detect AI or cheating.

## Principles

1. Integrity signals are not guilt findings.
2. Capability scores and integrity confidence are separate.
3. Verification is preferred over accusation.
4. Candidate rules are explicit.
5. Surveillance is optional and proportionate.
6. No text “AI detector” is used as sole evidence.
7. Human review remains available for consequential cases.

## Layer 1 — assessment contract

Before starting, candidate confirms:
- which sections restrict AI/search/external help;
- which sections may explicitly involve AI judgment;
- that unauthorized assistance may trigger verification;
- privacy/accommodation information.

## Layer 2 — form diversity

Use balanced randomization/item-bank sampling so candidates do not all receive identical forms.

Maintain construct/CX/job-family coverage equivalence.

## Layer 3 — stateful coherence

Challenge-back can use prior decisions plus new evidence.

Primary purpose:
- test ownership and adaptation;
- reduce usefulness of static answer sharing.

## Layer 4 — integrity telemetry

Potential signals:
- tab/window exits;
- copy attempts;
- paste attempts;
- prolonged inactivity;
- implausible response-time shifts;
- repeated reconnects;
- session/device anomalies where lawfully collected.

Each signal requires:
- reason code;
- threshold;
- false-positive consideration;
- privacy disclosure where applicable.

## Layer 5 — verification trigger

Working trigger categories:
- **No trigger:** normal evidence.
- **Soft trigger:** one low-confidence anomaly; no candidate action required.
- **Verification trigger:** multiple converging anomalies or major evidence inconsistency.
- **Technical trigger:** interruption prevents interpretable result.

A single tab switch or slow response never automatically triggers punitive action.

## Layer 6 — challenge-back trigger logic

Challenge-back should normally occur for all candidates in a small amount, not only suspected cases, to avoid stigma and create standard evidence.

Adaptive extra challenge-back may be added when:
- construct evidence is contradictory;
- unusually strong performance is isolated to one format;
- integrity telemetry and response evidence diverge materially.

## Layer 7 — micro-verification (future / v1.5)

6–8 minute equivalent-form check.

Trigger when:
- material integrity inconsistency;
- high-stakes client setting;
- client explicitly requests higher assurance;
- technical interruption undermines evidence.

Outputs:
- Higher confidence
- Standard confidence
- Verification advised
- Result withheld pending verification

Never output “AI detected” unless future evidence supports a specific validated detection method.

## Layer 8 — optional high-assurance mode

Future enterprise option:
- identity check;
- camera presence;
- screen sharing/recording;
- browser controls.

Not default.

Requires:
- explicit client/candidate disclosure;
- privacy review;
- accessibility alternative;
- retention controls;
- jurisdictional review.

## Evidence Integrity Confidence

Working client-facing states:
- **Higher confidence**
- **Standard remote-assessment confidence**
- **Verification advised**
- **Result withheld pending verification**

Integrity confidence is about interpretability of evidence, not candidate quality.

## False-positive protection

Before any verification/withholding:
- technical incidents considered;
- accessibility/accommodation considered;
- connectivity/device context considered;
- multiple signals preferred over single-signal rules;
- review path documented.

## Research programme

Pilot must evaluate:
- base rate of each telemetry signal;
- relation between integrity signals and verification performance;
- false positives;
- candidate reactions;
- subgroup differences;
- whether challenge-back adds incremental evidence;
- whether AI assistance changes performance differently by item type/CX level.

## Governance

Every integrity rule has:
- version;
- owner;
- rationale;
- threshold;
- evidence status;
- effective date;
- rollback path.

Do not silently change integrity thresholds in production.
