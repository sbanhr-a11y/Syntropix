# Protected runtime release policy — proposal v1.0

**Status:** PROPOSED ONLY. This document has no power to authorize a merge, make a failing check pass, or override branch protection.

## Purpose
The V7 public website safety guard `qa/v7-protected-boundary.mjs` intentionally prohibits edits to authentication, assessment, Reviewer Programme, Command, and other protected application surfaces through a public-website-only release. Paid CogniMorph recovery PR #93 changes `assessment-runtime-v3.js` and `auth-passwordless.js` and is therefore correctly rejected by that guard.

## Two distinct release types
- **V7 public website release:** keep the existing protected-boundary guard unchanged and mandatory. No runtime/auth/reviewer modifications permitted.
- **Application security/runtime release:** an independently governed release that MUST run all application, auth, security, browser, report, and Reviewer Programme checks; may include the two specifically approved protected paths only. It must not disguise application changes as a V7-only change.

## Proposed application release control (not implemented)
1. Open a separately titled, traceable application/runtime PR with an immutable commit SHA and exact changed-path allowlist; no permission to touch Reviewer Programme files.
2. Require a human-reviewed security and rollback dossier and an explicit release authorization naming the exact SHA, scope and deployment window.
3. Require a new, independently maintained **mandatory** application-runtime safety workflow. It must fail closed for missing approval, unexpected paths, failed authentication/authorization regression, failed browser coverage, or report-delivery regression.
4. Preserve `qa/v7-protected-boundary.mjs` unchanged and mandatory for V7/public website release branches. The new application workflow cannot silence, skip or rename an existing required check. Repository administrators must explicitly establish branch-protection/ruleset requirements for an application-runtime release rather than pretending a red V7 check is green.
5. Test all positive and negative recovery paths, including UPI approved vs pending/rejected, verified email, cross-assessment and cross-account access, expired magic link, least-privilege participant session, duplicate/older purchase rows, and repeat recovery.
6. Complete end-to-end browser tests (desktop/mobile/Safari), full CogniMorph item completion, refresh/resume, report submit, participant rating, PDF generation, email provider acceptance and delivery evidence.
7. Regress all live Reviewer Programme and Command authentication workflows and the AC/DC baseline. A change that alters those baselines is not eligible for a paid-recovery-only release.
8. Capture backend/frontend production SHAs before rollout, verify staged rollback, deploy as a coordinated release, and reverse both components on failed smoke checks. Never delete approved payment evidence or ask the purchaser to pay again.

## Scope of current incident
Website PR: https://github.com/sbanhr-a11y/Syntropix/pull/93
Backend PR: https://github.com/sbanhr-a11y/syntropix-backend/pull/349

**Current rule:** no production merge while V7 mandatory CI fails. The founder has authorized a review and drafting a proposed policy, not a technical bypass. This proposal is a design for subsequent review, not a substitute for approval or implementation.
