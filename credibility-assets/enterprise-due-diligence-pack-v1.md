# Syntropix Enterprise Due-Diligence Pack — v1.0

Date: 2026-09-23
Status: Controlled response pack; complete deployment-specific fields before external issue.

## 1. Company and service scope
Syntropix Technologies (OPC) Private Limited provides technology-enabled developmental assessments, leadership/manager development, 360° feedback, assessment-centre/talent workflows, coaching, employee-experience measurement and related capability services. Product scope for a client must be stated in the order/SOW.

## 2. Evidence and responsible-use boundary
Syntropix separates published research from proprietary-instrument evidence. Current public individual instruments are positioned as developmental/evidence-building unless a version-specific technical document states a stronger supported use. Standalone scores must not be represented as clinical diagnoses or guaranteed predictors of performance.

## 3. Architecture/provider register
Current public trust materials identify Supabase, Render, Postmark, GitHub Pages and optional Meta/WhatsApp Business paths. Before contracting, confirm the provider register current for the proposed deployment, data categories processed, region/configuration and contractual role. Provider certifications are not Syntropix certifications.

## 4. Security questionnaire master responses
| Topic | Controlled response | Evidence to attach |
|---|---|---|
| Access control | Privileged operations and secrets are kept server-side; role/workflow boundaries are used for sensitive operations. Deployment-specific roles must be documented. | architecture/access-control evidence |
| Encryption | State actual provider/application encryption in transit/at rest only after configuration verification. | provider/config evidence |
| Logging/audit | State events actually logged and retention only after environment verification. | log/control evidence |
| SDLC/release | Public presentation changes use regression/release gates intended to protect assessment/auth/enterprise runtime. | CI/release evidence |
| Vulnerability management | Provide current dependency/scanning/patch process when verified. Do not claim continuous scanning unless evidenced. | scan/process evidence |
| Incident response | Contract pack must identify reporting channel, triage owner, escalation and notification obligations. | IR plan |
| Backup/recovery | State actual backup, restore and RPO/RTO only after production configuration evidence exists. | backup/restore evidence |
| Business continuity | Describe tested continuity procedures, not aspirations. | BCP/test record |
| Pen test | Provide date/scope/findings status only when a real test exists. | report/attestation |
| Certifications | Do not claim Syntropix SOC 2/ISO certification unless awarded to Syntropix and current. | certificate |
| AI | Developmental assistance must not be framed as autonomous clinical or employment decision-making. Record model/provider/data path for each deployment. | AI data-flow record |

## 5. Privacy questionnaire master responses
For each deployment document: controller/processor roles; categories of data subjects and personal data; purpose; instructions; lawful basis allocated to the appropriate party; retention; deletion/return; data-subject request cooperation; subprocessors; international transfers; confidentiality; security measures; breach process; audit/information rights; and special-category/sensitive data restrictions.

## 6. 360 and employee-listening confidentiality
Minimum-group thresholds are disclosure safeguards, not guarantees of anonymity. Configuration must consider subgroup combinations, role context, free text, complementary suppression and local consultation/legal requirements. Raw identifiable response export is not a default manager capability.

## 7. Procurement evidence room index
Provide only applicable/current records:
- corporate registration/tax documents requested by buyer;
- signed order/SOW and service description;
- DPA and subprocessor schedule;
- architecture/data-flow diagram;
- access-control matrix;
- retention/deletion schedule;
- incident-response procedure;
- backup/restore evidence;
- vulnerability/penetration-test evidence when available;
- privacy notice/consent copy;
- instrument technical document(s);
- accessibility statement/test evidence;
- business continuity evidence;
- insurance certificates if actually held and requested.

## 8. Claims requiring verification before answer
Never pre-fill “Yes” for: SOC 2/ISO certification, penetration testing, specific RPO/RTO, data residency, 24/7 SOC, vulnerability-scan frequency, breach-notification hours, cyber-insurance limits, uptime SLA, or regulatory registrations unless current evidence confirms it.

## 9. Due-diligence issue workflow
1. Freeze product/deployment scope.
2. Assign questionnaire owner.
3. Answer from evidence room, not memory.
4. Mark unknown/not yet implemented explicitly.
5. Route legal clauses to counsel; security claims to technical owner.
6. Record buyer-specific deviations.
7. Approve final response and archive issued version.


