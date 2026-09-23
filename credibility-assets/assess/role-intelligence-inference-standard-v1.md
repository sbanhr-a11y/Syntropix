# Syntropix Assess — Role Intelligence Inference Standard v1

Date: 2026-09-23
Status: PRODUCT / RESEARCH DESIGN STANDARD
Scope: Manager Signal, Campus Signal

## Product objective

Turn minimal employer input into a defensible default assessment configuration without forcing TA teams to design competencies, weights or psychometric batteries.

Default user journey:

**Paste/upload JD → Syntropix interprets role → Assessment ready**

Client calibration is optional unless the system detects material ambiguity.

## 1. Accepted inputs

Any one of:
- job description text;
- job-title + level;
- requisition text;
- job advertisement.

Optional:
- industry;
- country;
- team size;
- company-specific non-negotiable requirement.

No client should be required to select constructs or weights.

## 2. Inference outputs

Role Intelligence produces:

- target product: Manager Signal / Campus Signal / unsupported;
- Syntropix job family;
- likely occupation references;
- role level;
- people responsibility;
- primary role outcomes;
- typical work activities;
- stakeholder complexity;
- decision complexity;
- analytical intensity;
- customer/commercial exposure;
- regulatory/safety exposure;
- AI intensity;
- job-family lens;
- recommended contextual-complexity distribution;
- assessment-form specification;
- role-interpretation confidence;
- reasons requiring human confirmation, if any.

## 3. Evidence sources

### Employer text
The JD is the most immediate role-specific source but may contain inflated requirements, copied boilerplate or poor wording.

### O*NET
Use current occupation titles, tasks, work activities, work context, essential/transferable skills and related occupation data where relevant.

O*NET is an occupational-information reference, not a Syntropix validity source.

### ESCO
Use occupations, preferred/non-preferred terms and occupation–skill relationships, including multilingual mappings where useful.

### India layer
Use NCO-2015 and relevant National Occupational Standards / Qualification Packs for Indian-market contextualisation where applicable.

### Syntropix layer
Use:
- 18 family maps;
- role-level taxonomy;
- capability/construct architecture;
- scenario coverage;
- empirical corrections after governed review.

## 4. Source hierarchy

Do not blindly trust any single source.

Working precedence:
1. explicit employer role outcomes/tasks when credible;
2. occupation-source overlap across O*NET / ESCO / India sources;
3. Syntropix family/level priors;
4. title-only inference as fallback.

Conflicts are surfaced internally and may reduce confidence.

## 5. Job-family inference

Map the role to one primary family and up to two secondary families.

Primary family should explain the largest proportion of:
- core outcomes;
- recurring work activities;
- stakeholder environment;
- decision pressures.

Secondary families provide context only.

Do not create blended psychometric constructs merely because a JD spans functions.

## 6. Role-level inference

Infer from:
- people-management scope;
- decision authority;
- budget/revenue ownership;
- stakeholder seniority;
- ambiguity;
- strategic vs operational horizon;
- scope/geography;
- whether role manages managers.

Do not infer level solely from title because titles vary radically by company.

Working levels for v1:
- Campus / Early Career
- First-line / Assistant Manager
- Manager
- Senior Manager

Leadership/VP/CXO assessment remains outside initial product scope.

## 7. People-management inference

Classify:
- None
- Emerging / project leadership
- Direct people manager
- Manager of managers

Manager Signal is appropriate only when the job genuinely requires managerial judgment on entry.

A role called “Manager” but functioning as an individual contributor should not automatically receive Manager Signal.

## 8. Outcome extraction

Generate 3–5 role outcomes from JD + occupational sources.

Each outcome must be:
- observable;
- job-related;
- stated without marketing language;
- not a personality trait.

Examples:
Good:
- maintain accurate financial close;
- improve account retention;
- deliver projects within agreed scope;
- coach and manage team performance.

Bad:
- be a rockstar;
- demonstrate passion;
- show executive presence.

## 9. Work-context profile

