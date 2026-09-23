# Assessment Runtime Reconciliation — v1

Date: 2026-09-23
Status: CONTROLLED EVIDENCE RECORD

## Finding
The production repository contains **three distinct assessment architectures** that must not be conflated.

### 1. Canonical paid/professional runtime v3
`assessment-registry-v3.js` + `assessment-runtime-v3.js` implement ten named professional instruments: Managerial Effectiveness Index, Executive Leadership Index, CogniMorph Index, Coachability Quotient, Metacognitive Executive Assessment, Cognitive Learning Profiler, Self-Limiting Belief Auditor, Strategic Inversion Diagnostics, Commercial Instinct Index and Communication Signature.

The registry declares source SHA-256 `fc3277609366dcd733112f02d0a955af31dc9becd39ec07f517eb94e94569098`. Runtime v3 uses a six-point 1–6 response scale, reverse scores as `7 - raw`, converts dimension means to 0–100, and submits report payloads with runtimeVersion 3.0.0 plus registryHash.

### 2. Separate suite-v2 runtime
`assessment-suite-v2.js` + `assessment-validation-v2.js` implement a different ten-instrument developmental suite. Suite v2 uses a five-point 1–5 scale, reverse scores as `6 - raw`, and reports within-scale means plus percent-of-scale. It is not evidence for the v3 professional instruments.

### 3. Consumer Insight Suite runtime
`consumer-insight-suite.js` + `consumer-insight-runner.js` + shared `assessment-validation-v2.js` implement a separate Consumer Insight Suite that includes:
- Relationship & Intimacy Blueprint
- Shadow Pattern Map
- Attention & Reward Rhythm Map

For the current declared instrument version 1.0.1, each has 20 items, four dimensions with five items each, a 1–5 response scale, and no reverse-keyed items. The shared scoring engine computes dimension means and percent-of-scale; overall is the unweighted mean of dimension means. These instruments are explicitly marked research-informed / validation in progress, developmental, non-normative, non-selection and non-clinical. The self-serve runner restricts access to adults 18+ and includes explicit non-diagnostic boundaries.

This architecture was initially missed by code search because the instruments are defined in `consumer-insight-suite.js` rather than the professional v3 registry. The production deployment workflow independently confirms the Relationship & Intimacy Blueprint is expected in that suite, and direct source inspection verified all three.

## Evidence-control consequence
- Ten professional v3 instrument documents may record verified implementation facts while remaining DEVELOPMENTAL / EVIDENCE-BUILDING psychometrically.
- The three Consumer Insight technical documents may now record their verified version-1.0.1 implementation facts, but **must not inherit v3 scoring, timing, thresholds or psychometric claims**.
- Suite-v2 instruments require their own technical-document family if retained as active products.
- No architecture may borrow validation, reliability, norms, predictive utility or fairness evidence from another architecture merely because they share Syntropix branding or a scoring utility.

## Claim correction status
A high-risk claims redline has been applied to the v3 registry. Unsupported inherited-predictor language, deterministic promotion/career outcomes, neurological framing, guaranteed intervention effects and over-strong labels have been softened to developmental / association-based wording. Remaining scientific claims should continue to be governed by the formal claims register and version-specific evidence policy.

## Publication rule
External research may support a source construct or research tradition without establishing the psychometric properties of a Syntropix instrument. Stronger claims require evidence tied to the exact Syntropix version, population and intended use.