## Verified infrastructure evidence snapshot — 2026-09-23

Status labels below mean **VERIFIED CONFIGURATION**, **VERIFIED GAP**, or **NOT YET VERIFIED**. They are not certifications.

| Control / fact | Status | Evidence observed | Procurement-safe statement |
|---|---|---|---|
| Production backend hosting | VERIFIED CONFIGURATION | Render service `syntropix-backend`, branch `main`, Singapore region, Node runtime, auto-deploy on commit | Production application backend is deployed on Render in Singapore. |
| Staging backend separation | VERIFIED CONFIGURATION | Separate Render service `syntropix-backend-1`, branch `staging`, Singapore region | A separate staging backend service is maintained from the production service. |
| Backend network exposure | VERIFIED CONFIGURATION / REVIEW REQUIRED | Render web service IP allow list permits `0.0.0.0/0`; public web-service exposure is expected, so application-layer authorization must remain the control boundary | The backend is internet-reachable as a web service; endpoint authorization and application controls require endpoint-level verification. Do not claim private-network-only hosting. |
| Production database region | VERIFIED CONFIGURATION | Supabase project `jjcjqspkpqxypvingvqs` is ACTIVE_HEALTHY in `ap-southeast-2` | Production data services currently use a Supabase project in the ap-southeast-2 region. |
| Staging database region | VERIFIED CONFIGURATION | Supabase project `syntropix-staging` is ACTIVE_HEALTHY in `ap-northeast-2` | Staging uses a distinct Supabase project in ap-northeast-2. |
| RLS enabled on public tables | VERIFIED CONFIGURATION | Supabase inventory reports RLS enabled on all public tables returned in both inspected projects | Row Level Security is enabled on the inspected public-schema tables. This statement alone does not establish correct authorization policy coverage. |
| RLS policy coverage | VERIFIED GAP / REVIEW REQUIRED | Supabase security advisor reports 45 production and 53 staging tables with RLS enabled but no policy | A significant set of RLS-enabled tables currently has no RLS policy. This may intentionally deny Data API access, but each table's exposure and backend access path must be reviewed before representing policy completeness. |
| Leaked-password protection | VERIFIED GAP | Supabase security advisor reports leaked-password protection disabled in both projects | Do not claim compromised-password screening is enabled. Remediation should be evaluated for Supabase Auth accounts. |
| Audit/event tables | VERIFIED CONFIGURATION | Database includes command audit and AC/DC audit/event structures | Audit/event data structures exist; retention, immutability, monitoring coverage and review cadence remain to be verified before stronger audit-logging claims. |
| Backup / PITR / RPO / RTO | NOT YET VERIFIED | No evidence captured in this pass | No contractual backup, PITR, RPO or RTO statement should be issued until plan/configuration and restore evidence are captured. |
| Encryption at rest / in transit | NOT YET VERIFIED AS SYNTROPIX CONTROL | Provider capabilities have not yet been mapped to exact contracted/project configuration in this evidence record | Do not issue an absolute encryption claim from assumption; attach provider/configuration evidence first. |
| SOC 2 / ISO certification | NOT YET VERIFIED FOR SYNTROPIX | No Syntropix certification evidence captured | Do not state that Syntropix is SOC 2 or ISO certified. Provider certifications, if cited later, must be clearly attributed to the provider. |
| Data retention/deletion | NOT YET VERIFIED | Schema presence observed; policy + deletion jobs not yet evidenced | Do not promise fixed retention or automated deletion periods until code/database jobs and policy are reconciled. |
| Incident response / breach SLA | NOT YET VERIFIED | No approved incident-response artifact verified in this pass | Do not promise a fixed notification-hour SLA until legal and operational controls support it. |

### Security-advisor interpretation
An `RLS enabled, no policy` finding does **not automatically mean public read/write exposure**: with RLS enabled and no applicable policy, Data API access is normally denied. However, it is still a governance gap because Syntropix must document which tables are intentionally backend-only, which roles can access them, and whether privileged server-side access bypasses RLS. The remediation pass must therefore be table-by-table and must not create permissive policies merely to silence the advisor.

Supabase advisor reference: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy


## Production authorization classification — 2026-09-23

