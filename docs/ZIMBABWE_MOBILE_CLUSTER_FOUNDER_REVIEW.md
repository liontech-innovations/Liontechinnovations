# ZIMBABWE MOBILE POLISH — FOUNDER REVIEW

Review date: 2 September 2026. Local working-tree result; not a release approval.

Branch: `fix/zimbabwe-victoria-falls-crop`

Commit: `2f5b322921685d718f693780553281c4ee534e3a` is the unchanged starting HEAD. This pass is uncommitted and unpushed.

Mobile breakpoints tested:

- 320×568: PASS — Chromium.
- 360×800: PASS — Chromium.
- 390×844: PASS — Chromium and iPhone/WebKit emulation.
- 412×915: PASS — Android/Pixel 7 emulation.
- 430×932: PASS — Chromium and iPhone/WebKit emulation.

Desktop regression: PASS — 1440×900; existing Zimbabwe regression also checks 1280×720 and 1920×1080. Homepage source, global brand stylesheet, commercial source data, APIs and approved image files remain unchanged.

Typography: PASS — mobile body copy 17px/1.6, section H2s 30px, key card/security headings 21px, 30px prices. Long approved headings wrap naturally rather than being rewritten or made tiny.

Eyebrow hierarchy: PASS — reusable `.lt-kicker` and form legend treatment uses the existing muted gold, 12px semibold uppercase and .12em letter spacing.

Spacing: PASS — 34px mobile section padding, 22px heading gaps and more compact card interiors. The explicitly requested 26-card directory makes the pillar longer overall; that is substantive added navigation, not empty padding.

Safe delivery steps: PASS — all seven retained, one column on mobile, gold numbers and separators. Desktop grid retained.

Security section: PASS — approved text retained; stronger titles and simple separators.

Controls card: PASS — existing eight controls retained, aligned icons, 18px mobile padding.

Five Gates cards: N/A on the pillar, as agreed in the scope clarification. PASS on sector pages: concise, sector-specific Discover / Describe / Trust / Compare / Act blocks.

Evidence cards: N/A on the pillar, as agreed. PASS on sector pages: practical readiness checkpoints explicitly labelled as questions, not client findings. No homepage finding cards were transplanted.

Offer cards: PASS — names, prices, descriptions, inclusions, scope guardrails and CTAs retained in order. US$750 review, modernisation from US$2,500 and AI implementation from US$2,750 remain unchanged. Enterprise/banking replatforming stays separately scoped.

Harare image crops: PASS — approved source files, responsive sources, fit and positions unchanged. A narrow backing behind the small mobile company-registration line corrects photo contrast without changing the crop or whole-photo overlay.

Digital future: PASS — readable vertical architecture sequence; five visible decorative labels on mobile, no new animation, reduced-motion support retained.

FAQ: PASS — native keyboard-operable details/summary, visible focus, 48px minimum rows. Approved answers unchanged.

Form: PASS — one column, 16px inputs, 48px fields/submit target, visible confidentiality note, validation/success/error states tested. API tests use mocked delivery; no real email was sent.

Sticky CTA: NOT IMPLEMENTED.

Reason: existing header, hero, offer and closing actions already provide a direct enquiry path. A bottom bar would obscure useful mobile space without evidence of benefit.

Header: PASS — active Zimbabwe state also works on child pages; mobile menu closes on selection.

Footer: PASS — mobile text/links use Zimbabwe-scoped sizing and touch spacing; legal entity remains company no. 17068390, with no residential address or invented Zimbabwe office.

Accessibility: PASS for the tested checks — keyboard FAQ/navigation, form sizing, gold labels, document/element overflow and text contrast. Six-width pixel sampling of visible pillar text, with FAQs expanded, returned zero contrast failures; minimum measured ratio 4.51:1. This is not a claim of full assistive-technology certification.

