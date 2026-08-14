# Customer Zero Findings

## Verdict

**PASS WITH CONDITIONS**

The AI Visibility Snapshot is sellable at the £395 founding price once the release-readiness fixes are verified. Approximate fulfilment time for the Customer Zero run was two hours.

## Release blockers identified

- Location and source-of-truth inconsistency between the public site and the registered company record.
- JavaScript-only visibility risk for crawlers and other clients that do not execute the React application.
- Minimum trust infrastructure, including visible legal entity and Companies House references.
- Final security and release review.

## Reusable validation assets

- 15-prompt buyer-intent test set.
- Raw HTML checks using curl, plus sitemap and JSON-LD validation.
- Companies House company-number and registered-office cross-check.

## Release patch requirements

- Use `Lion Tech Innovations Ltd`, company number `17068390`, and `liontechinnovations.co.uk` consistently.
- State that LionTech is Manchester-based and serves UK businesses remotely.
- Use the registered office exactly as recorded: `37 Hope Street North, Horwich, Bolton, Lancashire, BL6 7LL`.
- Pre-render the core marketing routes without changing the approved Vite/React visual implementation.
- Preserve the Snapshot form fields and `/contact#snapshot-enquiry` behaviour.
- Keep Google Business Profile and LinkedIn company-page creation as future Founder actions. Do not add links until those profiles exist and are approved.

## Production gate

Production remains blocked until this release-readiness patch passes raw HTML, metadata, JSON-LD, sitemap, robots, browser, contact-anchor, secret, and final security checks. PR #1 must remain open and unmerged until explicit Founder approval.
