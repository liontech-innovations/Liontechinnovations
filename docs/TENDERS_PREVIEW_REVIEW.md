# Tender Preview Review

This is a review implementation, not a production release or commercial approval.

## Implemented

- `/tenders` hub and 25 distinct draft resources: eight sectors, nine guides and eight templates.
- Fifty ungated blank CSV/Markdown worksheets, field explanations and clearly fictional worked examples.
- Both supplied illustrations in approved responsive WebP variants, with explicit AI-illustration and independence captions.
- Initial HTML metadata, individual canonicals, appropriate structured data, related links and genuine unknown-route 404 handling.
- Validated tender enquiry using the existing email provider. No uploads, arbitrary-link fetching, runtime AI calls or private pipeline integration.
- Central proposed GBP fees and deposits. All Stripe product, price and payment-link values remain null.

## Release Controls

`src/content/tenders/release.ts` holds the closed release flag and actual review records. Nobody is recorded as having reviewed or approved a generated page. The planned editorial cohorts are 5, 10 and 10.

Vercel Preview builds expose the review pages with `noindex,follow`. Production explicitly overrides the preview switch and omits unapproved HTML, downloads and sitemap entries. Existing site rewrites and trailing-slash behaviour are preserved.

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

Checks cover all 25 resource routes, blank downloads, source attribution, unique metadata/main content, schema, sitemap exclusion, approved asset hashes, body contrast, mobile/tablet/desktop reflow, validation, error/retry behaviour and existing route smoke tests. The zoom check is equivalent 200% CSS-viewport reflow, not a full accessibility certification. Mocked email tests do not prove inbox receipt.

## Approval and Payment Holds

- Review the content and cited claims individually. Source access dates are not review dates.
- Approve proposed price, scope, capacity, tax basis and terms together before any live checkout.
- Use an authorised Stripe sandbox/test account to implement and verify payment behaviour. Never infer test mode from a live connector.
- Match verified payment to accepted scope and deduplicate fulfilment with signed server-side handling. A success redirect is not proof of payment.
- Agree confidential onboarding, retention and AI-processing disclosures before requesting private tender packs.
- Confirm one labelled enquiry through actual provider delivery evidence or mailbox receipt. HTTP 200 only means the endpoint accepted the send.

Existing offers, Stripe links, company copy, `/about`, founder `/links`, navigation and footer are outside this patch. No tender checkout or automated fulfilment has been enabled.
