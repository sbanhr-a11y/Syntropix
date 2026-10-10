# Paid assessment recovery — protected release dossier (2026-10-11)

**Decision:** HOLD production promotion while mandatory V7 public-website safety QA is red. Founder authorization permits a documented review, not a bypass or disabling checks.

## Scope

Website changes on PR #93 are confined to `assessment-runtime-v3.js` and `auth-passwordless.js`. Backend recovery and notification changes are on `sbanhr-a11y/syntropix-backend#349`. Protect the running Reviewer Programme, Command, AC/DC, live payments, and production Supabase identities.

## Verified evidence

- Approved synthetic CogniMorph UPI request and a matching synthetic purchase in isolated staging Supabase.
- Render staging startup log: `[PAID ACCESS UAT] PASS: synthetic verified OTP, email match, negative access tests, entitlement and least-privilege session.`
- Staging email delivered to the internal test mailbox. Link used `/signin.html#type=magiclink&token_hash=…&returnTo=…`, pointing to the correct CogniMorph assessment; token not copied into this document.
- Backend CI security, authentication, and dependency checks green; website canonical assessment runtime and research IP guards green.
- V7 public website safety QA fails as designed because these files are protected. **Do not relabel this failure as a pass.**
- Staging self-test environment flag disabled after passing.

## Mandatory production criteria (all required)

1. A documented release policy for protected code, with appropriately authorized review and unchanged mandatory check semantics. No weakening, renaming, conditional skipping, or deletion of V7 guard.
2. Independent browser QA on desktop and Safari/mobile for newly-created paid account, previously signed-in paid account, expired link, wrong email, second unpaid instrument, multiple consecutive recoveries.
3. Finish all 20 CogniMorph items, preserve answers across ordinary reload/refresh where supported, and verify rating, PDF generation, email delivery, and session lifespan.
4. Confirm reviewer/Command access, login recovery, CORS and 35 AC/DC self-tests remain green after staging and after promotion.
5. Capture production backend+website baseline SHAs, rollout order, minimal smoke plan and reversal order; abort and roll back on failed monitoring.
6. Confirm no real production email or payment is used for synthetic staging QA.

## Rollback and founder notification

Stop immediately on unexpected production API/website mismatch or failed review regression. Revert the public website to its preceding SHA, roll back payment route backend to its preceding SHA, validate Reviewer Programme/Command health, and communicate status. Preserve the purchaser's approved payment and audit history.

**Never request repayment.** The real CogniMorph payment is approved but live access remains pending rollout.

## Isolated integration QA
This draft branch targets the governance proposal only, never production main. Browser and delivered-report end-to-end proof is still required before promotion.
