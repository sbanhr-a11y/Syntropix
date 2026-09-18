# Syntropix V6 — Quiet Intelligence
## Design & Migration Blueprint
Baseline protected branch: `production-v5-protected-2026-09-18`
V6 branch: `v6-quiet-intelligence`
Baseline SHA: `dac963dcc7f4acf7248efbde9601dea16d462099`

## 1. Non-negotiable safety contract
V6 is a presentation-layer migration until explicitly promoted. No assessment scoring, registry, payment, entitlement, authentication, enterprise lifecycle, report submission, validation, region/pricing, Command, database or backend contract may be changed merely to support visual design. Existing IDs, data attributes, query parameters and script hooks are treated as API contracts. V5 remains immutable on its protected branch.

## 2. Design thesis
Quiet Intelligence: minimal, intellectual, human, technological and precise. One idea per screen. Product before claims. Motion explains state or transformation. Colour belongs to intelligence, not chrome. Human judgement remains visible. Avoid stock-HR imagery, decorative AI particles, gratuitous parallax, glassmorphism overload and generic card walls.

## 3. Design tokens
Foundation: Obsidian #080A09; Ink #111411; Ivory #F3F0E8; Paper #E9E5DC; Champagne #D6B878.
Intelligence accents: Violet #8B7CFF cognition/intelligence; Emerald #58B98C growth/development; Cyan #62B8D8 evidence/data.
Typography: large editorial sans display, restrained body, monospace micro-labels. No new external font dependency in prototype.
Layout: max 1240px; 32px desktop gutter; 20px mobile; 24px primary radius.
Accessibility: WCAG-oriented contrast, keyboard-visible controls, reduced-motion respect, semantic headings, no colour-only meaning.

## 4. Information architecture
Home = brand / why. Solutions = need / what problem. Product pages = capability / how it works. Organizations = enterprise buying journey. Professionals = individual buying journey. Science = evidence/methodology. Trust = security/privacy. Pricing = purchase information. Legal = policy. Application surfaces retain their functional UI.

## 5. Page-by-page migration matrix
### Brand / acquisition
- index.html: REBUILD presentation. Preserve organization/professional routes, science/trust routes, invite router, footer/legal links. Remove six-card catalogue duplication, testimonial/logo/evidence repetition from Home; relocate detailed capability discovery to Solutions/product pages. V6 prototype implemented.
- solutions.html: NEW. Problem-led orchestration page. V6 prototype implemented.
- enterprise.html: RETHEME + EDIT. Preserve conversation/contact flow, enterprise product links, any forms/scripts. Reduce repeated corporate positioning; lead with organizational outcomes, proof, workflow and buying path.
- professionals.html: RETHEME + EDIT. Preserve all assessment catalogue hooks, assignment UI, checkout/navigation and canonical runtime links. Product discovery remains primary.
- assessment-intelligence.html: RETHEME + EXPAND product proof. Preserve links into assessment catalogue/runtime.
- manager-development.html: RETHEME. Preserve offering/content/CTAs; replace generic card repetition with outcome → experience → evidence → next step.
- prism360.html: RETHEME. Preserve Prism360 routes and survey links; show actual workflow/report fragments.
- employee-experience.html: RETHEME. Preserve Signal status, privacy-safe claims and any functional routes.
- talent-solutions.html: RETHEME. Preserve recruitment-service scope and contact path.
- compliance-learning.html: RETHEME. Preserve COMING SOON state; never imply live capability.
- professional-coaching.html: RETHEME. Preserve coaching scope and conversion routes.
### Evidence / trust / commercial
- science.html: VISUAL SYSTEM UPDATE, CONTENT CONSERVATIVE. No stronger scientific claims. Keep evidence boundaries and validation status.
- trust.html: VISUAL SYSTEM UPDATE, CONTENT CONSERVATIVE. Preserve security/privacy wording and provider boundaries.
- pricing.html: RETHEME ONLY. Preserve region sync, amounts, payment routes and legal purchase information.
- privacy.html / terms.html / refund-cancellation.html: TOKEN ALIGNMENT ONLY. Legal text unchanged unless separately reviewed.
### Functional application surfaces — visual migration only after regression proof
- signin.html: NO structural V6 migration in first cut. Auth hooks protected.
- assessment-runtime-v3.html/js/css: NO V6 structural migration. Current report/assessment work remains independently versioned.
- enterprise-console.html/js/css: NO V6 structural migration until authenticated acceptance tests pass.
- admin.html: NO V6 structural migration.
- prism360/survey.html: NO structural migration until survey regression test exists.
- consumer/enterprise runners: NO structural migration.
### Legacy / technical pages
- homepage-v4.html and architecture-v2-integration.html: do not expose in V6 navigation. Retain until final deprecation audit; do not delete during migration.

