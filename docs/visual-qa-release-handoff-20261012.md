# Syntropix visual QA — release handoff (12 October 2026)

## Decision
**Engineering QA passed; production promotion remains held for manual visual sign-off and explicit release approval.**
This is a source/preview technical acceptance, not a site-wide WCAG certification or independent aesthetic sign-off.

## Verified evidence
- 23 linked-page tests across 11 configured responsive viewport widths: successful final run.
- Hosted isolated Render browser smoke: successful — https://github.com/sbanhr-a11y/Syntropix/actions/runs/38272707629
- 30 main-versus-patch before/after screenshot captures compared: no unexpected visual drift under configured thresholds — https://github.com/sbanhr-a11y/Syntropix/actions/runs/38272707528
- V6 architecture browser parity: successful — https://github.com/sbanhr-a11y/Syntropix/actions/runs/38272707538
- V7 website, assessment-runtime and repository safety gates: successful on evaluated revision.
- Draft PR #98 is open and mergeable.

## Corrected surfaces
1. Professionals catalogue: metadata chips no longer require a single rigid non-wrapping row; mobile layout and CTA/pricing overflow guards were added.
2. Employee Experience: Culture Compass showcase navigation stacked at narrow mobile widths to avoid clipping.

## Important scope qualifications
- Pixel comparison applies to 5 selected routes and 6 screen widths (30 comparisons). Intentional reflows on the two changed routes were allowed; homepage animation variations were accepted within 0.5% comparison threshold. This does **not** demonstrate zero pixel differences.
- Responsive tests are automated structural/overflow checks. They do not replace human scrutiny of typography, focus order, interactions, screen-reader behavior or perceptual quality.
- Some assessment entry routes can redirect outside the isolated test origin; no authenticated purchasing, billing, recovery-email, or genuine user data tests were performed.
- The isolated preview is accessible at https://syntropix-visual-pr98-preview.onrender.com and is distinct from the production deployment.

## Release controls
- DO NOT merge or deploy to production solely on the basis of this report.
- Obtain visual sign-off for 320, 390, 768, 1024 and 1440px samples on Professionals and Employee Experience.
- Confirm actual primary CTA/link behavior on the isolated preview, including any redirecting journeys that demand separate environments.
- Re-run branch-protection and reviewer/Command isolation checks on the exact release SHA.
- Seek explicit production approval after the External Reviewer Programme release freeze permits promotion.
- Preserve the draft PR and screenshot artifacts as rollback/audit evidence.

## Links
- PR: https://github.com/sbanhr-a11y/Syntropix/pull/98
- Preview: https://syntropix-visual-pr98-preview.onrender.com
