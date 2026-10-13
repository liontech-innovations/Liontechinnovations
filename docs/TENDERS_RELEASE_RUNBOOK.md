# PR #17: Controlled Tender Release

Current status: enquiry-only first-cohort launch preparation, in a protected preview. The founder has directed enquiry-only acquisition, with VAT administration and Stripe integration deferred; this is not yet approval of the six pages or a merge instruction. No page-specific publication decision has been recorded. Main, production, the existing offers and Stripe flows must remain unchanged until explicit page/release approval.

## Preview Inventory

Only the following six pages are exposed in the protected preview:

1. `/tenders`
2. `/tenders/cleaning-tender-support`
3. `/tenders/facilities-management-tender-support`
4. `/tenders/construction-tender-support`
5. `/tenders/bid-no-bid-checklist`
6. `/tenders/tender-compliance-matrix-template`

Ten downloadable files accompany the five resources. The other 20 records remain draft; their URLs and 40 downloads return 404 and have no directory/sibling links. No tender URL is currently in a production sitemap.

The existing eight-item header is preserved. Tender Support is discoverable from the UK Solutions footer and the Services page. Services remains the active header item on tender routes; mobile disclosure and History API navigation remain unchanged. These links are hidden from production until the hub is actually released.

## Required Founder Decisions

- Complete the six separate publication decisions in `docs/TENDERS_COHORT1_EDITORIAL.md`. An AI source/QA recommendation is not founder approval.
- Approve the enquiry-only public scope: Request Tender Support opens the form; no advertised fees, tax wording, deposits, fixed delivery packages or checkout. VAT/Stripe decisions are deferred, not blockers for this launch. `docs/TENDERS_COMMERCIAL_SIGNOFF.md` retains future commercial decisions without activating them.
- Explicitly authorise the exact six paths, discovery links and an enquiry-only release. Live checkout remains a separate hold and requires its own approval and verified implementation.
- Agree confidential onboarding and permitted AI/retention before requesting private tender packs. The public form must continue to collect only an initial non-sensitive enquiry.

## Reproducible Pre-Release Checks

Run in the authenticated WEBSITE checkout, using its existing lockfile. Do not bind a server to port 3000 or touch another repository.

```powershell
git status --short --branch
git remote -v
gh api user --jq .login
npm.cmd ci
npm.cmd run lint
$env:VERCEL_ENV='production'
$env:VITE_TENDERS_PREVIEW='true'
npm.cmd run build
Remove-Item Env:VERCEL_ENV
Remove-Item Env:VITE_TENDERS_PREVIEW
node scripts/check-dev-request.mjs
node scripts/check-dev-request-browser.mjs
npm.cmd run test:public-privacy
npm.cmd run test:zimbabwe-copy
npm.cmd run test:zimbabwe-enquiry
npm.cmd run test:zimbabwe-browser
npm.cmd run test:email-signature
npm.cmd run test:og-card
npm.cmd run test:locked-report-assets
node scripts/check-snapshot-url-normalisation.mjs
node scripts/check-ai-crawlers.mjs
node scripts/check-programmatic-routes.mjs
npm.cmd run seo:indexnow:dry-run
npm.cmd audit --audit-level=high
$env:VITE_TENDERS_PREVIEW='true'
npm.cmd run build
npm.cmd run test:tenders
Remove-Item Env:VITE_TENDERS_PREVIEW
```

Before approval the production build must emit 143 existing routes, zero tender pages/downloads and no Tender Support discovery links. The preview must emit 149 routes (143 + 6), ten downloads, five directory resources, 20 unavailable resource paths and no draft sitemap entries. The CI workflow runs both production-isolation and preview checks; do not remove or bypass gates.

## Authorised Publication Change: Do Not Execute Yet

In a subsequent owner-authorised commit, edit only `src/content/tenders/release.ts` and any expressly requested editorial correction:

- Set `tenderReleaseEnabled` to true and `tenderProductionCohorts` to `[1]` only after the founder's release authorisation.
- Record the hub plus exactly T01/T02/T03/T09/T18 in `tenderHubReview`/`tenderReviews`, with `reviewStatus: 'approved'`, the real human reviewer and actual review date. Publication eligibility also requires `publishStatus: 'published'` and the actual authorised release date in `publishedAt`; these declarative records are not evidence that deployment has succeeded.
- Do not pre-fill an invented reviewer, future date or approval for the other 20. Keep their review/publication records draft/null and production cohort membership absent.
- Keep proposed pricing configuration unchanged and unused by the public page. Do not add fee/tax/deposit copy, activate `liveActivation`, configure Stripe IDs or change existing checkout handlers as part of this enquiry-only release. Do not wait for VAT administration or a Stripe build before publishing the explicitly approved enquiry pages.

Run the production build and all gates again on that authorised change. Expected tender output is exactly the six approved paths and ten files; all other tender pages/downloads remain absent. The core sitemap must add precisely those six canonical URLs with truthful substantive update dates, retaining every existing entry. Check that the footer/Services link appears and all sibling/enquiry links resolve.

The enquiry API opens from the same approved hub gate, independently of the closed checkout guard. Production tests read the actual release records: before approval they assert 503 with no provider call; after authorisation they verify a mocked successful send for the hub and approved Cohort 1 sources, rejecting the other 20 sources. No test writes or invents an approval record. Verify the email includes opportunity details/public link, company, deadline and timezone, support needed and source, addressed to `admin@liontechinnovations.co.uk` with the visitor as reply-to. No uploads or private document request is added.

Review the diff and staged secret scan; stage only the authorised files. Push the existing feature branch normally and wait for GitHub checks, a protected preview and founder PR review. Do not force-push or bypass required branch rules. Merge PR #17 normally into main only when the founder explicitly authorises it and required reviews/checks are satisfied. Let the existing GitHub-to-Vercel integration deploy; do not create/promote a replacement project or run a manual production deployment.

## Production Verification After an Authorised Merge

- Confirm Vercel READY for the actual merged main SHA and existing project/domain, not merely a successful push.
- GET the custom-domain hub/five pages: correct substantive initial HTML, title, description, canonical, structured data and released robots policy.
- Check all ten downloads, image bytes/captions, sibling links and real 404s for the 20 unreleased resources/downloads.
- Verify discovery from home/footer/Services, mobile menu, keyboard, 375/768/1440px and zoom/reflow without clipping or reloads.
- Smoke-test `/`, `/about`, `/contact`, `/dev-fix`, Snapshot, legal and existing product paths without purchases or unrelated enquiries.
- Verify the tender form using the existing labelled preview delivery evidence and mock regression tests. A further real production email test requires explicit authorisation; do not send duplicate QA messages. An HTTP 200 alone is not inbox-delivery evidence.
- Confirm approved sitemap entries only. Do not submit to indexing services until separately authorised.

Report LIVE only after production HTTP/UI evidence. If deployment fails, do not claim the declarative publication records are live: use a normal reviewed revert to restore the release gate/cohort/review records and report the failure. No forced history rewrite or automatic payment alteration.
