# Syntropix Assess — Complexity & Difficulty Architecture v1

Date: 2026-09-23
Status: DESIGN STANDARD / PRE-ITEM BUILD
Applies to: Manager Signal, Campus Signal

## 1. Why two concepts are required

Syntropix distinguishes:

1. **Designed Context Complexity** — how demanding the work situation is by design.
2. **Empirical Item Difficulty** — how difficult the item proves to be when real candidates respond.

These are not interchangeable. Contextual complexity can be defined before pilot testing; empirical difficulty must be estimated from response data.

## 2. User-facing complexity language

Internal codes remain technical. Client-facing language must be intuitive.

| Internal | Client-facing label | Plain meaning |
|---|---|---|
| CX1 | **Clear Context** | priorities and consequences are relatively visible |
| CX2 | **Competing Priorities** | two or more legitimate demands compete |
| CX3 | **Ambiguous Trade-offs** | evidence is incomplete and several reasonable paths exist |
| CX4 | **High-Consequence Complexity** | multiple stakeholders, significant trade-offs and material consequences are present |

Candidates normally do not see complexity labels during the assessment.

## 3. Complexity dimensions

Each scenario receives design ratings on:
- number of relevant stakeholders;
- goal conflict;
- information completeness;
- time pressure;
- consequence severity;
- reversibility of decision;
- role/authority ambiguity;
- dependency complexity;
- ethical/fairness tension where job-relevant;
- customer/commercial exposure where job-relevant;
- regulatory/safety exposure where job-relevant;
- AI reliance/oversight complexity where job-relevant.

Complexity classification must be based on the combined situation, not on vocabulary, sentence length or obscure domain knowledge.

## 4. CX1 — Clear Context

Characteristics:
- relatively complete information;
- one main stakeholder tension;
- limited trade-off;
- low ambiguity about authority;
- consequences are visible and largely reversible.

Purpose:
- establish baseline judgment;
- confirm understanding of core managerial/work principles;
- orient the candidate to the assessment format.

CX1 is not intended to be a trivial or socially obvious item.

## 5. CX2 — Competing Priorities

Characteristics:
- two or more legitimate priorities;
- moderate information gaps;
- competing stakeholder needs;
- some consequence to choosing one path over another;
- decision remains reasonably reversible.

Purpose:
- test prioritisation;
- trade-off recognition;
- balanced judgment.

## 6. CX3 — Ambiguous Trade-offs

Characteristics:
- incomplete or conflicting evidence;
- several plausible courses of action;
- multiple stakeholders;
- meaningful trade-offs;
- uncertain future consequences;
- decision may require sequencing, escalation or evidence gathering.

Purpose:
- test evidence use;
- stakeholder judgment;
- adaptability;
- consequence awareness.

## 7. CX4 — High-Consequence Complexity

Characteristics:
- multiple interdependent stakeholders;
- high commercial/people/safety/regulatory consequence;
- strong time pressure or strategic ambiguity;
- no clean answer;
- difficult trade-offs between legitimate objectives;
- decision may be partly irreversible or costly to reverse;
- new information can materially change the preferred course.

Purpose:
- test judgment under pressure;
- adaptive reasoning;
- willingness to revise;
- ability to protect critical constraints while progressing work.

CX4 must not depend on professional experience the assessment is not supposed to require.

## 8. Initial form distributions

These are design hypotheses, not validated difficulty distributions.

### Campus Signal
- CX1 Clear Context: **15%**
- CX2 Competing Priorities: **40%**
- CX3 Ambiguous Trade-offs: **35%**
- CX4 High-Consequence Complexity: **10%**

Campus CX4 must reflect novel information and trade-offs, not hidden professional knowledge.

### Manager Signal — default manager profile
- CX1 Clear Context: **10%**
- CX2 Competing Priorities: **35%**
- CX3 Ambiguous Trade-offs: **40%**
- CX4 High-Consequence Complexity: **15%**

## 9. Level-aware distribution

Role Intelligence may adjust distributions within bounded ranges.

### First-line / Assistant Manager
Indicative:
- CX1 15%
- CX2 45%
- CX3 30%
- CX4 10%

### Manager
Indicative:
- CX1 10%
- CX2 35%
- CX3 40%
- CX4 15%

### Senior Manager
Indicative:
- CX1 5%
- CX2 25%
- CX3 45%
- CX4 25%

