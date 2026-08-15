# AI-First Authority Engine Release Control

Status: Founder-authorised release candidate. Merge and production deployment remain conditional on the fixed PR head passing every listed gate.

## Founder release authorisation

Founder authorised publication of the current authority-engine content on 15 August 2026. Route-level editorial review remains an ongoing quality-improvement process and must not be misrepresented as completed.

The content-review manifest remains truthful: all 100 guide routes are still recorded as pending route-level editorial review. That ongoing review status is not represented as completed and is not a blocker to this Founder-authorised controlled publication.

## Current inventory

- 20 industry records.
- Five page types per industry: industry hub, AI visibility, provider comparison, agent readiness and readiness checklist.
- 100 programmatic guide routes plus the `/industries` directory.
- 24 JSON endpoints under `/ai-data/`: one entity index, one source manifest, one content-review manifest, one release-cohort manifest and 20 industry records.
- Five page-type sitemap cohorts with 20 guide URLs each.
- One core sitemap with 18 public URLs and a sitemap index referencing all six sitemap files.
- 118 unique public sitemap URLs in total.
- 115 prerendered routes: nine core marketing routes, four protected legacy direct-load routes, the Industries directory, 100 programmatic guides and the non-indexed signature utility.

The internal `/email/signature-install` utility is prerendered and directly served, but it is marked `noindex,follow` and is intentionally absent from navigation and every public sitemap.

## Page-type release cohorts

1. Industry hubs: 20 routes.
2. AI visibility guides: 20 routes.
3. Provider comparison guides: 20 routes.
4. Agent readiness guides: 20 routes.
5. Readiness checklists: 20 routes.

The deterministic sitemap files and `/ai-data/release-cohorts.json` use these same page-type groups. Route-level quality improvement continues after release without silently changing cohort membership or claiming review that has not occurred.

## Privacy and commercial controls

- Public company facts are limited to the legal name, company number, Companies House link, Manchester/UK remote position and approved public contact details.
- Residential, registered-office, street, postcode and `PostalAddress` data are prohibited from source, generated output and build output.
- The email signature contains no postal address.
- The Snapshot route remains the approved form-first qualification funnel.
- No public Snapshot Stripe payment link is introduced by this release.
- `scripts/check-public-company-privacy.mjs` is a hard merge gate.

## Signature utility control

- Approved source asset: `public/brand/liontech-email-signature-20260815.png`.
- Locked dimensions: 2048×682.
- Locked SHA-256: `6752069bb140b2663de872be177459492df040c05e7db796686186da8e36e659`.
- Production asset URL: `https://liontechinnovations.co.uk/brand/liontech-email-signature-20260815.png`.
- Installer: `https://liontechinnovations.co.uk/email/signature-install`.
- The copied HTML uses a direct banner anchor to `https://liontechinnovations.co.uk/contact#snapshot-enquiry` and a 600px responsive image.
- The preferred clipboard path writes both `text/html` and `text/plain`; the controlled fallback writes plain text.
- `npm run test:email-signature` validates the asset, URLs, HTML, installer, noindex rule and both clipboard paths.
- Gmail account settings are not changed by repository code or release automation.

## Required release gates

Run from the exact PR head:

```text
npm ci
npm run lint
npm run build
npm run test:public-privacy
npm run test:email-signature
npm run test:programmatic-content
npm run test:programmatic-routes
npm run test:ai-crawlers
npm run test:browser-console
npm run test:snapshot-url
npm run seo:indexnow:dry-run
npm audit --audit-level=high
```

CI installs Chromium, builds the prerendered site, runs privacy and signature gates, validates crawler and programmatic routes, performs an IndexNow dry run and fails on High or Critical dependency vulnerabilities.

Before any push or merge, inspect status, diff and staged files; scan the release diff for credentials, preview URLs, private-location data and public Stripe links. The tested PR head must remain fixed through approval and merge.

## Preview and production verification

The fresh PR preview must cover the homepage, Industries directory, representative industry routes, core offer/methodology/contact routes, the signature installer and the approved static PNG. The installer must demonstrate formatted clipboard copy, plain-text fallback, direct banner click behaviour and no raw HTML exposure.

After the normal PR merge, wait for the Git-linked Vercel production deployment to reach `READY`. Verify the same routes and machine-readable files on `https://liontechinnovations.co.uk`, confirm the production PNG hash, and inspect browser and Vercel logs for new hydration, page, console or 5xx errors.

## IndexNow control

`npm run seo:indexnow:dry-run` validates the current inventory without submitting it. IndexNow submission remains a separate, explicit post-production action after smoke-test success; it is not part of this merge or deployment.

## Rollback

If the release creates route, hydration, canonical, schema, crawler, signature, privacy or conversion failures, restore the previous known-good Vercel production deployment and revert the merge commit on `main`. Do not delete history, force-push or patch production manually.