Performance: PASS for local image/layout checks, with a bundle warning. New 480/960px AVIF derivatives are 19–90KB, with WebP/JPEG fallbacks; no originals are shipped for new sector visuals. Existing below-fold photography remains lazy. Platform image intrinsic dimensions now match the artwork, preventing the measured mobile lazy-load jump without changing the final card appearance. The existing single-bundle warning remains: final JS is about 692KB / 194KB gzip, versus baseline 558KB / 157KB gzip. No production Core Web Vitals or physical-device network result is claimed.

Client-copy firewall: PASS.

Banned phrase count: 0 in rendered public copy.

Tests:

- `npm run lint`: PASS — zero TypeScript errors.
- `npm run build`: PASS — 142 prerendered routes; 145 sitemap URLs; existing 100-page UK content suite unchanged and passing.
- `npm run test:browser-console`: PASS — 16 core/legacy routes, zero console/page/hydration errors.
- `npm run test:public-privacy`: PASS — 250 final public/source artifacts checked (the build-time scan also passed).
- `npm run test:zimbabwe-copy`: PASS — copy, prices, FAQ/schema parity, canonical and assets.
- `npm run test:zimbabwe-enquiry`: PASS — 43 scenarios, mocked email transport.
- `npm run test:zimbabwe-browser`: PASS — eight viewports, form/FAQ/hash/navigation, no broken requests or overflow.
- `npm run test:zimbabwe-cluster`: PASS — 26 substantive routes, metadata, schema, linking and copy gates.
- `npm run test:zimbabwe-cluster-browser`: PASS — 216 route/profile checks, zero console/page/hydration/request errors, broken images or overflow. Observed Chromium layout shift: 0; WebKit does not expose this metric and is recorded as unavailable, not zero.

Screenshots (local QA artifacts, deliberately not committed):

- [01 — Hero, 390px](../artifacts/zimbabwe-page/cluster/01-hero.png)
- [02 — Corporate focus](../artifacts/zimbabwe-page/cluster/02-corporate-focus.png)
- [03 — Business today](../artifacts/zimbabwe-page/cluster/03-business-today.png)
- [04 — Offers](../artifacts/zimbabwe-page/cluster/04-offers.png)
- [05 — Digital future](../artifacts/zimbabwe-page/cluster/05-digital-future.png)
- [06 — Safe delivery](../artifacts/zimbabwe-page/cluster/06-safe-delivery.png)
- [07 — Security](../artifacts/zimbabwe-page/cluster/07-security-controls.png)
- [08 — Platform proof](../artifacts/zimbabwe-page/cluster/08-proof.png)
- [09 — Banking Five Gates](../artifacts/zimbabwe-page/cluster/09-five-gates.png)
- [10 — Banking evidence checkpoints](../artifacts/zimbabwe-page/cluster/10-evidence.png)
- [11 — FAQ](../artifacts/zimbabwe-page/cluster/11-faq.png)
- [12 — Enquiry form](../artifacts/zimbabwe-page/cluster/12-enquiry-form.png)
- [13 — Final CTA / Victoria Falls](../artifacts/zimbabwe-page/cluster/13-final-cta.png)
- [430px full pillar](../artifacts/zimbabwe-page/cluster/mobile-430-pillar-full.png)
- [1440px full pillar](../artifacts/zimbabwe-page/cluster/desktop-1440-pillar-full.png)
- [Browser results](../artifacts/zimbabwe-page/cluster/browser-qa.json)
- [Contrast results](../artifacts/zimbabwe-page/cluster/contrast-qa.json)

Known issues:

- Mobile checks are browser emulation, not physical Gmail/WhatsApp in-app browser sessions.
- The watermarked banknote is local-preview-only; its production usage rights are unconfirmed.
- Existing large-JS-bundle warning remains. Field performance and deployed CDN/WAF behaviour are not tested because deployment is prohibited.
- The worktree is intentionally dirty with this uncommitted pass. Existing eyebrow work was preserved, not reset.

