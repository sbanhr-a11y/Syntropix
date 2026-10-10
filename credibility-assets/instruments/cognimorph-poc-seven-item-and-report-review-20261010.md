# CogniMorph Index — Plain-language item candidates and report restoration POC

Date: 2026-10-10
Status: PREVIEW ONLY — NOT approved questionnaire replacement or validated instrument.

## Requested seven candidate rewrites

| Item | Canonical original | Proposed plain-language candidate | Expert consideration |
|---|---|---|---|
| 11 | I systematically enforce mental prioritization rules to maintain focus during chaotic market shifts. | When work suddenly gets busy or confusing, I decide what needs my attention first. | More accessible; shifts from deliberate rule use to general task prioritization. Requires construct equivalence review. |
| 13 | I possess the ability to separate my personal self-worth from harsh, unvarnished critiques of my work. | When someone says my work needs to improve, I can listen without feeling like a failure. | Reduces jargon; emotional response and ability to listen are related but distinct. Cognitive interviews required. |
| 14 | When a stakeholder challenges my strategic plan, my immediate instinct is to deploy a defensive justification. | When someone questions my plan, my first reaction is to defend it. | Retains defensiveness idea; defending a sound plan may also be reasonable. Reverse keying is provisional. |
| 16 | I find it difficult to discern valid, useful feedback from poorly framed criticism, often rejecting both. | I sometimes reject useful advice because I do not like how it was given. | Simpler; narrows the construct to response to delivery rather than judging validity. Needs content review. |
| 17 | I treat deliberate effort and persistence as the primary drivers of my career acceleration. | I believe that hard work and not giving up help me grow in my career. | Improves reading ease; still measures belief rather than actual learning behaviour. |
| 18 | I systematically conduct blameless post-mortems on my own failed initiatives. | When a plan I worked on fails, I look at what went wrong without blaming people. | Simpler; may imply all failure is non-personal. Check whether it captures accountability and reflection. |
| 19 | I consciously reframe high-stakes evaluative pressure as a challenge to be solved rather than an identity threat. | When my work is judged under pressure, I try to see it as a problem I can work through. | Easier reading; pressure and judgement still co-occur. Check comprehension and context. |

## Review gate for replacing canonical items
- Preserve original item IDs, dimension mappings, reverse-keying and official registry/hash until approved version migration.
- Conduct cognitive interviews across education levels and English proficiency, checking immediate comprehension without coaching.
- Independently review semantic/construct equivalence, desirability bias, workplace applicability and cultural accessibility.
- Pilot response distributions, item-total relationships, internal structure, reliability and differential item functioning if sample size permits.
- Maintain an explicit new questionnaire version and do not compare old and new scores as equivalent without evidence.

## Rich report features included in synthetic preview
- Detailed report summary and exact transformed overall/dimension response indexes.
- Four score cards and dimension overview.
- SVG four-axis radar/profile topology using synthetic/local responses; text accessible summary.
- Four extended dimension narratives with an everyday scenario, higher/lower reflection, activity, contextual cautions and discussion prompt.
- Pattern relationship narrative; three-stage 30–60–90 day plan with four activities per stage.
- Scripted examples of AI Coach-style guidance clearly marked offline; no live AI or external endpoint.
- Browser print-to-PDF with printable text and vector visualization. Production PDF parity is NOT established.

## Static verification executed
- Inline JS syntax valid; candidate registry JS syntax valid.
- Exactly 20 items, exactly 8 reverse-keyed, 5 in each of ALOR/ERAE/CTAP/FRUP.
- Candidate rewrite IDs exactly 11, 13, 14, 16, 17, 18, 19; originals preserved in `originalText`; remaining 13 unchanged in preview.
- All required report component IDs and four dimension narratives present.
- No login, participant PII fields, payment, outbound API, external script, analytics or AI endpoint in standalone preview.
- Print action exists, live backend PDF integration intentionally absent.

## Outstanding quality gates
- Full authenticated/browser/mobile interaction testing and screenshots, including small-screen radar labels, responsive cards and print layout.
- Screen-reader/keyboard testing; review `aria-pressed` and chart alternatives.
- Full official report/PDF parity, premium visual QA and AI Coach integration in a backend-safe architecture.
- Expert scientific approval, reliability/validity studies, and item version governance.
- Do NOT merge PR #92 or release candidate item copy in production.
