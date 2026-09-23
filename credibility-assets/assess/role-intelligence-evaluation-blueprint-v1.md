# Syntropix Role Intelligence — Evaluation Dataset Blueprint v1

Date: 2026-09-23
Status: PRE-IMPLEMENTATION RESEARCH PLAN

## Goal

Create a benchmark dataset for evaluating job-family and role-level inference before Role Intelligence is trusted operationally.

## Initial target

Planning set:
**360 de-identified/publicly usable role descriptions**
= approximately 20 per Syntropix job family.

Include:
- India-first sample;
- multinational/global roles;
- startups, mid-market and large-enterprise language;
- clean JDs and messy/boilerplate JDs;
- ambiguous/hybrid titles.

Do not scrape/use private client JDs without an appropriate basis.

## Gold-label process

Each JD receives independent labels from:
- one experienced TA/HR reviewer;
- one job-family/domain reviewer where needed.

For ambiguous cases:
- retain disagreement;
- adjudicate with documented rationale.

Labels:
- primary family;
- secondary family;
- role level;
- direct people manager yes/no;
- stakeholder complexity;
- analytical intensity;
- AI intensity;
- confidence.

## Evaluation metrics

### Family
- top-1 agreement
- top-2 coverage
- confusion matrix by family

### Level
- exact agreement
- adjacent-level agreement
- serious misclassification rate

### Managerial scope
- precision/recall for direct people-management classification

### Confidence quality
High-confidence errors are more serious than low-confidence abstentions.

Track:
- error rate by confidence band;
- proportion requiring clarification;
- proportion safely auto-configured.

## Stress tests

Include:
- title says “Manager” but no reports;
- “Lead” individual contributor;
- startup roles spanning three functions;
- copied competency boilerplate;
- very short JD;
- inflated title;
- global capability-center roles;
- Indian title conventions;
- role with high safety/regulatory exposure;
- emerging AI-related role.

## Release criterion hypothesis

Before zero-touch operational use:
- predefined acceptable family/level agreement;
- no severe recurring family confusion;
- confirmation trigger catches most material ambiguity;
- expert review of high-confidence errors.

Exact thresholds must be set before evaluation, not after seeing results.
