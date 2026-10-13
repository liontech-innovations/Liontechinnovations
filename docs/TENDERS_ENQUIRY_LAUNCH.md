# Tender Support: Enquiry-Only Launch Approval Request

## Decision Requested

Approve the six named pages and their ten worksheets, plus the existing Services/footer discovery links, for an **enquiry-only** production release through PR #17. Founder direction to prepare this offer is recorded; page-specific acceptance and permission to merge are still pending. No founder decision/date is filled in by the implementation agent.

## Exact Production Targets (Not a Claim of Publication)

1. https://liontechinnovations.co.uk/tenders
2. https://liontechinnovations.co.uk/tenders/cleaning-tender-support
3. https://liontechinnovations.co.uk/tenders/facilities-management-tender-support
4. https://liontechinnovations.co.uk/tenders/construction-tender-support
5. https://liontechinnovations.co.uk/tenders/bid-no-bid-checklist
6. https://liontechinnovations.co.uk/tenders/tender-compliance-matrix-template

The matching preview paths are on PR #17's protected, commit-specific Vercel deployment. Use the latest verified deployment URL in the PR review report, not an older preview with all 25 resources.

## Public Journey

Home footer / Services -> Tender Support -> **Request Tender Support** -> enquiry form. Resource CTAs retain the originating page in the form/email attribution. The secondary hub CTA explains the process rather than showing pricing.

The form requires company, deadline/timezone, support type and opportunity/support details, plus name/work email, sector and consent. A public opportunity URL is optional because a bidder can describe its opportunity without an available public link. No confidential uploads, portal credentials, arbitrary-link fetching or AI job is requested or triggered.

The existing endpoint delivers to `admin@liontechinnovations.co.uk`, with the visitor's address as reply-to. Invalid/missing inputs, hidden resource sources, unsafe links, abuse, provider failure and retries are covered by the enquiry tests. Provider acceptance is not conflated with inbox receipt. The earlier authorised QA message (Gmail ID `1a134510a662ba5f`, received 13 October 2026 at 09:11 BST) was re-read: recipient, opportunity URL, company, deadline/timezone, support and source fields were present. That is historical preview delivery evidence; no additional enquiry, purchase or production-delivery claim is made in this preparation pass.

Read-only Vercel environment inspection also confirms encrypted `RESEND_API_KEY` and `INTAKE_FROM_EMAIL` entries exist for both Preview and Production. Their values were not printed or altered. Environment presence is not a new inbox-delivery test.

## Non-Commercial Release Boundary

No proposed fee, tax treatment, deposit amount, offer-card scope limit or fixed package turnaround appears on the public hub. `pricing.ts` stays byte-for-byte unchanged for later decisions; checkout remains unavailable, with all tender Stripe IDs/links null. VAT administration and Stripe integration are deferred, not prerequisites for this enquiry-only release. Sending an enquiry is not a purchase or start of work.

Both approved illustrations/captions, responsive layouts, citations, company identity and existing branding remain. The other 20 resource pages and their 40 downloads remain draft/unavailable, outside directories, related links and sitemaps.

## Editorial Status

Six page-specific records are prepared as draft: hub plus the five Cohort 1 slugs, with reviewer/review/publication dates null. Use `TENDERS_COHORT1_EDITORIAL.md` to record each actual accept / changes required / reject decision. No known unresolved source/worksheet correction remains from the documented AI QA; this is not human approval or legal certification. Founder must accept factual boundaries, page usefulness, original worksheet accuracy, illustration disclaimers and enquiry-only scope.

## Release After Explicit Approval

Follow `TENDERS_RELEASE_RUNBOOK.md`. Record the founder's actual six decisions, enable production cohort `[1]` and the hub gate in a separate authorised change, run all checks and satisfy the existing protected review/merge workflow. The same hub gate opens the enquiry endpoint; pricing/Stripe activation is independent and stays false. Confirm the actual production deployment and six URLs before reporting LIVE. No manual Vercel production deployment, Mission Control change or indexing submission is authorised here.

## Verification Evidence and Known Warning

Local typecheck, both production-isolation/preview builds, SEO/prerender/privacy gates, 120 tender API scenarios, 111 Dev Fix API scenarios, 43 Zimbabwe enquiry scenarios, Dev Fix/Snapshot browsers, Zimbabwe's eight viewports, 101 programmatic routes, locked assets/signatures/social metadata and tender mobile/tablet/desktop checks pass. Mock tests send no email. Audit reports zero vulnerabilities; IndexNow is a dry run only, NOT_SUBMITTED. Both illustrations' eight variants match their approved hashes, ten worksheets match authored output, and the other 20 resources/40 downloads return 404 in the preview. The final automatic CI/deployment status and protected URL are recorded in PR #17 after pushing the reviewed commit, not inferred from these local checks.

The extra strict whole-site console sweep returns FAIL on six external Oxford/Accredible credential-widget errors on `/about` (CSP, permissions and provider authentication/resources). The same six errors were reproduced against current production. About source is unchanged; its dedicated five-width check reports zero first-party errors and records provider errors separately. This test was not edited or suppressed. It is an existing external-provider warning outside this tender change, not a new tender failure. The existing large-bundle build warning remains non-blocking.

Final founder response requested: accept / request changes / reject each of the six pages; if accepting all, explicitly authorise the enquiry-only production release with ten worksheets and Services/footer discovery. VAT and Stripe remain deferred.