A read-only privilege inspection was run against the production Supabase project. For the 45 tables flagged by the advisor as **RLS enabled with no policy**, the inspected `anon` and `authenticated` roles also had **no SELECT or INSERT table privilege**. This materially changes the risk interpretation: the inspected findings are consistent with a deny-by-default/backend-only posture rather than evidence of anonymous browser exposure.

This does **not** prove complete authorization security. Server-side service credentials or privileged database roles can bypass RLS, so the backend's endpoint authorization, credential handling and least-privilege design remain a separate control surface to verify. Supabase documents that once RLS is enabled, publishable-key API access is unavailable until policies permit it, and that service keys/roles can bypass RLS.

### Classification decision
- Do **not** add permissive RLS policies merely to clear the advisor.
- Preserve deny-by-default for backend-only tables unless a documented product requirement needs direct Data API access.
- Before exposing any table to `anon` or `authenticated`, define the ownership/tenant authorization model, explicit grants, RLS policy, tests and rollback together.
- Tables with existing authenticated privileges/policies (including command/CRM surfaces observed in the inventory) require a separate policy-quality review; policy count alone does not establish correct tenant/owner isolation.
- Backend privileged access remains **NOT YET VERIFIED** because code search did not produce sufficient evidence in this pass; do not infer absence of privileged credentials from an empty code-search result.

### Current conclusion
The 45 production advisor findings should presently be recorded as **REVIEWED — INTENTIONAL DENY-BY-DEFAULT CANDIDATES**, not as confirmed public-data vulnerabilities and not as remediated controls. Final closure requires endpoint/data-flow mapping and explicit owner approval of the backend-only classification.


## Existing-policy quality review — 2026-09-23

The production RLS policy definitions were inspected read-only. The review confirms two materially different authorization patterns.

**Backend-only / deny policies.** Core assessment, billing, entitlement, organisation, Prism360, session, purchase, research-credit, chat and related tables inspected use explicit `false` policies for `anon` / `authenticated`, or otherwise have no client grants. This is consistent with a server-mediated access model.

**Syntropix Command internal policies.** Command/CRM/ATS policies allow authenticated users when a matching `command_users` record is active. `command_users` itself is self-readable; audit-log read is founder-only, while authenticated users may insert an audit event when `actor_user_id = auth.uid()` or is null. CRM account updates include owner/founder/TA-lead logic, but several CRM/ATS read/write policies authorize any active Command user rather than constraining rows by `org_id`, owner, account, or tenant.

### Risk classification
Current policy design is acceptable only if Syntropix Command is intentionally a **single trusted internal workspace** whose active users are permitted to see the shared CRM/ATS dataset. It is **not sufficient evidence of tenant isolation** for a future multi-organisation Command product. The schema already contains `command_users.org_id` and multiple organisation/account/owner fields, so future tenant expansion must not rely on the current active-user-only predicates.

Sensitive ATS fields observed include candidate contact details, compensation, interview feedback and recruiter notes. This increases the consequence of over-broad internal access and makes least-privilege role design important before additional Command users are activated.

### Required controls before multi-user / multi-tenant expansion
1. Formally declare current Command scope: single-organisation trusted internal workspace, or multi-tenant product.
2. If multi-tenant: add organisation/tenant predicates to relevant CRM/ATS policies, define cross-tenant founder/admin exception deliberately, and test read/insert/update/delete isolation with separate authenticated identities.
3. Review role-based access for candidate PII, compensation, interview feedback, offers and placements; `status='active'` alone should not become the long-term authorization model for sensitive recruitment data.
4. Tighten audit-event provenance: assess whether allowing `actor_user_id IS NULL` for authenticated inserts is necessary; if retained, document the use case and server-side provenance control.
5. Preserve deny-by-default on customer/product tables unless direct browser access is explicitly required.

### Current evidence statement
**VERIFIED:** RLS is enabled; explicit deny policies protect many server-mediated tables; Command access is tied to an active authenticated Command user; founder-only audit read exists.

**LIMITATION:** Current CRM/ATS policies are primarily workspace-membership based, not demonstrated tenant-row isolation. Syntropix must not claim row-level tenant isolation for Command/ATS from this evidence alone.


## Backend-mediated access verification — 2026-09-23

Backend source and deployment configuration were inspected read-only.

