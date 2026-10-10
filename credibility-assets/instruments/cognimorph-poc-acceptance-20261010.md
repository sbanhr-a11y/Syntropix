# Cognimorph POC — Acceptance Record (2026-10-10)

Status: DRAFT / source-only checks passed / browser and PDF gates OPEN.

## Scope and isolation
- Frontend source: `assessment-runtime-v3.js`, `assessment-runtime-v3.css` on `review/cognimorph-human-report-poc-20261010`.
- Canonical questionnaire file `assessment-registry-v3.js` unchanged (20 items, 8 reverse-keyed, four five-item dimensions).
- Shared scoring `function score()` byte-for-byte unchanged from `main`.
- Do not merge PR #92 or deploy production. Do not modify reviewer-program or shared backend on its active staging branch.

## Executed source checks
- JavaScript function parses: PASS.
- Four dimensions, five items each, eight reverse-keyed: PASS.
- Synthetic scoring (with same runtime score() extracted and executed): minimum keyed response 0/100, maximum keyed response 100/100, all raw 3 = 48/100, all raw 4 = 52/100: PASS.
- Population percentile guard in Cognimorph runtime: PRESENT.
- Cognimorph neutral visual classes and CSS: PRESENT.
- Accessible response buttons: native buttons grouped under question label, aria-pressed selection state: PRESENT; screen-reader behaviour not yet tested.
- Structured report narrative and three-part plan: PRESENT.

## Known release blockers (NOT PASSED)
1. **Actual staging deployment unavailable**: existing Render static services deploy from `website-v7-gold-standard` or `staging/hero-hcs-3d-20261001`, not the isolated Cognimorph review branch. Do not alter those shared sites without separate release engineering approval.
2. **Browser and mobile accessibility**: needs synthetic, authenticated end-to-end walkthrough (start, answer, refresh, report, export), WCAG-focused keyboard/screen-reader testing, and responsive screenshots.
3. **PDF output parity and premium layout**: staging backend `src/modules/reports/routes.js` currently converts reportHtml into plain text using `htmlToPlainText()` and PDFKit; headings, structured sections and visual charts will not automatically match the on-screen report. A Cognimorph-specific, versioned PDF renderer should be designed and tested independently. No changes to the shared backend performed.
4. **Score presentation**: numerical 0–100 self-report index remains displayed for transparency; show methodological caveat, do not call validated percentiles or ability benchmarks. Review visual semantics and small score differences through testing.
5. **Item rewrite**: 20 canonical items remain unchanged; candidate item wording requires independent review, cognitive interviews, measurement invariance and versioned validation before replacement.
6. **Scientific evidence**: absent reliability/validity/norm approvals and evidence IDs; instrument remains developmental.

## Exit criteria
Pass automated browser/mobile scenarios, report/PDF parity checks, RLS/privacy and telemetry review, independent scientific sign-off, and an isolated staging deploy verification. Preserve current reviewer assignments, report records and Command access. Production promotion remains separately authorized only after all gates.
