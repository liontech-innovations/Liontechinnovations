# Route and API Inventory

Baseline commit: `6585ce8be2523f3982e8e37eaa0a1b0580db1eff`

## Pre-change public routes

React routes:

- `/`
- `/privacy-policy`
- `/terms-and-conditions`
- `/uk-ai-infrastructure`
- `/saas-platform-development`
- `/ai-intake-systems`
- `/lead-recovery`
- `/roofing-brief`
- `/careops/lost-enquiry-recovery`
- `/careops/command-centre`

Static routes:

- `/careops/free-check`
- `/careops/free-check/thanks.html`

## Pre-change API routes

- `/api/intake`
- `/api/intake-submit`
- `/api/create-managed-checkout`
- `/api/create-oneoff-checkout`
- `/api/get-checkout-session`
- `/api/submit-roofing-brief`

## Added marketing routes

- `/ai-visibility-snapshot`
- `/ai-business-readiness`
- `/readiness-fix-sprint`
- `/monitoring`
- `/company-brain`
- `/methodology`
- `/about`
- `/contact`

The `/` route was rebuilt in place. Every pre-change route and API remains registered. The new `/api/snapshot-enquiry` handler is additive and uses the existing serverless API model.

## Final verification

- All 18 React routes returned meaningful content, one expected H1 and no browser console errors.
- Both static CareOps routes returned HTTP 200.
- All seven API handler source files are present.
- The three approved hero media files and all crawl-control files returned HTTP 200 with the expected content type.
