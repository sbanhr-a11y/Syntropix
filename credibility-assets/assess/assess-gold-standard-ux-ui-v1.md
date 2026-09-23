# Syntropix Assess — Gold Standard UX / UI Design Standard v1

Date: 2026-09-23
Status: PRODUCT DESIGN STANDARD / PRE-BUILD
Scope: Candidate Assess experience, employer report experience, Syntropix Command Assess operations

## Product principle

**Gold-standard science must be matched by gold-standard interaction design.**

Assess must feel like a premium global decision-intelligence product, not an online examination portal.

The design should inherit the Syntropix V6 Intelligent Humanism system:
- editorial discipline;
- premium restraint;
- evidence clarity;
- human-first language;
- progressive disclosure;
- WCAG 2.2 AA target;
- no decorative complexity without functional purpose.

## Brand tokens

Use approved V6 semantic system:
- Near Black #070908
- Dark Card #0D0E0D
- Warm Ivory #F4F2EC
- Champagne #D6B878
- Champagne highlight #E7D09A
- Emerald #2F8F6B
- Sage #7FA58F
- Slate Blue #6677A8
- Plum #5A345A
- restrained amber/red only for status/risk

Assess should not create a disconnected visual brand.

## 1. Candidate experience

### Pre-assessment landing
The candidate should see, without scrolling excessively:
- assessment name;
- employer/role context where appropriate;
- expected duration;
- number/type of sections;
- AI-use rules;
- accessibility/accommodation route;
- privacy/evidence boundary;
- “what this is / what this is not”;
- save/restart policy;
- one dominant Begin CTA.

Avoid scientific jargon.

### Assessment navigation
Candidate always knows:
- current section;
- progress;
- approximate remaining time;
- whether responses can be revisited;
- AI rule for current section.

Do not show:
- difficulty labels;
- construct names that invite gaming;
- scoring weights;
- correct/incorrect feedback during selection.

### Stateful scenario interface
Use a three-zone layout where screen width permits:
1. Scenario / evidence panel
2. Decision workspace
3. Context/evidence drawer

As new information arrives, visually distinguish:
- **New evidence**
- **Changed constraint**
- **Consequence**

Preserve the prior decision state visibly enough for challenge-back coherence without exposing scoring.

### Complexity experience
Do not label CX1–CX4 to candidates.

Complexity progression should be experienced through richer context, not “hard question” badges.

### Accessibility
- keyboard complete;
- visible focus;
- screen-reader landmarks;
- sufficient contrast;
- text alternatives;
- no meaning conveyed by colour alone;
- reduced motion;
- zoom/reflow support;
- accommodation path before starting;
- timing accommodations supported by policy.

### Error prevention
- autosave;
- explicit connection state;
- recovery after refresh;
- warnings before irreversible submit;
- no lost responses on accidental navigation where technically feasible.

### Mobile
Mobile may be supported for appropriate sections, but data-heavy scenarios may recommend desktop/tablet transparently rather than pretending all tasks are equally usable on a phone.

## 2. Role Intelligence client UX

Default workflow:

**Upload JD / paste role → Assessment ready**

Show a premium inference card:
- detected job family;
- level;
- people responsibility;
- role pressures;
- recommended Signal product;
- estimated time.

Primary CTA:
**Send assessment**

Secondary:
**Review role interpretation**

Calibration is optional.

Only ask a clarification when Role Intelligence confidence is below an internally defined threshold or multiple materially different role mappings remain plausible.

Never ask the TA user to choose psychometric constructs or weights.

## 3. Employer evidence report UX

The report must optimize for a 60-second first read and deeper inspection when desired.

### Page / screen 1
- Candidate + role
- Role Evidence Barometer
- Evidence Confidence
- 3 strongest evidence themes
- 2–3 areas to verify
- recommended interview probes
- assessment integrity state

### Evidence barometer
Use human-readable categorical language:
- Strong evidence for progression
- Positive evidence
- Mixed evidence
- Limited evidence
- Insufficient evidence

Do not display probability-like percentages until empirically calibrated.

### Complexity Range
Display:
- Clear Context
- Competing Priorities
- Ambiguous Trade-offs
- High-Consequence Complexity