### Verified trust boundary
- Render production runs the private `syntropix-backend` repository from `main` using `node server.js`; staging runs the same repository from `staging`.
- The shared database module creates the Supabase client from `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The source explicitly states the service-role credential is backend-only and must never be shipped to the frontend.
- Because the service role is privileged and can bypass RLS, **backend route authorization and query scoping are the effective authorization boundary for server-mediated data access**. RLS deny policies remain useful defense against browser/publishable-key access but do not constrain privileged backend queries.
- Command browser authentication receives only `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` from `/api/command/config`; no service-role credential is returned by that endpoint in the inspected source.
- `requireCommandUser` validates the bearer token with Supabase Auth, loads the matching `command_users` row, and requires `status='active'` before protected Command/CRM routes continue. A separate `allowCommandRoles` middleware exists for routes that opt into role restrictions.

### Verified CRM authorization behavior
The currently inspected CRM routes are protected by `requireCommandUser`, but their service-layer database queries use the privileged backend client and are not organisation-scoped:
- account listing selects all non-archived `crm_accounts`;
- contact listing selects all non-archived contacts unless an account filter is supplied;
- opportunity listing selects all non-archived opportunities unless an account filter is supplied;
- opportunity update targets the supplied row id directly after Command membership authentication.

Therefore, the current application behavior matches the database-policy conclusion: **Command is presently a shared trusted internal workspace, not a demonstrated multi-tenant-isolated CRM.** Adding organisation-aware RLS alone would not fix privileged backend access; tenant enforcement must also be implemented in backend query scoping and authorization checks.

### Credential/control conclusion
**VERIFIED:** the service-role secret is referenced server-side; the inspected public Command config exposes only the publishable key; protected Command/CRM routes authenticate the bearer token and active Command membership.

**NOT VERIFIED / LIMITATION:** least-privilege database credentials are not used for the inspected server data path; service-role access is broad by design. Secret rotation cadence, Render environment-variable access governance and historical secret exposure have not yet been evidenced. No secret value was retrieved or recorded during this review.

### Required hardening before external/multi-tenant Command
Tenant isolation must be enforced twice: (1) backend queries must derive the allowed organisation from the authenticated Command identity and scope every relevant query/mutation accordingly; and (2) browser-accessible database paths must retain explicit grants/RLS appropriate to the same model. Object IDs supplied by clients must never be sufficient authorization by themselves. Role restrictions should be applied to sensitive recruitment/compensation actions, and negative cross-tenant tests should be part of the release gate.


## Endpoint authorization / BOLA review — 2026-09-23

A targeted read-only source review covered Command dashboard/readiness, CRM, payment administration, enterprise console and validation analytics.

### Positive controls verified
- Payment administration is protected by active Command authentication **and** founder/admin/master role middleware.
- Enterprise organisation creation, admin invitation/status management and licence-pool changes are restricted to founder/admin/master roles.
- Enterprise administrators are scoped to their stored `command_users.org_id` by the `orgId/scopedOrg` helpers for dashboard, CSV export, assignment and organisation-cohort analytics; non-master callers cannot substitute a different requested organisation id through those helpers.
- Validation cohort reporting suppresses cells below its minimum reporting threshold and labels outputs as descriptive rather than normative/predictive.
- Manual UPI approval uses a pending-status compare/update pattern that reduces duplicate operator processing.

### Material authorization findings
**SX-AUTH-01 — Shared Command dashboard aggregation (design limitation).** Any active Command user reaching the dashboard receives system-wide CRM/ATS/operations aggregate metrics because privileged backend queries are not scoped by `org_id`. This is compatible with a trusted internal workspace, but not with external enterprise-admin access if that route becomes reachable to those users.

**SX-AUTH-02 — CRM object-level authorization (future BOLA risk).** CRM list and mutation paths authenticate Command membership but do not derive organisation scope from the authenticated identity. In particular, opportunity update selects by client-supplied row id using the service-role client. In a multi-tenant model this would be an object-level authorization weakness; under the current internal-only model it is a documented trust assumption.

**SX-AUTH-03 — Enterprise-console scoping is materially stronger.** The inspected enterprise dashboard/export/assignment paths derive organisation context from the authenticated enterprise administrator and ignore a requested foreign organisation for non-master roles. This is the pattern to reuse for future Command tenant hardening.

**SX-AUTH-04 — Master-only ID mutations.** Enterprise admin status changes and validation-pilot ID operations use client-supplied IDs but are protected by founder/admin/master role checks. They remain privileged administrative actions rather than tenant-user BOLA paths; audit and negative tests should still cover them.

**SX-AUTH-05 — Audit insertion provenance.** Backend audit writes normally pass the authenticated actor id. Database policy also permits authenticated browser insertion with a null actor id. This is not required to prove the backend flow and should be reviewed separately before expanding browser-side audit writing.

### Release gate before Command is exposed beyond trusted internal operators
Do not expose generic Command dashboard/CRM/ATS routes to enterprise administrators merely because they possess a valid Command account. Introduce an explicit route capability matrix and default-deny role middleware, scope every customer-data query by authenticated organisation/ownership, and add negative integration tests using two organisations and at least three roles (master, enterprise admin A, enterprise admin B). Tests must prove that changing URL/body/query object IDs cannot cross organisation boundaries and that aggregate dashboards do not leak another organisation's counts, pipeline, candidate, compensation or revenue information.


## Production edge, secret and dependency posture — 2026-09-23

A read-only review covered the production Render service configuration, backend bootstrap, rate-limit configuration, repository secret-exclusion rules and dependency manifest/lockfile.

### Verified controls
- Production and staging are separate Render services/branches. Production auto-deploys from `main`; staging auto-deploys from `staging`.
- CORS uses an explicit allow-list seeded with Syntropix production origins plus configured origins; credentials are disabled. Requests with no Origin are permitted, which is normal for non-browser/server clients and means CORS must not be treated as authentication.
- JSON request bodies are limited to 1 MB; selected webhook raw bodies are preserved for signature verification workflows.
- A general API limiter is mounted before API routers (300 requests / 15 minutes / IP), with tighter authentication (10 / 15 minutes / IP) and assessment (100 / 15 minutes / IP) limiters.
- `.gitignore` excludes `.env`, `.env.*`, `config.env`, common private-key formats, credential/secret CSV patterns and logs. No secret value was retrieved in this review.
- The backend requires Node >=22 and has a committed lockfile, supporting deterministic dependency resolution at install time.

### Present gaps / limitations
**SX-EDGE-01 — No dedicated Render health-check path configured.** The application exposes `/api/health`, but the inspected Render service configuration has an empty health-check path. Platform health/deploy verification therefore is not evidenced as using the application health endpoint.

**SX-EDGE-02 — Security response headers not evidenced in application bootstrap.** The inspected bootstrap does not use Helmet and no application-level CSP / HSTS / X-Content-Type-Options configuration was found in the reviewed source. Some headers may be supplied by hosting/browser defaults, but Syntropix should not claim an explicit application security-header baseline until verified from live responses or implemented deliberately.

**SX-EDGE-03 — Public network exposure is intentional.** Render permits `0.0.0.0/0` for the public web service. Security therefore depends on route authentication/authorization, webhook verification, rate limiting and application controls rather than network allow-listing.

**SX-EDGE-04 — Secret lifecycle governance not evidenced.** Source references environment variables and excludes local secret files from Git, but rotation cadence, administrator access review, incident rotation procedure and historical secret scanning are not yet evidenced.

**SX-EDGE-05 — Dependency vulnerability status not yet established.** A committed `package-lock.json` exists, but this review did not establish a current vulnerability scan result. Do not state that dependencies are vulnerability-free until a current audit/Dependabot or equivalent evidence exists.

**SX-EDGE-06 — Error disclosure requires route-by-route normalization.** The global error handler returns a generic API 500 message, which is positive. Some individual routes return caught database/provider `error.message` values directly. Those paths should be classified before enterprise hardening so internal database/provider details are not unnecessarily exposed to callers.

### Deployment evidence
Recent production deploy history shows commit-triggered deployments reaching `live` status, confirming the configured auto-deploy path is active. This demonstrates deployment operation, not an uptime SLA, rollback SLA, high-availability architecture or disaster-recovery guarantee.

### Current decision
Do not change production solely to satisfy a checklist. The highest-value low-regression candidates for staging validation are: configure Render health checking against `/api/health`; establish an explicit security-header baseline after compatibility testing; add current dependency scanning evidence; and normalize external error responses while preserving server-side diagnostic logging. Secret rotation/access governance should be documented operationally before making any credential rotation that could interrupt production.


## Staging hardening validation — 2026-09-23

A deliberately narrow edge-hardening patch was deployed to the Render staging service only; production remained untouched.

### Staging changes tested
- replaced permissive `cors()` with an explicit origin allow-list and generic CORS-denial handling;
- added API response headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, and an API-only restrictive Content Security Policy;
- mounted `/api/health` before the general API limiter so future platform health polling cannot be blocked by the ordinary API request quota;
- enabled the existing general API limiter in staging while retaining the tighter authentication and assessment limiters;
- added generic API 500 handling while preserving server-side error logging.

### Validation evidence
- staging commit: `f212b8da531a36ae747b66e68da5d9a4c8e37a15`;
- Render automatically built and deployed that commit from the `staging` branch;
- build completed successfully;
- the Render `npm install` step reported **107 packages audited, 0 vulnerabilities found** for that build. This is point-in-time build evidence, not a guarantee that future dependency states are vulnerability-free;
- the staging service started successfully and Render reported the service live;
- the existing AC/DC startup regression suite completed **PASSED 30 checks**, including AC/DC PDF smoke tests;
- no production service, production branch, production database or production environment variable was modified.

### Remaining limitation
The current connector environment could not directly retrieve the public staging HTTP response headers, so header presence is verified from the deployed source and successful service startup rather than an independent external-response capture. Before production promotion, capture the live staging response headers from a normal browser/curl environment and confirm CORS behavior for one allowed and one denied origin.

### Promotion decision
The staging deployment shows no startup or existing AC/DC regression failure from the narrow hardening patch. Production promotion remains **PENDING external header/CORS response verification and diff review**; no automatic promotion is authorized by this evidence alone.


## Production-candidate isolation and HTTP edge proof — 2026-09-23

The staging branch was compared directly with production `main` before any promotion decision. It is heavily diverged (hundreds of commits ahead and materially behind production), so **staging must not be merged wholesale into production**.

A fresh backend branch, `edge-hardening-prod-candidate`, was therefore created from current production `main`. Its diff is intentionally minimal: one file (`server.js`), 3 additions and 1 relocation. Draft PR #101 contains only (a) the API security-header middleware and (b) moving `/api/health` before the general API limiter. No AC/DC staging history, migrations, UI work, database change, dependency update or environment-variable change is included.

### HTTP response verification in staging
Because direct external header capture was unavailable from the browser connector, the existing staging startup self-test was extended to perform actual localhost HTTP requests against the deployed service. It now verifies:
- `/api/health` returns HTTP 200;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: no-referrer`;
- API CSP contains `default-src 'none'`;
- an allowed origin (`https://syntropix.in`) receives the expected CORS allow-origin response;
- an unapproved origin receives HTTP 403.

