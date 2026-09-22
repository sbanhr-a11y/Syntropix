# Syntropix V6 — Intelligent Humanism

## Objective
Create a world-class corporate-humanist digital experience for Syntropix without changing working application logic, assessment runtimes, authentication, AC/DC Horizon, enterprise console, payments, chat, call or backend services.

## Design thesis
Syntropix should feel like a human-capability technology company with advisory depth — not a conventional HR consultancy and not a generic SaaS template.

The experience combines:
- Swiss/editorial discipline
- contemporary B2B SaaS clarity
- behavioural-science credibility
- warm human storytelling
- restrained premium cues
- purposeful product visualization

## Canonical colour system
These are the approved semantic tokens and should be reused across V6.

- Champagne: `#D6B878`
- Champagne highlight: `#E7D09A`
- Emerald: `#2F8F6B`
- Sage: `#7FA58F`
- Slate Blue: `#6677A8`
- Plum / Deep Eggplant: `#5A345A`
- Near Black: `#070908`
- Dark Card: `#0D0E0D`
- Dark Border: `#292822`
- Warm Ivory: `#F4F2EC`
- Primary Light Text: `#F4F2EC`
- Secondary Text: `#AAA79F`
- Subdued Text: `#77766F`

### Semantic behaviour
- Champagne = brand emphasis / primary conversion / premium signal
- Emerald = action / progress / application
- Sage = development / support / learning
- Slate Blue = evidence / analysis / methodology / enterprise intelligence
- Plum = reflection / coaching / self-awareness
- Red and amber remain severity/status colours only

## Homepage architecture
1. Visible enterprise desktop navigation
2. Outcome-led hero
3. Product intelligence visualization
4. Connected capability rail
5. Human capability system architecture
6. Organizations vs Individuals journey split
7. Development-loop story
8. Product ecosystem showcase
9. Long-form human testimonial
10. Evidence and responsible-science narrative
11. Closing conversion section
12. Existing universal footer / call / chat controls

## UX principles
- Progressive disclosure over information dumping
- One dominant CTA per viewport
- Product shown before product explained
- Use real Syntropix workflows and language, not generic SaaS filler
- Alternate editorial, product, human and evidence sections to avoid card-grid fatigue
- Separate organization buyer psychology from individual buyer psychology
- Keep motion explanatory and reduced-motion compatible
- WCAG 2.2 AA target
- No fabricated metrics, customer outcomes or certifications

## Production boundaries
V6 homepage work MUST NOT modify:
- assessment-registry-v3.js
- assessment-runtime-v3.*
- assessment-validation-v2.js
- assessment-test-lab-v1.js
- auth-passwordless.js
- enterprise-console.*
- acdc-horizon.*
- payment/backend contracts
- database/Supabase assets

## Existing functionality preserved
The V6 homepage must retain:
- /enterprise.html
- /professionals.html route (visible label: Individuals)
- /solutions.html
- /science.html
- /trust.html
- assessment-invite-router-v1.js
- site-v5.js
- premium-ui-v1.js until shared-shell migration is complete
- global-footer-v1.js
- call control (data-call)
- chat control (data-chat)

## Migration sequence
### Phase 1 — Homepage prototype
Current branch: `v6-intelligent-humanism`
Only index.html + V6 homepage CSS/JS.

### Phase 2 — Shared design system
After homepage visual acceptance:
- extract canonical tokens and shared typography/layout primitives
- replace legacy marketing-only visual overrides progressively
- avoid touching authenticated/runtime pages

### Phase 3 — Enterprise experience
Rebuild enterprise page around:
problem → system → products → deployment → evidence → security → process → conversation.

### Phase 4 — Individual experience
Rebuild Individuals page around:
self-relevance → assessment discovery → report preview → price/time/privacy → checkout.

### Phase 5 — Solution pages
Migrate manager development, Prism360, Signal, talent, coaching and compliance pages using shared components.

### Phase 6 — Evidence / Trust / Legal
Refine editorial hierarchy and accessibility without changing substantive claims.

### Phase 7 — Regression and rollout
- desktop: 1440 / 1920
- tablet
- mobile
- keyboard
- reduced motion
- call
- chat
- lead form
- footer/legal
- assessment launch
- invitation router
- no console errors
- Pages gate
- canonical assessment runtime gate

## Rollback
Production V5.5 baseline before V6 work:
`a918798df6f6c5e47181e6c23650a7bbe6c0b62c`

V6 must remain isolated until visual and functional acceptance. If rollout fails, restore the production tree to that baseline or revert the single V6 merge commit.

## Acceptance bar
V6 should not be promoted merely because it is functional.

Promotion requires:
- coherent use of the canonical colour system
- no duplicate audience labels
- no broken routes
- no layout overflow at supported breakpoints
- no generic decorative graphics where product storytelling should be used
- strong visual rhythm beyond repeated card grids
- visible desktop navigation
- clear Organizations/Individuals paths
- evidence claims remain conservative and attributable
- all functional regression gates green
