# Assessment Runtime Reconciliation — v1

Date: 2026-09-23
Status: CONTROLLED EVIDENCE RECORD

## Finding
The production repository contains two distinct assessment architectures that must not be conflated.

### Canonical paid/professional runtime v3
`assessment-registry-v3.js` + `assessment-runtime-v3.js` implement ten named professional instruments: Managerial Effectiveness Index, Executive Leadership Index, CogniMorph Index, Coachability Quotient, Metacognitive Executive Assessment, Cognitive Learning Profiler, Self-Limiting Belief Auditor, Strategic Inversion Diagnostics, Commercial Instinct Index and Communication Signature.

The registry declares source SHA-256 `fc3277609366dcd733112f02d0a955af31dc9becd39ec07f517eb94e94569098`. Runtime v3 uses a six-point 1–6 response scale, reverse scores as 7 − raw, converts dimension means to 0–100, and submits report payloads with runtimeVersion 3.0.0 plus registryHash.

### Separate suite-v2 runtime
`assessment-suite-v2.js` + `assessment-validation-v2.js` implement a different ten-instrument developmental suite. Suite v2 uses a five-point 1–5 scale, reverse scores as 6 − raw, and reports within-scale means plus percent-of-scale. It is not evidence for the v3 professional instruments.

### Public technical-note-only names
Relationship & Intimacy Blueprint, Shadow Pattern Map and Attention & Reward Rhythm Map are present in the newer public technical-note register but were **not found in the canonical v3 registry inspected in this pass**. Their technical documents therefore remain scaffold-only. No item count, scoring algorithm, dimension structure, validation status or runtime version may be inferred for them until a canonical implementation is located or deliberately created under change control.

## Evidence-control consequence
Ten v3 instrument documents may now record verified implementation facts while remaining DEVELOPMENTAL / EVIDENCE-BUILDING psychometrically. The three technical-note-only instruments remain implementation-unverified. Suite-v2 instruments require their own technical-document family if they are retained as active products.

## Claim correction queue
Some legacy registry narrative uses stronger phrases such as “predict”, “validated”, “real neuroscience”, “diagnostic”, “high-stakes”, and statements implying decision-readiness. Those phrases are not supported merely by the presence of research foundations or by software implementation. They should be redlined against the current evidence policy before any next public credibility release. This record does not modify runtime copy.
