# ZIMBABWE BRAND + PLATFORM PARITY — FOUNDER REVIEW

Release authorisation, 2026-09-03: the Founder subsequently instructed **“DEPLOY AND MERGE USE BASH COMMANDS ON MY PC”**. This authorises committing the reviewed patch, merging it into `main`, and releasing through the existing Vercel project. The review record below describes the pre-release state; the resulting merge SHA, deployment and post-release evidence are recorded in the release PR.

Branch: `fix/zimbabwe-brand-platform-parity`

Base SHA: `1b94d8e32f229bfa35ec438878e894c37d40efdc`

HEAD at initial review: `1b94d8e32f229bfa35ec438878e894c37d40efdc`. The presentation patch was **uncommitted and unpushed** at that review; this historical SHA does not include the patch.

## Diagnosis and implementation

The Zimbabwe pillar had a separate horizontal platform-card implementation. It now directly renders the existing `PlatformShowcase` export, outside the Zimbabwe-only typography wrapper so local paragraph and heading rules cannot override the homepage component. The existing `platform-proof` anchor and company record remain. No homepage component, platform data, screenshot path or platform action was duplicated or edited.

All 26 sector routes use the same existing template. Its editorial points, numbered Five Gates, foundation and minimum-access panels, native FAQ disclosures, two review/pricing panels and related-sector links now share LionTech navy surfaces and muted-gold framing. Approved sector images only received a border treatment; image sources, dimensions and crop rules are unchanged.

The frontend-design and minimal-change skills kept the homepage implementation and existing LionTech tokens authoritative. No new visual system or dependency was introduced.

## Files changed

- `src/pages/ZimbabwePage.tsx` — direct shared showcase reuse; remove custom platform data mapping and markup.
- `src/styles/zimbabwe.css` — remove the now-unused Zimbabwe-only platform overrides. Harare and Victoria Falls treatments are untouched.
- `src/pages/ZimbabweIndustryPage.tsx` — shared feature-panel classes and decorative, screen-reader-hidden gate numbers.
- `src/styles/zimbabwe-industries.css` — shared navy/gold cards, hierarchy, image frames and responsive treatment.
- `scripts/check-zimbabwe-cluster-browser.mjs` — check the shared four-card showcase and its reserved image-frame aspect ratio instead of removed custom selectors.
- `scripts/check-zimbabwe-brand-parity.mjs` — repeatable DOM/computed-style/geometry/hover parity, sector presentation, contrast and screenshot validation.
- `package.json` — add `test:zimbabwe-brand-parity`.
- This review report.

## PLATFORM PARITY

| Requirement | Result |
| --- | --- |
| Homepage PlatformShowcase reused | PASS — original export, unchanged |
| Zimbabwe custom platform layout removed | PASS |
| ClearVisa | PASS |
| CalcFee | PASS |
| Lead Recovery | PASS |
| CareOps | PASS — both actions retained |
| Exact card treatment | PASS |
| Exact desktop grid | PASS |
| Exact mobile behaviour | PASS |

Homepage and Zimbabwe each have four showcase cards. At 320, 360, 390, 412, 430, 768, 1024 and 1440px, the complete showcase DOM, all descendant relative bounding boxes and selected computed styles match, including image fits/positions, category/LIVE badges, text, buttons, borders, spacing and real pointer-hover state.

Component screenshots are captured directly from the pages with the fixed global header hidden for the capture only. Pixel-file identity is not asserted: sections start at different fractional vertical positions in the two full pages, which can produce a one-pixel screenshot boundary difference. The component geometry and styles are identical.

## SECTOR BRANDING

| Requirement | Result |
| --- | --- |
| 26 routes inherit shared styling | PASS |
| Gold eyebrows | PASS |
| Gold secondary headings | PASS |
| Editorial cards | PASS |
| Five Gates cards | PASS — five desktop columns; one mobile column |
| Security panel | PASS |
| FAQ cards | PASS — native details/summary preserved |
| Pricing cards | PASS |
| Related-industry cards | PASS |

All 26 routes passed shared presentation assertions at 390 and 1440px. Muted-gold hierarchy has a conservative 6.67:1 contrast ratio against the lightest solid navy panel used by the template, above the 4.5:1 small-text threshold.

## MOBILE

320 PASS · 360 PASS · 390 PASS · 412 PASS · 430 PASS

Browser coverage includes Chromium, Pixel 7 emulation and iPhone-size WebKit. These are emulated checks, not tests on physical devices. No sticky CTA was added.

## TESTS

| Command | Result |
| --- | --- |
| `npm run lint` | PASS — zero TypeScript errors |
| `npm run build` | PASS — 142 prerendered routes; 145 sitemap URLs; SEO/schema/content gates pass |
| `npm run test:public-privacy` | PASS — 298 files checked |
| `npm run test:browser-console` | PASS — 16 core/legacy routes |
| `npm run test:zimbabwe-copy` | PASS — zero banned phrases or UK Snapshot price leakage |
| `npm run test:zimbabwe-cluster` | PASS — 26 routes, unique metadata/FAQ, schema, links and sitemap |
| `npm run test:zimbabwe-enquiry` | PASS — 43 scenarios; Resend mocked; zero real emails sent |
| `npm run test:zimbabwe-browser` | PASS — eight viewport sizes; form/FAQ/hash/navigation checks |
| `npm run test:zimbabwe-cluster-browser` | PASS — final repeat: 216 route/viewport checks, Chromium and WebKit |
| `npm run test:zimbabwe-brand-parity` | PASS — eight parity widths and 52 sector presentation checks |
| `git diff --check` | PASS |
| Targeted secret/private-path scan | PASS — zero matches in changed code/test files |

