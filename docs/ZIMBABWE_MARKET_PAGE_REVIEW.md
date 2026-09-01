# Zimbabwe market page — Founder review

Date: 1 September 2026. Status: ready for local Founder review; not published.

- Branch: `feat/zimbabwe-corporate-market-page`
- Verified base main and origin/main: `ecd141797f1a986e324dd6dd4248d01a9a4bbe6a`
- Intended canonical: `https://liontechinnovations.co.uk/zimbabwe`
- No merge, deployment, payment change, live enquiry or indexing submission was performed.
- No push or GitHub PR was opened. The review package is prepared locally; a push can trigger Vercel's automatic preview deployment. Do not push until the no-deployment condition is resolved or the Founder authorises the next release stage.

## Scope and design source

The supplied 1 September Zimbabwe mission controls the copy, pricing, photo order and scope. Existing React 19/Vite architecture, MarketingLayout, header, footer, typography, palette and component primitives are retained. There is no new website, CMS, database, checkout or design-token system.

[Refero Styles](https://styles.refero.design/) and its [Mercury dark-canvas reference](https://styles.refero.design/style/3172cd4d-118a-4a16-a259-6b634d32322e) informed restrained composition within the existing LionTech system. The installed Taste skill was used with the mission's required headlines, six sectors and commercial ladder taking precedence over generic stylistic guidance.

The installed Humanizer skill and [upstream principles](https://github.com/blader/humanizer) guided the copy review. Approved facts, prices, security boundaries and FAQ answers were preserved; no supporting statistics, Zimbabwe offices, customers, certifications or endorsements were invented.

## What changed

- First-class `/zimbabwe` route with all ten ordered narrative sections and a dedicated enquiry form.
- Four supplied Harare photographs, small supplied map/flag badge, and deterministic Zimbabwe OG card made from the supplied hero and existing logo.
- Shared header/footer accept an optional Zimbabwe market context. Only that route uses the Executive Review CTA and admin mailbox. The global navigation and footer gain the requested understated Zimbabwe links.
- Review CTAs stay at `/zimbabwe#zimbabwe-enquiry`; delivery link stays at `/zimbabwe#delivery`. Absolute route-plus-hash links account for the existing navigation helper's URL resolution.
- Dedicated bounded, validated, escaped enquiry API using existing Resend environment names. No payment or checkout behavior added.
- Self-canonical metadata, 1200×630 social metadata, canonical Organization ID, USD 750 Service, matching nine-answer FAQ and breadcrumb schema.
- Existing route/prerender/sitemap infrastructure includes Zimbabwe. Its last-modified date is 2026-09-01; historical route dates remain unchanged.
- Zimbabwe copy, endpoint and browser tests are included in the existing PR validation workflow.

The homepage JSX, homepage hero media, UK offers, UK form fields, Snapshot API, platform source data, legal copy and payment endpoints are unchanged.

## Locked asset mapping

| Supplied file | Role | Repository JPEG |
| --- | --- | --- |
| Photo 2 | Hero: blue sky and dark glass tower | `public/assets/zimbabwe/harare-hero.jpg` |
| Photo 3 | Business today: active boulevard | `public/assets/zimbabwe/harare-business-district.jpg` |
| Photo 5 | Digital foundation: glass grid and palms | `public/assets/zimbabwe/harare-digital-future.jpg` |
| Photo 4 | Closing CTA: tower, road and pedestrian bridge | `public/assets/zimbabwe/harare-infrastructure-cta.jpg` |
| Photo 1 | Zimbabwe silhouette/flag badge | `public/assets/zimbabwe/zimbabwe-map-flag.jpg` |

Source SHA-256 records (recorded for provenance, not a claim of a separately supplied hash manifest):

```text
Photo 1 8236e67e8d887e5cb02aaecf84a80c6b547653412efac83792704f653f5f6891
Photo 2 90f103d64c45fe8a10a5ccf7648877564574e206465c862393bb5c2b04238de7
Photo 3 e5e201a5bd42ae3027cf5f853ef26936ef602ca6401bac6ddc6996dae69e5614
Photo 4 192c1cc1bf91b61d27963038d59e9ba3580584349189fb9bde946fd433b3c644
Photo 5 aa0d4ce9b3ff5b29e01fde0830c38a289e0154b8ee4cda81f6e196c863f2dece
```

The four photographs each have 480px/960px JPEG, WebP and AVIF derivatives. All 26 delivered images were checked and contain no EXIF/GPS metadata. The map remains in its original proportions and colours. Originals were not modified. No image-generation service or replacement stock was used. The hero AVIF is 48,196 bytes at 480px and 134,233 bytes at 960px. Below-fold photos are lazy-loaded. The new page has no video or animation dependency.

`scripts/prepare-zimbabwe-assets.py` reproduces the derivatives using Pillow and the supplied attachment directory. Its second argument is the local font directory containing `segoeui.ttf` and `seguisb.ttf`. This authoring utility is not a runtime dependency or build requirement.

## Copy and commercial review

- US$750 Corporate AI & Digital Readiness Review: preserved.
- Institutional Website & Digital Modernisation from US$2,500: preserved.
- AI & Operational Implementation from US$2,750: preserved.
- Full banking platforms, portals, multi-property systems, enterprise replatforming and regulated integrations: explicitly separate scope.
- Minimum access, staging where practical, backups/recovery, approval before release and separately approved sensitive integrations: visible.
- No guaranteed recommendations, rankings, revenue, zero-risk security or regulatory endorsement.
- No UK £395 Snapshot copy or contact@ fallback on Zimbabwe.
- Visible page copy, including expanded FAQ answers and footer, is saved in `artifacts/zimbabwe-page/visible-copy.txt` for review.
- Automated built-HTML firewall: zero prohibited phrases. FAQ JSON-LD matches the visible answers exactly.

## Enquiry security review

Flow: public browser → dedicated API → existing Resend service → configured internal recipient. It stores no data in a new database and makes no request to the submitted website URL.

Controls implemented and tested:

- POST and JSON only; streaming request cap of 12,000 bytes.
- Explicit field allowlist; bounded string fields; required fields and enums validated server-side.
- Explicit boolean consent; honeypot accepts silently without sending.
- Existing HTTP(S) website normaliser; unsafe schemes, credentials-in-URL and invalid text rejected.
- Control-character cleanup and HTML escaping; fixed destination/provider endpoint; generic error responses.
- `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, and a ten-second upstream timeout.
- Existing `RESEND_API_KEY`, `INTAKE_FROM_EMAIL`, `INTAKE_RECIPIENT_EMAIL` names only; no credential files read or values printed.
- Default internal recipient and public fallback: admin@liontechinnovations.co.uk.
- Market, required subject/title and normalised website present in the mocked email payload.

43 API scenarios passed with Resend mocked. Browser validation, success, retained-input failure, safe fallback email and website rejection passed with mocked responses. These checks do not assert live inbox delivery.

Residual release risk — automated spam (medium): a client can submit otherwise valid requests with an empty honeypot. The handler deliberately does not add a database or an unreliable per-instance limiter. Before public release, confirm platform-level protection covers this new endpoint. Suggested rule for approval: `POST /api/zimbabwe-enquiry`, client-IP key, at most five requests per minute, excess returns 429. Verify the policy with controlled requests in an authorised non-production environment; do not load-test production. This configuration was not applied in this mission.

## Verification observed

Run browser/server-based commands sequentially to avoid local Vite development-websocket port conflicts.

| Command | Result |
| --- | --- |
| `npm ci` | PASS; lockfile unchanged, zero reported vulnerabilities |
| `npm run lint` | PASS (TypeScript no-emit) |
| `npm run build` | PASS; 116 prerendered routes, 119 unique sitemap URLs |
| Included programmatic content check | PASS; 100 pages, 1,157–1,405 substantive words, highest similarity 0.4573 |
| Included SEO artifact check | PASS; 24 AI-data files, five release cohorts, zero failures |
| `npm run test:browser-console` | PASS; 16 marketing/legal/CareOps routes; console/page/hydration errors all zero |
| `npm run test:public-privacy` | PASS; 262 files, six approved company facts |
| `npm run test:zimbabwe-copy` | PASS; copy, schema parity, canonical, route rewrite and assets |
| `npm run test:zimbabwe-enquiry` | PASS; 43 scenarios, no real email sent |
| `npm run test:zimbabwe-browser` | PASS; all eight required viewports, form/FAQ/hash/navigation checks |
| `node scripts/check-ai-crawlers.mjs` | PASS for local initial HTML/robots policy; live WAF/CDN not tested |
| `node scripts/check-programmatic-routes.mjs` | PASS; 101 industry routes and five discovery journeys; console/page/hydration errors zero |
| `node scripts/check-snapshot-url-normalisation.mjs` | PASS; unchanged UK API/browser validation and two qualification layouts |
| `npm run test:email-signature` | PASS; existing approved image hash and installer preserved |
| `npm run test:og-card` | PASS; existing approved global OG hash and five route checks preserved |
| `npm audit --audit-level=high` | PASS; zero vulnerabilities reported |

Staged diff/filename and common credential-pattern scan: PASS across 55 scoped files, zero findings; no screenshots, local environment files or credential files staged. This is a targeted pre-commit scan, not a claim of exhaustive penetration testing.

Existing build warning remains: the main JavaScript chunk exceeds Vite's 500 kB advisory threshold (approximately 556 kB raw / 156 kB gzip; baseline already exceeded the threshold). No dependency or broad code-splitting refactor was introduced for this contained page.

## Founder screenshots

All generated screenshots are deliberately ignored by Git under `artifacts/zimbabwe-page/`:

```text
desktop-1440-hero.png
desktop-1440-offers.png
desktop-1440-security.png
desktop-1440-faq.png
desktop-1440-final-cta.png
mobile-390-hero.png
mobile-390-offers.png
mobile-390-security.png
mobile-390-faq.png
mobile-390-form.png
```

Additional business, foundation, footer and mobile final-CTA captures are available in the same directory. `qa-results.json` contains measurements for 320×568, 360×800, 390×844, 412×915, 430×932, 1280×720, 1440×900 and 1920×1080. All passed with zero overflow, broken images/requests, console errors, page errors and unhandled rejections. Inputs are at least 16px. Desktop navigation stays on one line at the tested desktop widths. Native FAQ keyboard controls and focus indicators were tested. Section captures use a section-height viewport to avoid off-viewport screenshot clipping of fixed controls; website focus styles are not hidden or changed.

## Release gates and PR preparation

Proposed PR title: **Add Zimbabwe corporate market page and dedicated executive enquiry**.

PR summary: contained market route, approved photo sequence and USD offer ladder, safe dedicated enquiry, existing layout/metadata/prerender reuse, automated copy/API/browser checks. No change to existing UK commercial offers, checkout, home hero or platform source data. Founder screenshot and copy review required before merge or deployment.

[Vercel's Git documentation](https://vercel.com/docs/git) states that branch pushes normally trigger automatic deployments. This mission's stronger no-deploy/no-publication instruction is the reason the branch and review package remain local. No Vercel project settings were changed.

Before any later public release:

1. Obtain Founder visual and copy approval for the exact branch commit.
2. Authorise the GitHub push/PR and any preview separately, or verify deployment suppression first.
3. Confirm existing sender/recipient configuration and send one explicitly authorised test; verify receipt and normalised URL in the internal notification.
4. Confirm endpoint abuse protection, real device/email-browser behavior and live WAF/CDN crawler access.
5. Re-run the checks against the approved commit. Agree rollback and release authorisation before merge/deploy.
6. Submit indexing only if separately approved.

Founder action: review screenshots and copy; approve or request changes before merge/deploy.