Deployment: NOT DEPLOYED.

Merge: NOT MERGED. Push: NOT PUSHED. Indexing: NOT SUBMITTED.

Recommended Founder action: review the mobile screenshots before approving repository delivery.

# ZIMBABWE PROGRAMMATIC SEO CLUSTER — FOUNDER REVIEW

Branch: `fix/zimbabwe-victoria-falls-crop`

Base SHA: `2f5b322921685d718f693780553281c4ee534e3a`

Final SHA: unchanged — `2f5b322921685d718f693780553281c4ee534e3a`. The implementation is in the working tree; no new commit was created.

Pillar page:

- `/zimbabwe`

Industry pages created:

1. `/zimbabwe/banking-financial-services`
2. `/zimbabwe/insurance-pensions`
3. `/zimbabwe/hotels-resorts`
4. `/zimbabwe/travel-tourism`
5. `/zimbabwe/construction-companies`
6. `/zimbabwe/property-real-estate`
7. `/zimbabwe/logistics-distribution`
8. `/zimbabwe/industrial-manufacturing`
9. `/zimbabwe/mining-resources`
10. `/zimbabwe/agriculture-agri-processing`
11. `/zimbabwe/healthcare-hospitals`
12. `/zimbabwe/education-training`
13. `/zimbabwe/telecoms-connectivity`
14. `/zimbabwe/retail-supermarkets`
15. `/zimbabwe/fmcg-consumer-brands`
16. `/zimbabwe/energy-utilities`
17. `/zimbabwe/professional-services`
18. `/zimbabwe/legal-advisory`
19. `/zimbabwe/accounting-audit-compliance`
20. `/zimbabwe/hospitality-events-conferencing`
21. `/zimbabwe/automotive-mobility`
22. `/zimbabwe/recruitment-hr`
23. `/zimbabwe/corporate-groups-holdings`
24. `/zimbabwe/ngos-foundations-development`
25. `/zimbabwe/parastatals-public-enterprises`
26. `/zimbabwe/sports-stadiums-organisations`

Total Zimbabwe routes added: 26; 27 Zimbabwe routes including the existing pillar.

Data/content model:

- `src/content/zimbabweIndustries.ts`: 26 typed editorial records, each with its own context, problems, proposed scope, use cases, foundations, checkpoints, human-control boundaries, FAQs, related routes and CTA framing.
- `src/content/zimbabweGates.ts`: five short, sector-specific questions for each route.
- `src/content/zimbabweIndustrySeo.ts`: unique metadata, shared canonical organization identity, USD review service, matching FAQ and three-level breadcrumb schema.
- `src/pages/ZimbabweIndustryPage.tsx`: one template using existing route sections, links and market layout. No new framework, dependency, CMS or parallel routing system.
- Word counts: 808–944 per page, excluding global header/footer. Differentiated content: 68.1–76.3% under the repeated-eight-word-sequence coverage check, including shared template copy. This is a reproducible local editorial check, not a search-engine metric or ranking prediction.

Internal linking: PASS.

Details:

- All 26 pillar cards are real links, with a sector benefit and visible action.
- Each child links to the pillar, its enquiry anchor and 2–4 valid related sectors.
- Sports links to hospitality/events, travel/tourism, hotels/resorts and corporate groups.
- Lower pillar links reinforce sector discovery. No orphan routes or missing target anchors were found.

SEO:

- Unique titles: PASS.
- Unique meta descriptions: PASS.
- Unique H1s: PASS.
- Canonical URLs: PASS — production-domain, self-referential paths.
- FAQ schema: PASS — parses and exactly matches visible questions/answers.
- Breadcrumbs: PASS — Home → Zimbabwe → sector.
- Service/entity consistency: PASS — existing LionTech Organization ID and USD750 review, with Zimbabwe service area.
- Sitemap updated: PASS — new `sitemap-zimbabwe.xml`, linked from the existing sitemap index; all 145 URLs unique. Zimbabwe entries dated 2026-09-02; unrelated route dates retained.
- Prerender updated: PASS — all 26 new pages contain substantive initial HTML.
- Crawler access: PASS for local HTML/robots checks. Deployed challenge behaviour is untested. No search-engine submission was made.
- `llms.txt`: Zimbabwe guidance, hub, enquiry and selected sector references added; existing UK content retained.

