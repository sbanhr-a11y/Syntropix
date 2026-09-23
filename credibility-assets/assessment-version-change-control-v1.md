# Assessment Version & Change-Control Standard — v1

Date: 2026-09-23  
Status: CONTROLLED ENGINEERING / EVIDENCE STANDARD

## Purpose

This standard connects software versioning with psychometric evidence. It prevents a changed instrument from continuing to inherit evidence that only applies to an earlier item/scoring/report definition.

## Version model

Use instrument semantic versions MAJOR.MINOR.PATCH independently from application/runtime versions.

### MAJOR
Increment when a change may alter the construct or score meaning materially, including:
- adding/removing a dimension;
- material construct redefinition;
- substantial item-bank replacement;
- response-scale change;
- weighting/model change;
- norm/cut-score framework change;
- consequential-use expansion.

Default evidence effect: prior psychometric evidence does not automatically transfer. New evidence review required.

### MINOR
Increment for changes likely to affect score comparability but not the intended construct family, including:
- adding/removing items;
- changing reverse-keying;
- non-trivial wording changes;
- scoring transformation changes;
- report-band threshold changes;
- locale adaptation that could alter interpretation.

Default evidence effect: comparability/bridge study required before pooling scores across versions.

### PATCH
Use for changes not intended to change the measured construct or score, including:
- typo/punctuation/accessibility fixes;
- report prose clarification;
- non-scoring UI changes;
- evidence disclaimers;
- bug fixes proven not to alter scored responses.

Patch changes still require traceability and regression testing. If a “wording fix” changes likely response interpretation, treat it as MINOR.

## Required release record

Every assessment release must record:
- instrument name/version;
- runtime/application version;
- release date;
- repository commit;
- item-set checksum;
- scoring-spec checksum;
- report-template identifier;
- locales;
- change class;
- evidence impact;
- migration/comparability decision;
- approvers.

## Evidence transfer decision

For every change, choose one:
- FULL TRANSFER — evidence remains applicable;
- CONDITIONAL TRANSFER — evidence remains applicable with documented limitation;
- BRIDGE REQUIRED — direct comparability must be empirically tested;
- NO TRANSFER — new version requires fresh evidence.

The decision and rationale belong in the technical document and evidence register.

## Item lineage

Each item should have a stable lineage ID independent of screen order. Track:
- introduced version;
- retired version;
- wording revisions;
- dimension assignment;
- reverse-key flag;
- rationale;
- content-review evidence.

Renumbering displayed question order must not destroy lineage.

## Scoring integrity

Scoring changes require:
- executable test vectors;
- known-response fixtures;
- expected dimension/overall outputs;
- missing/invalid-response cases;
- backward-comparability decision;
- runtime regression gate.

Do not change scoring and report interpretation in one opaque commit without a written migration note.

## Report-copy control

Interpretive copy can create evidence risk even when scores do not change.

Report-copy changes must be reviewed for:
- predictive/causal implications;
- clinical/neurological implications;
- deterministic identity labels;
- norm/rarity claims;
- guaranteed outcomes;
- unsupported group comparisons.

Copy-only changes may be PATCH when response behaviour/scoring are unaffected, but they still require evidence-language review and browser/report regression testing.

## Locale/adaptation control

Translation is not a cosmetic patch. Each locale requires:
- source/target version mapping;
- translation/adaptation method;
- cultural/linguistic review;
- cognitive testing where appropriate;
- evidence-impact decision;
- separate locale identifier.

Do not assume English-language evidence transfers unchanged.

## Runtime-family boundary

Professional Runtime v3, Suite v2 and Consumer Insight Suite remain independent evidence families. Shared JavaScript utilities do not establish psychometric equivalence.

## Rollback

Every production assessment release must have:
- previous known-good commit;
- reversible deployment path;
- database/backward-compatibility note where relevant;
- explicit decision on whether responses collected under a faulty version can be rescored or must be excluded.

## Approval gate

No release may be described as evidence-supported beyond its prior status until the technical document and claim register are updated for the new version.