Rate internally:
- stakeholder complexity;
- ambiguity;
- time pressure;
- consequence of error;
- customer exposure;
- commercial exposure;
- regulatory/safety exposure;
- analytical intensity;
- AI/tool intensity.

Use ordinal categories:
Low / Moderate / High

These ratings drive scenario context and complexity sampling, not candidate scoring directly.

## 10. AI intensity

Infer:
- **Low** — AI may support occasional drafting/search but is not central to core work;
- **Moderate** — AI can materially support recurring analysis/content/process tasks;
- **High** — AI/data-model use is central to role workflow or risk.

AI intensity affects context sampling within AI-era Judgment.

It does not create a bonus for being enthusiastic about AI.

## 11. Complexity-distribution recommendation

Role Intelligence may adjust CX mix within governed bounds.

Example:
First-line service manager:
- CX1 15
- CX2 45
- CX3 30
- CX4 10

Senior manager:
- CX1 5
- CX2 25
- CX3 45
- CX4 25

Actual recommendation also considers job context:
- safety/regulatory consequences;
- stakeholder complexity;
- decision authority;
- operational volatility.

No fully adaptive difficulty in v1.

## 12. Role interpretation confidence

Do not expose pseudo-precise probabilities unless calibrated.

Internal confidence should combine:
- title agreement with occupation sources;
- JD-task clarity;
- family consistency;
- level-signal consistency;
- contradictory signals;
- missing critical information.

Client-facing states initially:

### High confidence
Proceed without questions.

### Moderate confidence
Proceed, but offer a visible interpretation review.

### Confirmation required
Ask one narrowly targeted clarification.

## 13. Clarification minimisation

Never show a generic questionnaire.

Ask only when the answer materially changes:
- Manager vs Campus product;
- primary job family;
- managerial scope;
- complexity profile;
- assessment context.

Examples:

> This role title suggests Product Management, but most responsibilities describe Programme Management. Which is closer to the actual job?

> Does this role directly manage employees and make performance decisions?

One question at a time.

## 14. Optional “Improve relevance”

After interpretation, show:

**Assessment ready**

Secondary action:
**Improve relevance**

If opened, show system-proposed:
- top 3 outcomes;
- highest-risk failure;
- critical context.

Client accepts/edits rather than starting from blank fields.

## 15. Unsupported-role rule

If Role Intelligence cannot defend a mapping:
- do not manufacture certainty;
- mark **Needs review**;
- route to Syntropix internal review or a small clarification path.

Examples may include:
- highly regulated specialist roles;
- unusual hybrid roles;
- jobs requiring specialist knowledge Syntropix does not yet model.

## 16. Human override

Any internal/client override stores:
- previous inference;
- new classification;
- reason;
- actor;
- timestamp.

Overrides do not automatically retrain the model.

They become governed evidence for improving mappings.

## 17. Bias safeguards

Do not use:
- candidate demographics;
- university prestige;
- salary;
- protected characteristics;
- employer brand prestige

to determine assessment difficulty or candidate expectations.

JD language may itself contain bias or inflated requirements. Occupational sources provide a counter-reference rather than treating the JD as unquestionable truth.

## 18. Versioning

Every generated assessment record stores:
- Role Intelligence version;
- occupation-source version/date;
- Syntropix family-map version;
- inferred role profile;
- client edits;
- form-generation version.

This makes later validation reproducible.

## 19. Validation programme

Before claims such as “accurately configures roles automatically”:
- sample real JDs across all 18 families;
- independent HR/SME classifications;
- compare family and level agreement;
- inspect ambiguity/error types;
- test Indian and multinational role titles;
- evaluate low-quality/boilerplate JDs;
- measure how often clarification is needed;
- measure client correction rate;
- monitor family-specific errors.

Primary UX objective:
**most ordinary roles should require zero client questions.**

Scientific/product objective:
**when confidence is low, the system should know that it is uncertain.**

## 20. Market-facing boundary

Allowed:
> Syntropix interprets the role and proposes the assessment configuration for review.

Not allowed before evidence:
> AI automatically understands every job with 95% accuracy.

## Current design principle

**Intelligence should remove configuration work, not move hidden decisions into an opaque model.**