Programmatic sector cards clickable: PASS.

Images mapped:

- Banking: supplied Reserve Bank sign as contextual imagery with explicit non-endorsement caption. Historical banknotes appear only in local Founder-review mode, unchanged and with watermark visible.
- Tourism / hotels / events: existing Victoria Falls derivatives, full waterfall composition retained.
- Construction / property / corporate / general professional sectors: supplied wide Harare CBD photograph; no building is claimed as a client or LionTech premises.
- Logistics / mobility: supplied transport illustration, explicitly labelled as an illustration rather than a real LionTech operation.
- Mining / industrial: supplied loader and haul-truck photograph, contextual only.
- Agriculture: supplied cultivated rows photograph.
- Public enterprises: supplied institutional building, with no government appointment/endorsement implied.
- Sports: supplied sports/national-colours illustration; no invented club, association or venue relationship.
- Digital future: approved pillar glass-building photograph and restrained network treatment retained.
- Zimbabwe pillar hero: approved Harare source, crop and responsive image choices retained.

Image preparation: `scripts/prepare-zimbabwe-sector-assets.py` creates 42 deterministic derivatives from seven supplied sources, with no generative editing, object removal, upscaling or destructive source changes. Public manifest records hashes/dimensions, not local source paths. Derivatives contain no EXIF metadata. Existing tourism images are reused.

Humanizer/client-facing copy firewall: PASS.

Banned phrase count: 0.