For each:
- Consistent / Mostly consistent / Variable / Limited evidence
- observation count
- confidence cue

### Construct drill-down
Each construct shows:
- concise definition;
- observed pattern;
- supporting scenario categories;
- complexity distribution of evidence;
- contradictions;
- why it matters to the role;
- interview verification question.

Avoid radar charts as the only representation.

### Contradiction view
Prominent but non-accusatory:
**Evidence tensions to verify**

Example:
“Delegation decisions were balanced in normal conditions but became substantially more controlling when deadline risk increased.”

### Assessment Integrity
Separate from suitability evidence:
- Higher confidence
- Standard remote-assessment confidence
- Verification advised

Never “AI detected” or “cheating suspected” without defensible evidence.

## 4. Syntropix Command — Assess operations UX

Current Command is functionally rich but visually inconsistent: global shell remains utilitarian while AC/DC has begun receiving a premium operations layer.

Assess should establish the design direction for the next Command generation.

### Navigation
Replace the expanding flat tab row over time with a structured application shell:
- Overview
- Assess
- Enterprise
- AC/DC
- Talent
- Revenue
- Concierge
- System

Sub-navigation lives inside domains.

### Assess workspace
Proposed sections:
- Overview
- Role Intelligence
- Assessment Forms
- Item Bank
- Job Families
- Candidate Sessions
- Evidence Integrity
- Reports
- Validation
- Release Governance

Do not expose all sections to all Command roles.

### Assess cockpit
At-a-glance:
- live/active assessment versions;
- sessions in progress;
- integrity verifications pending;
- item exposure warnings;
- validation sample counts;
- release gates;
- recent incidents/errors;
- evidence/claim status.

### Item Bank UI
Every item card must expose controlled metadata:
- construct;
- subconstruct;
- job family;
- CX level;
- intended empirical difficulty;
- empirical difficulty after calibration;
- discrimination;
- AI rule;
- item version;
- evidence status;
- exposure count;
- review state.

Item editing must be version-controlled and never silently alter a live assessment.

### Scenario Studio
Purpose-built editor:
- scenario canvas;
- evidence blocks;
- response options;
- branching consequence map;
- scoring rubric;
- complexity metadata;
- preview candidate experience;
- accessibility preview;
- SME review comments;
- validation state;
- version history.

### Release workflow
Draft → Expert Review → Cognitive Test → Pilot → Calibrated → Release Candidate → Live → Retired

No single click should turn an unreviewed draft item into production.

## 5. Visual hierarchy

Candidate:
quiet, focused, low cognitive clutter.

Client report:
editorial + analytical.

Command:
dense but calm, premium operational intelligence.

Use data density through hierarchy, whitespace and progressive disclosure rather than tiny text or dashboard-card overload.

## 6. Motion

Use motion only for:
- state changes;
- progressive scenario evidence;
- progress;
- successful save;
- expanding analytical detail.

Reduced-motion compatible.

No decorative parallax in assessment sessions.

## 7. Trust cues

Candidate:
- clear rules;
- exact time expectation;
- privacy;
- accommodation;
- assessment purpose;
- human-decision boundary.

Client:
- instrument version;
- evidence status;
- interpretation limitations;
- role mapping;
- auditability;
- confidence indicators;
- human decision boundary.

Internal Command:
- version;
- owner;
- release state;
- evidence links;
- audit history.

## 8. Design acceptance gate

No Assess feature is “done” only because it works.

Release requires:
- desktop / tablet / supported mobile review;
- keyboard flow;
- screen-reader semantics;
- reduced motion;
- no layout overflow;
- realistic long-copy scenarios;
- slow-network state;
- recovery state;
- timeout/accommodation state;
- no console errors;
- exact-version assessment regression;
- evidence wording review;
- report print/PDF parity.

## 9. Command modernization boundary

Do not redesign all Command at once while building Assess.

Sequence:
1. establish shared Command vNext tokens/shell;
2. build Assess as first gold-standard domain;
3. preserve existing workflows/functionality;
4. migrate other Command domains progressively after Assess stabilizes;
5. regression-test each migration.

Assess should become the reference implementation for the future premium Command experience.
