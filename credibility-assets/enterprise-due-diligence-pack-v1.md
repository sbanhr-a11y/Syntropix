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
