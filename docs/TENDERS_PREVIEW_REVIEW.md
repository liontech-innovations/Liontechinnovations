# Tender Preview Review

This is an enquiry-only launch preparation, not a production release or page-specific editorial approval. Founder direction defers VAT administration and live Stripe; these are not prerequisites for the enquiry-only launch once the six pages are explicitly approved.

Current PR #17 review scope is the hub plus Cohort 1's five resources and ten downloads. The other 20 records remain draft and unavailable, with no directory/sibling links or download access. See `TENDERS_COHORT1_EDITORIAL.md`, `TENDERS_COMMERCIAL_SIGNOFF.md` and `TENDERS_RELEASE_RUNBOOK.md` for the actual QA decisions, outstanding founder decisions and controlled release instructions.

## Implemented

- `/tenders` hub and 25 distinct draft resources: eight sectors, nine guides and eight templates.
- Fifty CSV/Markdown worksheet definitions, field explanations and clearly fictional worked examples; only the first cohort's ten files are exposed now.
- Both supplied illustrations in approved responsive WebP variants, with explicit AI-illustration and independence captions.
- Initial HTML metadata, individual canonicals, appropriate structured data, related links and genuine unknown-route 404 handling.
- Validated tender enquiry using the existing email provider. No uploads, arbitrary-link fetching, runtime AI calls or private pipeline integration.
- Central proposed GBP fees and deposits retained for later, but no longer imported/rendered on the public hub. All Stripe product, price and payment-link values remain null. Public pages expose Request Tender Support, not unapproved prices or checkout.

## Release Controls

`src/content/tenders/release.ts` holds the closed release flag and actual review records. Nobody is recorded as having reviewed or approved a generated page. The planned editorial cohorts are 5, 10 and 10.

Vercel Preview builds expose only the selected cohort with `noindex,follow`. Production explicitly overrides the preview switch and omits unapproved HTML, downloads, internal discovery links and sitemap entries. Existing site rewrites and trailing-slash behaviour are preserved; unavailable tender pages/downloads use the scoped 404 fallback.

Do not merge to the production branch, activate checkout or submit a sitemap until the owner approves release. A preview deployment or passing automated test is not editorial or commercial approval.

## Reproducible Checks

Use the existing lockfile and dependencies. Local PowerShell examples:

```powershell
npm.cmd run lint
$env:VITE_TENDERS_PREVIEW='true'
npm.cmd run build
npm.cmd run test:tenders
```

Test production isolation separately, including an intentionally set preview flag:

```powershell
$env:VERCEL_ENV='production'
$env:VITE_TENDERS_PREVIEW='true'
npm.cmd run build
```

Remove only those test process variables before returning to a preview build. Browser checks use loopback port 5174, not port 3000. Review screenshots and reports belong in ignored `qa-artifacts/tenders/`, not public assets or Git.

Checks cover all 25 content records, the six exposed routes and ten downloads, hidden-cohort 404s, source attribution, unique metadata/main content, schema, sitemap exclusion, approved asset hashes, body contrast, mobile/tablet/desktop reflow, validation, error/retry behaviour and existing route smoke tests. The zoom check is equivalent 200% CSS-viewport reflow, not a full accessibility certification. Mocked email tests do not prove inbox receipt.

## Observed Preview Evidence

The initial all-draft preview built successfully with 26 tender routes; the release-readiness preview is now restricted to six. The production-isolation build emits none before approval. Source/build asset hashes match all eight approved WebP variants. The original PNGs remain unchanged outside the public deploy.

One clearly labelled enquiry was submitted through the protected preview form on 13 October 2026. Its success UI and actual receipt in the configured admin inbox were verified, including the originating resource path. No second test email or purchase was made. This is preview evidence, not production release approval.

Existing Dev Fix/Snapshot API and browser checks, locked report assets, email signature and social-card checks passed. About, existing company copy and payment flows are unchanged. The inherited Zimbabwe assertion has now been corrected against observed production behaviour and strengthened with exact UK/Zimbabwe destinations. The eight-item header is unchanged; controlled Tender Support discovery uses the existing Services/footer layout. No test gate was disabled.

## Approval and Payment Holds

- Review the content and cited claims individually. Source access dates are not review dates.
- For this launch, approve the six pages and enquiry-only scope; proposed price/VAT/deposit/terms decisions remain deferred until future pricing or checkout is expressly requested.
- Use an authorised Stripe sandbox/test account to implement and verify payment behaviour. Never infer test mode from a live connector.
- Match verified payment to accepted scope and deduplicate fulfilment with signed server-side handling. A success redirect is not proof of payment.
- Agree confidential onboarding, retention and AI-processing disclosures before requesting private tender packs.
- Confirm one labelled enquiry through actual provider delivery evidence or mailbox receipt. HTTP 200 only means the endpoint accepted the send.

Existing offers, Stripe links, company copy, `/about` and founder `/links` are unchanged. The only discovery changes are release-gated Services/footer links and the existing Services active state on tender routes; header layout and mobile disclosure are unchanged. No tender checkout or automated fulfilment has been enabled.