The resulting staging deployment completed successfully and the startup suite reported **PASSED 37 checks**. The build again reported **107 packages audited, 0 vulnerabilities found** at that point in time. This is direct deployed-response evidence for the tested controls, although it is not a substitute for periodic external scanning.

### Promotion status
Production remains unchanged. Draft backend PR #101 is a production candidate only and must stay unmerged until final review of route compatibility and release posture is complete. The principal compatibility consideration is that the restrictive CSP/X-Frame-Options are applied to all `/api` responses; if any API endpoint intentionally serves embeddable HTML/PDF content, that behavior must be checked before promotion.


## Production promotion result — 2026-09-23

After narrowing the candidate to compatibility-safe controls, staging passed **35/35** startup checks including PDF smoke tests, API health response, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, allowed-origin CORS and denied-origin CORS. The broader CSP and frame-blocking headers were intentionally removed from the global API middleware because the API includes downloadable PDF responses and the stronger headers provided limited value for JSON/PDF while adding avoidable compatibility uncertainty.

Backend PR #101 was squash-merged to production as commit `214b3c9faba29180329452c01ca12ce4782e6de1`. The production Render deploy completed with status **live**. The build reported **148 packages audited, 0 vulnerabilities found** at that point in time, the Node process started successfully, and normal production startup integrations initialized without an immediate deployment error. No database schema, data, environment variable, assessment scoring, AC/DC logic, frontend UI or dependency manifest was changed by the production hardening commit.