The Humanizer pass favoured concrete sector workflows and named information boundaries over promotional filler. The programmatic SEO skill shaped the independent record model, distinct questions/examples and anti-duplication gates. Existing LionTech tokens and the [Refero reference library](https://styles.refero.design/) informed restrained hierarchy; no new palette or visual system was introduced. Sector reference links are context, not endorsements or claims that LionTech has delivered those projects.

Mobile QA: PASS for the tested routes and browser profiles; no physical-device or live delivery claim.

Tests:

- `npm run lint`: PASS.
- `npm run build`: PASS.
- `npm run test:browser-console`: PASS.
- `npm run test:public-privacy`: PASS.
- Zimbabwe copy checks: PASS.
- Content/schema/link validation: PASS — [per-page content results](../artifacts/zimbabwe-page/cluster/content-qa.json).
- Browser/viewport evidence: PASS — 216 route/profile checks; [results](../artifacts/zimbabwe-page/cluster/browser-qa.json).
- Local banknote guard: PASS — preview build mode rejects release builds, normal release HTML has no banknote reference, file bytes match the supplied original. [Guard result](../artifacts/zimbabwe-page/cluster/licensing-guard-qa.json).

Screenshots:

| Sample sector | Mobile 390px | Desktop 1440px |
| --- | --- | --- |
| Banking | [Screenshot](../artifacts/zimbabwe-page/cluster/mobile-390-banking-financial-services.png) | [Screenshot](../artifacts/zimbabwe-page/cluster/desktop-1440-banking-financial-services.png) |
| Travel & tourism | [Screenshot](../artifacts/zimbabwe-page/cluster/mobile-390-travel-tourism.png) | [Screenshot](../artifacts/zimbabwe-page/cluster/desktop-1440-travel-tourism.png) |
| Construction | [Screenshot](../artifacts/zimbabwe-page/cluster/mobile-390-construction-companies.png) | [Screenshot](../artifacts/zimbabwe-page/cluster/desktop-1440-construction-companies.png) |
| Logistics | [Screenshot](../artifacts/zimbabwe-page/cluster/mobile-390-logistics-distribution.png) | [Screenshot](../artifacts/zimbabwe-page/cluster/desktop-1440-logistics-distribution.png) |
| Mining | [Screenshot](../artifacts/zimbabwe-page/cluster/mobile-390-mining-resources.png) | [Screenshot](../artifacts/zimbabwe-page/cluster/desktop-1440-mining-resources.png) |
| Agriculture | [Screenshot](../artifacts/zimbabwe-page/cluster/mobile-390-agriculture-agri-processing.png) | [Screenshot](../artifacts/zimbabwe-page/cluster/desktop-1440-agriculture-agri-processing.png) |
| Healthcare | [Screenshot](../artifacts/zimbabwe-page/cluster/mobile-390-healthcare-hospitals.png) | [Screenshot](../artifacts/zimbabwe-page/cluster/desktop-1440-healthcare-hospitals.png) |
| Sports | [Screenshot](../artifacts/zimbabwe-page/cluster/mobile-390-sports-stadiums-organisations.png) | [Screenshot](../artifacts/zimbabwe-page/cluster/desktop-1440-sports-stadiums-organisations.png) |

[Banknote — Founder preview only](../artifacts/zimbabwe-page/cluster/banking-banknotes-preview-only.png).

Production licensing status: NOT CLEARED for the watermarked banknote. Do not place it in `public/`, publish it or remove/conceal its watermark. A licensed replacement or explicit confirmation of usage rights is required before production use. Normal production builds exclude it entirely.

For this workspace's banknote review, run the existing Vite dev server with `--mode founder-review --host 127.0.0.1` and open the banking route. The source copy is stored under ignored `artifacts/zimbabwe-page/preview-only/`, never in the public assets directory. `vite build --mode founder-review` intentionally fails.

Deployment: NOT DEPLOYED.

Merge: NOT MERGED. Push: NOT PUSHED. Indexing: NOT SUBMITTED.

Recommended Founder action: review `/zimbabwe` and the eight sample sectors above, then explicitly approve any repository delivery. Merge, deployment and indexing remain blocked.

## Files changed and verification notes

- UI: `src/pages/ZimbabwePage.tsx`, `src/pages/ZimbabweIndustryPage.tsx`, `src/components/ZimbabweSectorImage.tsx`, `src/styles/zimbabwe.css`, `src/styles/zimbabwe-industries.css`.
- Shared integration: `src/components/layout/MarketingLayout.tsx`, `src/content/navigation.ts`, `src/routes/AppRoutes.tsx`, `src/prerender.tsx`, `scripts/prerender.mjs`, `vercel.json`.
- Data/SEO: the three Zimbabwe industry content files, `scripts/generate-programmatic-assets.mjs`, `scripts/check-seo-artifacts.mjs`, `public/sitemap.xml`, `public/sitemap-core.xml`, `public/sitemap-zimbabwe.xml`, `public/llms.txt`.
- Assets/QA: `public/assets/zimbabwe/sectors/`, `scripts/prepare-zimbabwe-sector-assets.py`, `scripts/check-zimbabwe-cluster.mjs`, `scripts/check-zimbabwe-cluster-browser.mjs`, `package.json`, `vite.config.ts`, this report.
- Existing `zimbabwe.css` eyebrow edits were present before this pass and retained.
- API, form fields, payment/checkout code, commercial source data, homepage source and approved Harare/Victoria Falls image files have no diff.
- Local QA artifacts and SEO cache are ignored. No files were staged, committed or pushed.
- Changed-file secret/local-path pattern scan: PASS, zero matches; protected-file diff and staged-file checks: PASS. This is not a certification against every possible secret format. No credential files were read.

Re-run the named npm scripts from the repository root. Run `npm run build` before either Zimbabwe browser command so screenshots exercise current prerendered output.
