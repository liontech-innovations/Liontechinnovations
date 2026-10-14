# Tender resource brand parity

## Scope and evidence

Follow-up to the hub-only PR #19. The shared resource template now uses LionTech's existing connected navy sections, gold eyebrows, standard cards, commercial CTA, FAQ treatment and typography. Every valid resource route opts into the existing compact footer. The hub hero and design are preserved; only the requested visible image-warning copy is removed. Accurate image alt descriptions, service boundaries, source notes and internal approval records remain.

Two visual iterations: the first exposed a five-step sequence wrapping into a four-plus-one desktop grid. The second uses the native five-step grid and three-column mistakes grouping. Full-page desktop/mobile screenshot contact sheets were inspected for every route. No publication records, authored resource guidance, downloads, payment logic or backend were changed.

## Route-by-route coverage

Each row passed at 1440, 1280, 1024, 768, 390 and 375 CSS pixels. Measurements below are actual Windows Chromium results, not target values. Mobile footer groups are collapsed initially and were keyboard-opened to verify all links remain available. Published resources are also checked in the normal production build; draft visual results come from the isolated full-catalogue preview, not 404 checks.

| Route | Publication | Desktop footer (1440px) | Mobile footer (375px) | Six widths |
|---|---|---:|---:|---|
| /tenders | Published hub | 221.28px | 435.89px | PASS |
| /tenders/cleaning-tender-support | Published | 221.28px | 435.89px | PASS |
| /tenders/facilities-management-tender-support | Published | 221.28px | 435.89px | PASS |
| /tenders/construction-tender-support | Published | 221.28px | 435.89px | PASS |
| /tenders/grounds-maintenance-tender-support | Draft | 221.28px | 435.89px | PASS |
| /tenders/security-services-tender-support | Draft | 221.28px | 435.89px | PASS |
| /tenders/catering-tender-support | Draft | 221.28px | 435.89px | PASS |
| /tenders/building-maintenance-tender-support | Draft | 221.28px | 435.89px | PASS |
| /tenders/it-services-tender-support | Draft | 221.28px | 435.89px | PASS |
| /tenders/bid-no-bid-checklist | Published | 221.28px | 435.89px | PASS |
| /tenders/how-to-find-uk-tenders | Draft | 221.28px | 435.89px | PASS |
| /tenders/tender-document-checklist | Draft | 221.28px | 435.89px | PASS |
| /tenders/how-to-write-tender-method-statements | Draft | 221.28px | 435.89px | PASS |
| /tenders/tender-scoring-and-evaluation-criteria | Draft | 221.28px | 435.89px | PASS |
| /tenders/framework-agreements-and-call-offs | Draft | 221.28px | 435.89px | PASS |
| /tenders/tender-clarification-questions | Draft | 221.28px | 435.89px | PASS |
| /tenders/ai-assisted-bid-writing-human-review | Draft | 221.28px | 435.89px | PASS |
| /tenders/preparing-your-first-tender | Draft | 221.28px | 435.89px | PASS |
| /tenders/tender-compliance-matrix-template | Published | 221.28px | 435.89px | PASS |
| /tenders/tender-evidence-register-template | Draft | 221.28px | 435.89px | PASS |
| /tenders/90-day-mobilisation-plan-template | Draft | 221.28px | 435.89px | PASS |
| /tenders/social-value-response-planner | Draft | 221.28px | 435.89px | PASS |
| /tenders/tender-case-study-template | Draft | 221.28px | 435.89px | PASS |
| /tenders/client-commitment-register-template | Draft | 221.28px | 435.89px | PASS |
| /tenders/bid-review-checklist | Draft | 221.28px | 435.89px | PASS |
| /tenders/tender-deadline-planner | Draft | 221.28px | 435.89px | PASS |

All 26 footers also measured 221.28px at 1280, 386.70px at 1024, 426.31px at 768 and 435.89px at 390. Full-page and footer images for each route/width, plus machine-readable results and linked coverage tables, are saved under ignored `qa-artifacts/resource-parity/iteration-2/`. Before screenshots and homepage/hero comparisons are in `before/` and `preservation/`. Screenshots are review artefacts, not production assets.

## Reproduce without publishing drafts

```powershell
$env:TENDERS_ALL_WIDTHS='true'
node scripts/check-tender-resource-design.mjs
```

The runner starts an isolated loopback-only Vite review, renders all 25 actual resource components and the hub, serves worksheets in memory, records footer geometry, checks content/metadata, opens FAQs and footer groups by keyboard and navigates each mobile enquiry CTA without sending it. It then stops the server. CI runs the desktop/mobile matrix and uploads `tender-resource-visual-coverage`, including per-route screenshots, `coverage.md` and `report.json`.

`tender-catalogue-review` mode is non-buildable and rejected in all Vercel environments. Review responses have `noindex, nofollow` and `no-store`. The production build explicitly ignores the similarly named environment variable. The unchanged release records still allow only five resources plus the hub, ten downloads, and six tender sitemap URLs. The other 20 pages and 40 downloads remain unavailable in normal builds/deployments.

For published-route checks set `TENDERS_BASE_URL` to the actual deployment and `TENDERS_EXPECT_PUBLISHED=true` for production. OIDC preview access, when used, is restricted to that exact origin and never saved in artefacts. No real enquiry is sent.

## Boundaries and scope review

- Keep: shared resource template/CSS, resource `compactFooter` opt-in, requested visible warning/stamp removal.
- Justified: Vite/index review gate for genuine draft rendering without publication; catalogue browser gate and CI artefact upload for repeatable all-resource coverage.
- Keep: regression harness now selects a free local preview port instead of conflicting with the isolated catalogue server.
- Unchanged: homepage, hub hero JSX/styles/assets, shared default footer, publication/review records, source content, API handlers, payment configuration, dependencies and Vercel rewrites.
- Image comparison: 1440px hero is pixel-identical; at 375px only the final one-pixel boundary row changes because the warning paragraph below it was removed. Hero content and dimensions are unchanged. Homepage text, footer DOM and footer dimensions match the production baseline.

This is visual/functional QA, not new editorial approval of the 20 draft resources. Production deployment evidence must be recorded after the follow-up PR merges, not inferred from these local results.
