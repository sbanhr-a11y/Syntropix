# Website V7 — Risk, Rollback & Verification Plan

Baseline production commit: `a7ffc84cc071b03497fb6fdd70747649220c3f05`
V7 branch: `website-v7-gold-standard`
Rollback branch: `rollback/pre-v7-2026-10-04`

## Current risk assessment

### Critical — protected application regression
Risk: public-repo edits accidentally alter Command, reviewer programme, assessment runtime, AC/DC, auth or backend behavior.
Control: current V7 diff is limited to `index.html`, `v7-home.css` and V7 documentation. No backend, database, reviewer, Command, assessment-runtime or AC/DC implementation file is changed.
Release rule: any future protected-surface diff blocks release.

### High — homepage reset/invitation routing
Risk: restructuring `index.html` removes the recovery/invitation routing needed by existing flows.
Control: the pre-body recovery script and `assessment-invite-router-v1.js` are preserved. Existing global scripts remain loaded.
Verification: route-specific smoke tests before merge.

### High — shared navigation behavior
Risk: changing markup can conflict with `site-v5.js` or global navigation behavior.
Control: preserve `.v5nav`, `.menu5`, brand and nav structure; change only public labels/destinations.
Verification: desktop/mobile keyboard and pointer tests.

### Medium — 3D/WebGL performance
Risk: hero animation increases main-thread/GPU cost or creates motion/accessibility problems.
Control: preserve existing HCS implementation, which has reduced-motion handling, intersection/visibility pausing and WebGL fallback. V7 does not change the renderer.
Verification: mobile, reduced-motion, WebGL-disabled and background-tab tests.

### Medium — copy/claim inflation
Risk: redesign introduces unsupported customer, validation, certification or outcome claims.
Control: V7 proof language is principle/evidence based. No new client logos, numerical outcomes, certifications or validation claims are introduced.

### Medium — responsive regression
Risk: V7 grid/layout fails at narrow widths or zoom.
Control: V7 CSS is isolated under `body.sx-v7`; responsive breakpoints and reduced-motion rules are included.
Verification: 320/375/390/768/1024/1440 widths plus 200% zoom/reflow.

## Rollback strategy

### Before production
Do not merge PR #88. The production tree remains at the current baseline and rollback is simply abandoning/reverting the V7 branch.

### After a future approved production merge
1. Stop further deployment.
2. Revert the V7 merge commit on `main` (preferred because history remains auditable).
3. If an urgent clean restoration is required, use `rollback/pre-v7-2026-10-04` / baseline `a7ffc84c` as the known-good website state.
4. Redeploy through the existing protected Pages workflow.
5. Smoke-test homepage, Organizations, Professionals, assessment entry points and protected reviewer/Command routes.

Never force-reset production history as the routine rollback method.

## Mandatory pre-merge acceptance
- expected-diff/protected-path review
- homepage HTML/link validation
- desktop + mobile visual QA
- keyboard/focus/landmark/reflow/reduced-motion QA
- Core Web Vitals-oriented performance check
- 3D fallback check
- Organizations/Professionals/Trust/Evidence link smoke tests
- assessment invitation/recovery route smoke tests
- Command/reviewer protected-route regression
- explicit human approval