These are starting blueprints only. Final distributions require pilot evidence and role relevance.

## 10. Job-family adjustment

Complexity is not synonymous with seniority.

Examples:
- a first-line manufacturing manager may face CX4 safety/escalation decisions;
- a senior strategy manager may face CX4 ambiguity/stakeholder decisions;
- a finance manager may face CX4 control/risk trade-offs;
- a sales manager may face CX4 customer/revenue/people trade-offs.

The job-family lens changes **what makes the situation complex**, not the common complexity language.

## 11. Empirical difficulty

After pilot data, each decision unit receives an empirical difficulty estimate.

For keyed items, difficulty can begin with the proportion receiving the highest/target score and evolve to polytomous/IRT parameters where justified.

Working empirical labels:
- ED1 Easier
- ED2 Moderate
- ED3 Difficult
- ED4 Very Difficult

These labels remain technical until sufficient calibration exists.

Do not infer empirical difficulty from the scenario's CX classification.

## 12. Discrimination

Every item/testlet must also be reviewed for whether it meaningfully differentiates candidates on its intended construct.

Item retention decisions must jointly consider:
- content validity;
- cognitive-interview evidence;
- contextual complexity;
- empirical difficulty;
- discrimination;
- response burden;
- ambiguity;
- fairness;
- occupational neutrality/job relevance.

No single coefficient decides item survival.

## 13. Candidate experience curve

Forms should generally progress:
**orientation → accessible challenge → increasing ambiguity → high-value complexity → challenge-back**

Do not front-load CX4 scenarios.

## 14. Client-facing representation

### Report summary: Complexity Range

Show four horizontal levels:

**Clear Context**  
**Competing Priorities**  
**Ambiguous Trade-offs**  
**High-Consequence Complexity**

For each level show:
- evidence consistency;
- number of observations;
- confidence indicator.

Example:
- Clear Context — Consistent
- Competing Priorities — Consistent
- Ambiguous Trade-offs — Mostly consistent
- High-Consequence Complexity — Variable evidence

Avoid percentiles or probabilities unless empirically supported.

## 15. Complexity Resilience

Working report construct:
**Complexity Resilience** = how consistently job-relevant judgment is demonstrated as contextual complexity increases.

This is currently a reporting hypothesis, not a validated standalone psychometric score.

Until validated, represent it descriptively from converging evidence rather than as a single numeric index.

## 16. Hiring-manager interpretation

The report should translate complexity patterns into plain language.

Example:
“Evidence remained consistent through situations involving competing priorities and multiple stakeholders. In the highest-consequence scenarios, the candidate showed more variable escalation and trade-off decisions. Verify how they handle decisions where short-term delivery pressure conflicts with people or control risk.”

## 17. Stateful complexity

A testlet may intentionally increase complexity over time:
- Stage 1: CX2
- Stage 2: new conflicting evidence → CX3
- Stage 3: consequence/stakeholder escalation → CX4

This allows observation of adaptation rather than only static answer quality.

## 18. AI-era complexity

AI-related scenarios should vary along the same complexity architecture.

Examples:
- CX1: verify an unsupported AI fact before use;
- CX2: speed benefit vs verification requirement;
- CX3: confidential data + stakeholder deadline + uncertain AI output;
- CX4: business-critical AI recommendation with incomplete evidence, regulatory exposure and executive pressure.

## 19. Validation questions

The pilot programme must test:
- whether CX levels correspond to increasing empirical difficulty;
- whether discrimination improves or deteriorates by CX level;
- whether CX4 adds useful information or merely noise;
- whether complexity effects differ by job family;
- subgroup/fairness patterns by CX level;
- response-time burden;
- candidate reactions;
- whether AI assistance changes performance differently across CX levels;
- whether challenge-back consistency adds incremental evidence.

## 20. Version-control rule

Every item metadata record must include:
- construct;
- subconstruct;
- job family;
- role level;
- CX level;
- intended empirical-difficulty band;
- stakeholders;
- primary tension;
- AI rule;
- scoring method;
- item version;
- evidence status.

After empirical calibration, store observed difficulty/discrimination separately from the design metadata.

## 21. Current design principle

**Complexity describes the situation. Difficulty describes candidate performance.**

Both belong in the Syntropix evidence model.