## 6. What survives from V5
All backend/API contracts; canonical assessment registry/runtime; payment and entitlement logic; enterprise assignment lifecycle; auth/passwordless; region pricing/sync; assessment invitation routing; Prism360 survey; Signal/employee-experience functionality; contact/conversation routes; science/trust/legal wording; footer legal destinations; SEO canonicals and existing public URLs unless a redirect plan is separately approved.

## 7. What changes
Information hierarchy, visual system, page composition, typography, whitespace, product visualization, navigation emphasis, Home/Solutions separation, repetitive marketing copy, card density, CTA hierarchy and responsive presentation.

## 8. What disappears from primary experience
Duplicated six-capability catalogue on Home; repeated generic kicker-heading-card rhythms; unnecessary decorative motion; repeated evidence copy on acquisition pages; homepage-v4/architecture-v2 routes from navigation; generic stock-HR visual language. Nothing is deleted from repository during V6 migration.

## 9. Prototype acceptance requirements
Desktop widths 1440/1280/1024; mobile 430/390/360. Keyboard navigation. Reduced motion. No horizontal overflow. Lighthouse-style performance discipline: no external animation framework required for V6 baseline. Product visuals must use real Syntropix UI or clearly labelled conceptual UI, never fabricated client results. Home and Solutions must pass a content-duplication review: Home tells the brand thesis; Solutions organizes needs; neither repeats more than necessary navigation/brand language.

## 10. Regression contract
Every release must verify:
1. All current public URLs return expected page.
2. All navigation destinations exist.
3. professionals assessment cards still launch canonical runtime.
4. assessment invite router still loads on Home where required.
5. assessment runtime retains registry, checkout, payment, entitlement, scoring, report, validation and lifecycle hooks.
6. auth sign-in remains passwordless and session storage contract unchanged.
7. enterprise invite → claim → start → submit lifecycle unchanged.
8. region pricing and currency sync unchanged.
9. Prism360 survey route unchanged.
10. Signal/employee-experience routes unchanged.
11. contact/conversation CTA unchanged.
12. privacy/terms/refund destinations unchanged.
13. canonical/meta title/description present.
14. no unsupported scientific/clinical claims introduced.
15. no coming-soon product represented as live.
16. footer copyright/brand consistent.
17. mobile menu keyboard/touch works.
18. no new third-party analytics/tracking.
19. no broken image/script/style references.
20. production deploy workflow must never deploy V6 branch before explicit approval.

## 11. Promotion sequence
A. V6 branch only → B. visual review → C. automated/static regression → D. authenticated functional acceptance on protected workflows → E. content/scientific/legal review → F. PR into main → G. exact-SHA Pages deploy verification → H. live smoke → I. retain V5 protected branch indefinitely until post-launch confidence.

## 12. Exact rollback
Emergency one-command ref rollback from a Git-enabled terminal:
```bash
git push origin dac963dcc7f4acf7248efbde9601dea16d462099:refs/heads/main --force-with-lease
```
Preferred controlled rollback is to move `main` to the same protected baseline SHA through the repository ref API/administration, then let the existing Pages workflow redeploy. This restores the complete V5 website tree, not selected files. Backend is unaffected because this repository is the public website.
After rollback: verify Pages deployment SHA == baseline; smoke Home, Professionals, one assessment launch, sign-in, Enterprise entry, Science, Trust and legal pages.

## 13. Rollback safety note
The baseline SHA predates V6 only. Any legitimate production changes merged to main after the baseline must be reconciled before a future rollback; never blindly force an old SHA over newer approved product/security fixes. At cutover, create a fresh pre-V6-cutover protected branch/SHA and use THAT as the one-command rollback target.

## 14. Current V6 implementation state
Implemented only on `v6-quiet-intelligence`: design token stylesheet, brand-led Home prototype, distinct problem-led Solutions prototype, and this blueprint. Main/production is intentionally untouched.