Final checks report console errors: **0**; hydration errors: **0**; page errors: **0**; broken image/request errors: **0**; horizontal overflow: **0**.

The optional `--baseline` capture was run against the original build before rebuilding the patch. Before/after comparison passed for homepage text/images, every unaffected pillar section, all 26 sector texts/images, and all checked metadata/canonicals/JSON-LD. The decorative gate numbers are excluded from the text comparison. Content records, FAQ/Gates wording, prices, scope qualifications, enquiry logic and sitemap content have no source diff.

## Screenshots

Local, ignored QA evidence is under `artifacts/zimbabwe-page/brand-platform-parity/`. Open its `index.html` for the complete gallery, generated by the parity test. There are 134 PNG captures: four source showcase screenshots, two side-by-side comparisons and 128 sector captures.

Platform comparisons:

- [Desktop 1440 side by side](../artifacts/zimbabwe-page/brand-platform-parity/desktop-1440-side-by-side.png)
- [Mobile 390 side by side](../artifacts/zimbabwe-page/brand-platform-parity/mobile-390-side-by-side.png)
- [Homepage desktop](../artifacts/zimbabwe-page/brand-platform-parity/homepage/desktop-1440-platform-showcase.png)
- [Zimbabwe desktop](../artifacts/zimbabwe-page/brand-platform-parity/zimbabwe/desktop-1440-platform-showcase.png)
- [Homepage mobile](../artifacts/zimbabwe-page/brand-platform-parity/homepage/mobile-390-platform-showcase.png)
- [Zimbabwe mobile](../artifacts/zimbabwe-page/brand-platform-parity/zimbabwe/mobile-390-platform-showcase.png)

Each requested sample has full-page desktop 1440/mobile 390 captures, plus editorial, Five Gates, foundation, security, FAQ, pricing and related-sector captures:

| Sector | Desktop | Mobile |
| --- | --- | --- |
| Banking | [1440](../artifacts/zimbabwe-page/brand-platform-parity/sectors/banking-financial-services/desktop-1440-full.png) | [390](../artifacts/zimbabwe-page/brand-platform-parity/sectors/banking-financial-services/mobile-390-full.png) |
| Hotels | [1440](../artifacts/zimbabwe-page/brand-platform-parity/sectors/hotels-resorts/desktop-1440-full.png) | [390](../artifacts/zimbabwe-page/brand-platform-parity/sectors/hotels-resorts/mobile-390-full.png) |
| Construction | [1440](../artifacts/zimbabwe-page/brand-platform-parity/sectors/construction-companies/desktop-1440-full.png) | [390](../artifacts/zimbabwe-page/brand-platform-parity/sectors/construction-companies/mobile-390-full.png) |
| Property | [1440](../artifacts/zimbabwe-page/brand-platform-parity/sectors/property-real-estate/desktop-1440-full.png) | [390](../artifacts/zimbabwe-page/brand-platform-parity/sectors/property-real-estate/mobile-390-full.png) |
| Mining | [1440](../artifacts/zimbabwe-page/brand-platform-parity/sectors/mining-resources/desktop-1440-full.png) | [390](../artifacts/zimbabwe-page/brand-platform-parity/sectors/mining-resources/mobile-390-full.png) |
| Sports | [1440](../artifacts/zimbabwe-page/brand-platform-parity/sectors/sports-stadiums-organisations/desktop-1440-full.png) | [390](../artifacts/zimbabwe-page/brand-platform-parity/sectors/sports-stadiums-organisations/mobile-390-full.png) |
| Healthcare | [1440](../artifacts/zimbabwe-page/brand-platform-parity/sectors/healthcare-hospitals/desktop-1440-full.png) | [390](../artifacts/zimbabwe-page/brand-platform-parity/sectors/healthcare-hospitals/mobile-390-full.png) |
| Agriculture | [1440](../artifacts/zimbabwe-page/brand-platform-parity/sectors/agriculture-agri-processing/desktop-1440-full.png) | [390](../artifacts/zimbabwe-page/brand-platform-parity/sectors/agriculture-agri-processing/mobile-390-full.png) |

## Risks / assumptions and next action

- The existing Vite large-chunk warning remains (approximately 691 kB minified / 194 kB gzip). No new dependencies; bundle splitting is outside this presentation-only scope.
- The third-party watermarked banknote remains restricted to the existing local Founder-review mode. Release HTML does not expose it; production rights remain unresolved.
- Screenshot artifacts are local and ignored by Git. Re-run `npm run build` then the browser/parity tests to regenerate them. For a new before/after content comparison, run `node scripts/check-zimbabwe-brand-parity.mjs --baseline` against the pre-change build first.
- At completion of the initial review, no commit, push, live form submission, deployment, merge or indexing submission had been performed.

DEPLOYMENT AT INITIAL REVIEW: **NOT DEPLOYED**

MERGE AT INITIAL REVIEW: **NOT MERGED**

Founder subsequently authorised merge and production release on 2026-09-03, as recorded above. No design or commercial changes are authorised by that release instruction.