### Reproducibility finding
The deployment also exposed a runtime-version drift: the staging build resolved Node 24.14.1 while production resolved Node 26.10.0 because `package.json` specifies only `>=22.0.0`. Both deployments built successfully, but this weakens staging-to-production reproducibility. A future controlled change should pin an explicitly supported Node major/minor policy (or otherwise align Render runtime resolution) and validate it in staging before promotion. Do not change the runtime version opportunistically during an unrelated release.

### Current state
**PRODUCTION VERIFIED LIVE** for the compatibility-safe edge patch. The remaining infrastructure actions are operational hardening rather than emergency remediation: configure a Render health-check path when supported by the service-management workflow, align Node runtime versions, establish repeatable dependency/security scanning evidence, and continue route-level error-response normalization and secret-lifecycle governance.


## Runtime reproducibility closure — 2026-09-23

Render documentation was reviewed before changing runtime policy. Render gives `NODE_VERSION` highest precedence, then `.node-version`, then `.nvmrc`, then `package.json > engines.node`; unbounded ranges such as `>=22` can resolve to a newer major over time. This explained the observed staging/production runtime drift.

### Staging verification
Staging was explicitly pinned to Node `24.14.1` and redeployed. Render confirmed `Using Node.js version 24.14.1 via ... package.json`; the build audited 107 packages with 0 vulnerabilities at that point in time, the service reached live status, and the full staging startup suite passed **35/35 checks**, including PDF and edge-control checks.

