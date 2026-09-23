# Campus Signal — Learn → Apply Prototype v0.1

Date: 2026-09-23
Status: RESEARCH PROTOTYPE / NOT FOR CANDIDATE USE
Primary construct: Learning Transfer
Secondary construct: Applied Reasoning

## Design objective

Observe whether a candidate can:
1. learn a novel rule system presented inside the assessment;
2. combine rules;
3. identify precedence/exception rules;
4. transfer learning to unfamiliar cases;
5. update behaviour when a rule changes.

The system is fictional so prior professional knowledge should not help materially.

---

# Candidate learning material

## The Aster Request Routing System

Aster is a fictional company. Incoming requests are routed using four pieces of information.

### Impact

**Individual**
Only one person is affected.

**Team**
Several people in one team are affected.

**Wide**
Multiple teams or external customers are affected.

### Time requirement

**Normal**
A response is needed after today.

**Same-day**
A response is needed before the end of today.

**Immediate**
A response is needed within two hours.

### Information type

**Standard**
No restricted information is included.

**Restricted**
The request contains information labelled Restricted.

### Evidence status

**Confirmed**
The issue has been independently confirmed.

**Unverified**
The report has not yet been confirmed.

---

# Routing rules

### Rule 1 — Base route

If impact is **Individual** and time requirement is **Normal**:
→ **Routine Queue**

If impact is **Team** OR time requirement is **Same-day**:
→ **Priority Queue**

If impact is **Wide** OR time requirement is **Immediate**:
→ **Incident Queue**

When more than one route applies:
→ use the **higher-priority route**.

Priority order:
**Incident > Priority > Routine**

### Rule 2 — Restricted information

If information is **Restricted**:
→ send it to **Secure Review first**.

After Secure Review, continue to the route determined by Rule 1.

### Rule 3 — Unverified Immediate reports

If a request is **Immediate** but **Unverified**, and impact is not Wide:
→ **Verify first**, then route using Rule 1.

If impact is **Wide**, do not delay routing for verification:
→ route to Incident while verification continues.

### Rule 4 — Do not infer missing information

If information needed to apply a rule is missing:
→ choose **Clarify**, rather than guessing.

---

# Decision 1 — Direct application

Impact: Individual  
Time: Normal  
Information: Standard  
Evidence: Confirmed

What is the correct next route?

A. Incident Queue **0**
B. Priority Queue **1**
C. Routine Queue **3**
D. Clarify **0**

Primary evidence:
direct rule acquisition.

---

# Decision 2 — Combining rules

Impact: Team  
Time: Normal  
Information: Standard  
Evidence: Confirmed

A. Priority Queue **3**
B. Routine Queue **1**
C. Incident Queue **1**
D. Secure Review **0**

Primary evidence:
recognises Team impact activates Priority.

---

# Decision 3 — Precedence

Impact: Wide  
Time: Same-day  
Information: Restricted  
Evidence: Confirmed

What happens first?

A. Incident Queue **2**
B. Secure Review **3**
C. Priority Queue **1**
D. Clarify **0**

Why:
Incident is the final base route, but Restricted information requires Secure Review first.

---

# Decision 4 — Exception

Impact: Individual  
Time: Immediate  
Information: Standard  
Evidence: Unverified

A. Incident Queue immediately **1**
B. Routine Queue pending confirmation **0**
C. Verify first, then route **3**
D. Priority Queue while verification continues **1**

Primary evidence:
applies the Unverified Immediate exception.

---

# Decision 5 — Transfer to a new combination

Impact: Wide  
Time: Immediate  
Information: Standard  
Evidence: Unverified

A. Verify first because Immediate reports cannot be routed unverified **1**
B. Route to Incident while verification continues **3**
C. Route to Priority until verification is complete **1**
D. Clarify because the rules conflict **0**

Primary evidence:
recognises Wide-impact exception overrides the verification delay.

---

# New information introduced

Aster is now entering a temporary **Peak Window**.

During Peak Window, add this rule:

### Rule 5 — Peak Window

A request from a **Priority Account** that would normally go to Routine or Priority is raised **one route level**.

Routine → Priority  
Priority → Incident

This rule does **not** override:
- Secure Review;
- the Unverified Immediate rule.

---

# Decision 6 — Apply a newly learned rule

Peak Window: Yes  
Priority Account: Yes  
Impact: Individual  
Time: Normal  
Information: Standard  
Evidence: Confirmed

A. Routine Queue **1**
B. Priority Queue **3**
C. Incident Queue **1**
D. Clarify **0**

Primary evidence:
updates behaviour using a newly introduced rule.

---

# Decision 7 — Resolve new-rule conflict

Peak Window: Yes  
Priority Account: Yes  
Impact: Team  
Time: Same-day  
Information: Restricted  
Evidence: Confirmed

What happens first?

A. Incident Queue because the account is raised one level **2**
B. Priority Queue because Team/Same-day already determines the base route **1**
C. Secure Review, then Incident **3**
D. Clarify because Restricted and Peak Window rules conflict **0**

Primary evidence:
integrates base route + Peak Window + security precedence.

---

# Challenge-back

Earlier, Decision 4 required verification before routing because the report was Immediate, Unverified and not Wide.

Now assume the same request becomes **Wide impact** before verification completes.

What should happen?

A. Continue verification first because the original decision should remain consistent. **1**
B. Route to Incident while verification continues because the new Wide-impact evidence changes the exception. **3**
C. Route to Priority until verification completes because impact increased but evidence is still unverified. **1**
D. Start the routing decision again only after all four attributes are reconfirmed. **0**

Primary evidence:
updates a prior decision when new evidence changes the governing rule.

---

# Scoring hypothesis

This prototype is more rule-governed than Manager Signal SJTs.

Initial scoring may use:
- 3 = applies the governing rule/precedence correctly;
- 2 = identifies the eventual destination but misses sequencing;
- 1 = partially applies a relevant rule;
- 0 = contradicts supplied rules.

Empirical item difficulty must still be estimated.

## Timing hypothesis

Learning material: 2.5–3.5 minutes  
Decisions 1–5: 3–4 minutes  
New rule + Decisions 6–7: 2 minutes  
Challenge-back: ~1 minute

Target total:
**8–10 minutes**

## Cognitive interview questions

1. Could you understand the four attributes without prior business knowledge?
2. Which rule was hardest to remember?
3. Did you understand “higher-priority route”?
4. Did “Secure Review first” clearly mean sequencing rather than final destination?
5. Did the Peak Window rule feel like genuinely new information?
6. Were any items mainly memory tests rather than application?
7. Did you need to reread rules? If so, which?
8. Would allowing the rule panel to remain visible change what we are measuring?

## Important design question

The default hypothesis is that **rules remain accessible during the task**.

Rationale:
Campus Signal should primarily measure understanding/application/transfer—not short-term memory.

This must be tested empirically and through cognitive interviews.
