# Manager Signal Alpha Bank — Quality Audit & Rewrite Gate v1

Date: 2026-09-23
Status: REQUIRED BEFORE SME PILOT
Scope: Manager Signal alpha bank v0.1

## Why this gate exists

A technically realistic scenario can still be a weak selection item if:
- one option is obviously “the good-manager answer”;
- low-score options are cartoonishly poor;
- response length reveals the key;
- the item tests policy trivia rather than judgment;
- the same answer position repeatedly receives the highest score;
- the scenario rewards social desirability more than actual trade-off reasoning.

The alpha bank is intentionally a research draft. It must pass this gate before cognitive testing.

## 1. Response-option plausibility test

For each decision unit:
- [ ] every option could plausibly be chosen by a real manager;
- [ ] at least two options have a genuine advantage;
- [ ] no option contains obviously reckless/immoral wording unless the role genuinely requires identifying a prohibited action;
- [ ] keyed option does not simply contain more nuance/words than alternatives;
- [ ] low-score options fail for different reasons;
- [ ] options are similar in grammatical form and specificity.

## 2. “Competent manager disagreement” test

Ask 3–5 experienced managers independently:

> Could a competent manager reasonably disagree about the best option before seeing the rubric?

If all immediately identify the keyed option because it sounds virtuous, rewrite.

A good CX2–CX4 item should create a **real trade-off**, not confusion.

## 3. Key-position control

Operational forms must randomise option order where psychometrically appropriate.

The authoring database stores semantic option IDs independently from displayed letters.

No form should allow candidates to infer that “B is usually best.”

## 4. Reading-cue control

Check whether the keyed option:
- is consistently longest;
- mentions more stakeholders;
- contains more caveats;
- uses obviously professional language;
- repeats terms from the scenario.

Rewrite to remove cueing.

## 5. Construct leakage

For every item ask:
- What is the intended construct?
- Could a candidate succeed mainly through another construct?
- Does prior industry knowledge overwhelm judgment?
- Does legal/HR policy knowledge determine the answer when that knowledge was not supplied?

If yes, either supply the necessary rule or change the item.

## 6. Social-desirability pressure

Avoid transparent morality choices such as:
- “ignore the employee” versus “listen carefully and act fairly”;
- “hide the risk” versus “be transparent”;
- “blame another team” versus “collaborate.”

Instead create alternatives such as:
- act immediately vs gather more evidence;
- local resolution vs escalation;
- short-term delivery protection vs process consistency;
- broad communication vs need-to-know confidentiality;
- reversible experiment vs delayed full analysis.

## 7. Scoring-separation hypothesis

For each option, reviewers must be able to explain:
- what useful principle it captures;
- what it misses;
- why its score differs from adjacent options.

If the only explanation is “this is obviously better,” the item is weak.

## 8. Stateful coherence

Later stages must not punish a candidate solely because of the Stage 1 path they chose.

Where branching differs, paths must be designed to preserve comparable opportunities to demonstrate the target construct.

## 9. Complexity audit

Confirm that CX classification reflects:
- stakeholder count;
- conflict;
- information completeness;
- consequence;
- reversibility;
- authority ambiguity;
- time pressure.

Do not increase complexity by simply adding text.

## 10. Fairness/accessibility audit

Review:
- unnecessary jargon;
- cultural assumptions;
- hierarchy norms;
- disability/timing burden;
- socioeconomic familiarity;
- gendered role assumptions;
- language complexity.

## 11. AI-resilience audit

Ask:
- Can the item be answered well by generic leadership clichés?
- Does it contain enough unique evidence/constraints?
- Could a challenge-back meaningfully test ownership?
- Is external AI assistance actually prohibited or merely inconvenient?

Do not design trick questions targeted at current model weaknesses.

## 12. Current alpha-bank rewrite priorities

Before SME pilot, prioritize:
1. replace obviously reckless distractors with plausible but incomplete alternatives;
2. balance option length and tone;
3. randomise semantic key positions in candidate rendering;
4. strengthen CX3/CX4 trade-offs;
5. verify that People Judgment items are not merely policy-compliance tests;
6. ensure AI scenarios test managerial judgment, not “AI safety trivia”;
7. check that universal-core scenarios do not silently assume a particular industry.

## 13. Acceptance rule

No alpha item proceeds to cognitive testing unless:
- role SME marks realism acceptable;
- method reviewer marks construct/scoring acceptable;
- fairness/accessibility reviewer has no unresolved material concern;
- response-option plausibility test passes;
- rubric disagreement is resolved/documented.