### Production implementation
Production uses the smaller repository-level control: a one-line root `.node-version` containing `24.14.1`. This avoids dependency or lockfile modification while taking precedence over the existing broad `package.json` engine range. Backend PR #102 was squash-merged as production commit `5c9be8f2ea35dfa2169dea60c8b507761471486e`.

Render production confirmed `Using Node.js version 24.14.1 via .../.node-version`; its build audited 148 packages with 0 vulnerabilities at that point in time, the Node process started normally, and the deployment reached **live** status. No application code, database schema/data, dependency manifest, lockfile, environment variable, assessment scoring, AC/DC logic or frontend file changed in this runtime-pinning release.

### Health-check configuration status
The application health endpoint exists and is deliberately outside the general API rate limiter. The currently available Render service-management connector exposes service inspection but does not expose a safe service-update action for the health-check path. Therefore the platform-level health-check-path change remains **NOT YET APPLIED** rather than being simulated through an unrelated configuration change. It should be applied only through a supported Render configuration surface and then verified against `/api/health`.


## Repeatable security governance and error-response hardening — 2026-09-23

### CI and dependency governance now implemented
The private backend repository now contains a production security workflow that runs on relevant pull requests, relevant pushes to `main`, a weekly schedule and manual dispatch. The gate uses the pinned Node runtime, performs a locked `npm ci` installation, verifies the direct dependency tree, runs `npm audit --audit-level=high`, syntax-checks security-sensitive bootstrap files and runs the backend test suite. The workflow passed before merge.

Dependabot configuration was also added for weekly npm and GitHub Actions review PRs. These are review inputs only; there is no automatic merge policy. An internal Security Operations Runbook now documents secret-handling boundaries, event-driven rotation triggers, staging-first rotation procedure, quarterly administrator-access review, incident handling and the evidence boundary for unsupported certification/operational claims.

Production governance commit: `77556646c3669a1da22b25425b7a65280de56240`. Render subsequently built that commit on the pinned Node 24.14.1 runtime and the deployment reached live status.

### Error-response normalization
A source review identified selected routes that could return raw database or provider error strings to authenticated/admin callers. A targeted staging patch preserved existing success/error flow semantics and server-side logging while replacing those raw external messages with bounded operational messages. The affected functional areas include payment administration, organization/license administration, contact administration, integration provisioning/configuration, validation administration, backup operations and Prism360 administration. Production additionally includes the protected Command payment-admin route.

The staging candidate passed its dedicated syntax workflow, deployed successfully, and the existing startup regression suite passed **35/35 checks**, including PDF and edge-control checks. The production candidate then passed the general Backend Security & Dependency Integrity workflow, the Command Authentication Safety Gate and the dedicated Error Response Integrity syntax gate before merge.

Production error-normalization commit: `103ec9d63478fd956f4a0de57df44efb5433fc7a`. This change does not alter database schema/data, credentials, assessment scoring, AC/DC logic, dependency versions or frontend files. Detailed error information remains in server-side logs for operator diagnosis rather than being reflected to callers.
