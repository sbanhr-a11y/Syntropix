# Syntropix Website Architecture Blueprint v2.0

## Decision
Keep the hybrid B2B + B2C model, but separate marketing journeys from authenticated applications. Do not build a monolithic enterprise portal inside the public website.

## Architecture
Public website: `/`, `/enterprise`, `/professionals`, `/science`, `/trust`, `/about`, `/contact`, `/privacy`, `/terms`.

Authenticated products are separate application surfaces: `command.syntropix.in` for internal operations; a future enterprise workspace should use `app.syntropix.in` only after tenant isolation, authorization, audit and privacy controls are proven.

## Homepage
1. Clear outcome-led hero: understand capability, develop managers, make better people decisions.
2. Two explicit journeys: Organizations and Professionals.
3. Capability system: Assess → Diagnose → Develop → Apply → Measure.
4. Enterprise solutions: manager development, assessment/development centres, Prism360, coaching, learning/capability programmes, compliance learning and talent solutions.
5. Individual assessments as a distinct retail section with independent checkout.
6. Evidence & methodology preview linking to `/science`.
7. Trust preview linking to `/trust`.
8. Founder experience and attributable evidence; do not imply prior-employer work was delivered by Syntropix.
9. CTA: enterprise discovery call / explore individual assessments.

## Enterprise page
This is a sales and solution page, not an administrative dashboard. It should explain problems solved, programmes, delivery model, measurement, integrations, security/privacy and a discovery CTA. Do not publicly promise features that are not production-ready.

## Professionals page
Assessment catalogue, intended developmental use, time, price, report contents, limitations, privacy, purchase flow and support. Separate individual purchases from employer-sponsored assessment assignments.

## Science page
Maintain a Claims Ladder. Distinguish theory evidence from evidence for each proprietary instrument. Publish construct definitions, item-development methodology, reliability/validity evidence when actually available, sample characteristics, version/date, limitations and appropriate-use statements. Never describe an instrument as validated, predictive, diagnostic, neurological or clinically meaningful without instrument-specific evidence.

## Trust page
State Syntropix controls separately from infrastructure-provider controls. Supabase/Render certifications may be described as provider certifications; they are not Syntropix certifications. Publish data categories, purposes, subprocessors, encryption/transport controls, retention principles, access controls, incident contact, data-subject request channel and multi-rater confidentiality rules. Do not publish `SOC 2 Type II` or `ISO 27001` as Syntropix badges unless Syntropix itself obtains those attestations/certifications.

## Prism360
Manager responses may be individually attributable where disclosed. Peer/direct-report/stakeholder reporting must enforce confidentiality thresholds. Minimum n=3 is a reporting threshold, not a promise that identity can never be inferred. Do not automatically pool a sub-threshold group into `Other Raters` unless the combined pool itself meets the threshold and the aggregation cannot expose identity. Suppress otherwise. Document retention and deletion separately from anonymity.

## Enterprise application — future gated release
Minimum foundation before launch: organization/tenant model; membership + roles; RLS tenant isolation; server-side privileged actions; immutable audit events; invitation lifecycle; assessment assignment/licensing; private file storage; bulk import validation/preview; idempotency; rate limits; retention/deletion; exports; accessibility; monitoring; backup/recovery; privacy notices; support/admin controls.

Do not allow arbitrary HTML email templates. Use sanitized plain/rich text templates and an allow-listed token renderer. Do not create a generic `bypass checkout token`; use scoped, single-purpose, expiring, one-time assignment/invitation tokens stored hashed where practical.

## Integrations/webhooks
Do not claim native Keka, Darwinbox, HR One, Oracle, Taleo or SuccessFactors integrations until each connector is implemented and tested. Until then use `integration-ready architecture` or `integration discovery available`. Outgoing webhooks should use per-tenant secrets and HMAC signatures, timestamp/replay protection, idempotency keys, retries with backoff, delivery logs and secret rotation. Never expose a private signing key in browser code.

## Bulk upload
CSV first. Validate MIME/size/row limits, normalize headers, preview before commit, reject formula injection and malformed rows, provide row-level errors, enforce tenant authorization, deduplicate safely, audit imports and define retention for source files. XLSX can follow after the CSV pipeline is hardened.

## Data model
Avoid an undefined polymorphic transaction model. Use explicit domains: organizations, memberships, individual customers, products, orders/payments, enterprise contracts, entitlements/licenses, assessment assignments, assessment attempts/results, Prism360 projects/raters/responses, communications, consent/privacy events, integrations/webhook deliveries and audit logs. Keep assessment data separate from billing data where practical.

## Security baseline
Least privilege, RLS for exposed tenant tables, authenticated JWTs, no service-role key in browsers, MFA for privileged/admin users, strong password/breach screening, strict CORS/CSP/security headers, rate limits, CSRF review where cookies are used, private storage, signed/expiring downloads, secrets only server-side, dependency scanning, audit logging, backup/export, restore test and incident-response procedure.

## Accessibility / quality
Target WCAG 2.2 AA for public and authenticated experiences. Responsive design, keyboard navigation, semantic markup, labelled inputs, visible focus, reduced-motion support, meaningful errors and performance budgets.

## Delivery sequence
Phase 0 — claims/content/security inventory and backups.
Phase 1 — restructure the public website and launch `/enterprise`, `/professionals`, `/science`, `/trust` without changing assessment transactions.
Phase 2 — harden shared data model, privacy, auth and tenant primitives.
Phase 3 — build enterprise MVP: org admin, invitations, license/assignment management, status tracking and safe CSV import.
Phase 4 — Prism360 enterprise administration after confidentiality and lifecycle tests.
Phase 5 — communications and audited integrations/webhooks.
Phase 6 — progressive rollout to pilot tenants, security review, recovery test and then general availability.

## Launch gates
No launch merely because UI is finished. Each phase requires functional acceptance, authorization/RLS tests, privacy/claims review, dependency/security scan, rollback path and production smoke test.

## Explicitly rejected from v1
- `SOC 2 Type II Metadata` presented as if Syntropix-certified.
- Infrastructure certification inheritance claims.
- `objective metrics for promotion-readiness` without validated job-related evidence.
- unrestricted HTML communication templates.
- checkout-bypass tokens.
- browser-accessible cryptographic private keys.
- automatic pooling of confidential rater groups without a safe combined threshold.
- claiming unbuilt HRIS integrations as native.
- launching all enterprise modules in a nine-week big-bang sequence.
