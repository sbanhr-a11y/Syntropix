# Syntropix Assess — Programme Control Map v1

Date: 2026-09-23
Status: CONTROLLED PROGRAMME SOURCE OF TRUTH

## North Star

Syntropix Assess provides structured, job-related hiring evidence while preserving human hiring authority.

Initial products:
- Manager Signal
- Campus Signal

No ATS product is in scope.

## Foundation status

### MERGED / CONTROLLED

**Construct architecture**
- Manager Signal six design domains
- Campus Signal six design domains, with overlap hypotheses explicitly unresolved

**Complexity**
- CX1 Clear Context
- CX2 Competing Priorities
- CX3 Ambiguous Trade-offs
- CX4 High-Consequence Complexity
- empirical difficulty remains separate

**Job-family intelligence**
18 context lenses

**Stateful scoring**
- expert-key hypotheses
- partial credit
- adaptive-update evidence
- contradictions preserved
- no automatic Hire/Reject

**Evidence Integrity**
- explicit AI rules
- randomised/equivalent forms
- stateful challenge-back
- integrity telemetry as signals
- verification rather than accusation

**Scenario authoring**
controlled content/scoring/fairness gates

**Role Intelligence**
zero-effort JD/title interpretation with confidence-based clarification

**UX/UI**
gold-standard candidate/report/Command design standard

### PRIVATE BACKEND ARCHITECTURE

- Command vNext Assess blueprint
- Assess platform data model
- release-state machine

No database migration has been authorised yet.

## Manager Signal status

Research branch / Draft PR #65.

### Available
- 18 scenario-seed testlets
- 54 decision stages
- cue-controlled gold-draft rewrites
- construct evidence map
- automated authoring audit
- quality gate
- SME protocol
- 12-person review-panel specification
- blinded reviewer packets
- reviewer rating dataset template
- scoring-method experiment plan
- cognitive-interview protocol

### Known open issue
The original alpha seed bank is not candidate-ready.
Gold-draft response sets improved substantially, but some high-scoring responses remain longer/more nuanced on average. This remains a rewrite/empirical review concern.

### Current release state
**DRAFT / METHOD REVIEW**

### Next evidence gate
Independent content review:
- practising managers
- selection/psychometric specialists
- accessibility/fairness
- AI governance
- enterprise TA

Then:
Cognitive interviews → frozen pilot bank → pilot.

## Campus Signal status

Research branch / Draft PR #66.

### Available
- construct evidence map
- 35–40 minute form architecture
- Learn→Apply prototype
- candidate UX notes
- 29-decision alpha research bank
- alpha method audit
- cue-controlled eight-item gold subset
- content-review panel specification
- blinded reviewer packet
- cognitive-interview protocol

### Key design decision
Applied Reasoning is one evidence stream, not a dominant IQ-style screen.

Learning Transfer is directly observed through a fictional Learn→Apply system.

### Known open issue
Raw alpha options contain severe answer-length cueing. Only the cue-controlled gold subset is ready for expert content review.

### Current release state
**DRAFT / METHOD REVIEW**

### Next evidence gate
Content review + early-career cognitive interviews.

## Role Intelligence status

Architecture merged.

### May build
- deterministic/synthetic prototype
- JD parsing
- family/level inference
- confidence/abstention logic
- offline evaluation harness
- synthetic role examples

### Must not claim yet
- accuracy percentage
- universal role understanding
- validated automatic configuration

### Evidence gate
360-role benchmark with independent gold labels.

## Engineering work allowed before psychometric validation

The following infrastructure may be implemented safely in staging because it does not require validated score content:

- Command vNext shell/tokens
- Assess domain navigation
- Scenario Studio authoring UI
- Item/version metadata
- release-state workflow
- role-profile preview
- synthetic Role Intelligence prototype
- candidate session shell using synthetic/non-scored content
- report visual shell using synthetic evidence
- accessibility/recovery/autosave patterns
- item cue/audit tooling
- reviewer workflow tooling

All must remain feature-flagged/staging-only until accepted.

## Engineering work NOT allowed yet

Do not:
- expose Manager/Campus assessments to real candidates;
- use alpha scoring for employment decisions;
- present predictive likelihoods;
- call assessments validated;
- create population percentiles;
- auto-reject candidates;
- represent integrity telemetry as cheating detection;
- promote unreviewed items into live forms.

## Barometer rule

Current allowed concept:
**Role Evidence Barometer**
- Strong evidence for progression
- Positive evidence
- Mixed evidence
- Limited evidence
- Insufficient evidence

This is descriptive evidence synthesis.

It is NOT a probability of job success and NOT a Syntropix hiring decision.

## Complexity reporting rule

Allowed descriptive representation:
- Clear Context
- Competing Priorities
- Ambiguous Trade-offs
- High-Consequence Complexity

With:
- consistent
- mostly consistent
- variable
- limited evidence

“Complexity Resilience” remains a reporting hypothesis until validated.

## AI product rule

Separate:
1. Independent capability
2. AI-era judgment
3. Evidence integrity

Future AI-permitted performance tasks may measure augmented capability, but not in v1 until researched.

## Command rule

Command remains internal.

Assess should become the reference premium Command vNext domain.

Migration sequence:
1. shared shell/tokens
2. Assess
3. AC/DC alignment
4. other internal domains
5. legacy style retirement only after regression acceptance

No redesign may alter business logic silently.

## Decision authority

Syntropix:
- structures evidence;
- reports observed patterns;
- flags areas to verify;
- generates interview probes.

Employer:
- makes the employment decision.

Permanent product rule:
**No automatic Hire / No Hire.**

## Immediate execution sequence

1. Complete Manager gold-draft cue cleanup.
2. Run Manager external content review.
3. Run Manager cognitive interviews.
4. Complete Campus gold-draft expansion/cue cleanup.
5. Run Campus content review.
6. Run Campus cognitive interviews.
7. Build Role Intelligence offline benchmark/prototype.
8. Build Command/Assess staging UX shell with synthetic content.
9. Freeze pilot versions only after human review.
10. Pilot with consented research participants.
11. Calibrate scoring/difficulty/fairness.
12. Independent confirmation.
13. Release Candidate.
14. Production only after evidence + engineering + privacy/security gates.
