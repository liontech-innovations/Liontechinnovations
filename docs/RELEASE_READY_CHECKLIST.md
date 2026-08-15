# LionTech Release-Ready Checklist

Status: **RELEASE CONTROL COMPLETE — AWAITING FINAL FREEJOY RELEASE APPROVAL**

Repository: `liontech-innovations/Liontechinnovations`

Branch: `feat/ai-business-readiness-v1`

Pull request: `#1`
Verified release-patch baseline: `9cd3ebde2b1cec0730086c243d2832791735c2c7`

The PR head must be re-read from GitHub immediately before merge and must match the SHA explicitly approved by FREEJOY. The generated protected-preview URL and final release-control SHA are recorded in PR #1 after the release-control commit is pushed.

## Release decision

- Founder visual approval: approved; the current visual implementation is locked.
- Customer Zero: **PASS WITH CONDITIONS**; the required source-of-truth, trust, metadata and prerendering patch is present.
- Security review: **PASS WITH DOCUMENTED LAUNCH CONDITIONS**; no release-blocking Critical or High finding was identified.
- Checkout/booking: approved as a form-first, manually qualified workflow. No blind Snapshot checkout is approved.
- Production: blocked until FREEJOY explicitly approves merge and production release.

## Security review record

### Completed controls

- [x] No API key, credential, token, private key, `.env` file or Vercel project state is tracked.
- [x] Tracked source, generated build output and the full PR diff were scanned for credential patterns with zero findings.
- [x] `.vercel/`, `dist/`, `.seo-cache/` and local `.env*` files are ignored; only the empty `.env.example` contract is tracked.
- [x] `npm audit --omit=dev` reports zero vulnerabilities.
- [x] Snapshot requests enforce POST, a 12 KB body cap, required fields, email and public HTTP(S) URL shape, explicit consent and a honeypot.
- [x] Snapshot and email content is HTML-escaped before rendering into transactional email.
- [x] Snapshot email is routed only to a server-configured LionTech recipient; the submitted address is reply-to only, so it is not an open relay.
- [x] Malformed or non-object JSON returns a controlled 400 response instead of an unhandled exception.
- [x] Public API error responses do not expose secret values or environment-variable names.
- [x] `/api/` remains disallowed in `robots.txt`.
- [x] Canonicals, sitemap and `llms.txt` use `https://liontechinnovations.co.uk`; no protected-preview URL is used as metadata.
- [x] Verify the legal entity through company number 17068390 and the Companies House link. Do not republish the registered-office address on LionTech-controlled surfaces.

### Residual launch conditions

**Medium — public endpoint abuse and provider-cost risk**

The public AI intake, email submission and legacy checkout-session endpoints do not have an application-level rate limiter. Repeated automated requests could create provider cost, inbox noise or unused Stripe sessions. No direct data-exfiltration path was identified from this condition.

Launch mitigation:

- retain OpenRouter, Resend and Stripe provider quotas/abuse controls;
- monitor Vercel function logs and Firewall activity during launch;
- manually review Snapshot enquiries before accepting work or sending payment;
- create a scoped post-launch rate-limit task before paid traffic is scaled.

**Low — legacy Stripe session lookup uses a bearer-style session ID**

The roofing brief uses the high-entropy Stripe Checkout Session ID returned in Stripe's success URL to prefill the buyer's own contact details. Do not log, share or reuse these URLs. A future hardening task should minimize the returned field set if the legacy workflow is retained.

**Informational — no strict Content Security Policy is introduced in this gate**

The repository contains approved legacy and CareOps inline content. A rushed blocking CSP could break those routes. Test a report-only CSP separately, then promote it only after route-specific validation.

## Checkout / booking decision

Approved Snapshot v1 funnel:

1. Buyer follows a Snapshot CTA to `/contact#snapshot-enquiry`.
2. Buyer submits the consented enquiry form.
3. Founder qualifies the business, evidence scope and delivery fit.
4. Founder sends a £395 Stripe Payment Link or manual invoice.
5. LionTech delivers the Snapshot.
6. A Fix Sprint is offered only where the evidence supports it.

Operational instruction outside the codebase:

> Create a Stripe Payment Link for £395 AI Visibility Snapshot and send manually after qualification.

- [x] No Snapshot Stripe secret, price ID or private payment link is stored in the repository.
- [x] `VITE_AI_SNAPSHOT_CTA_URL` is absent from the Vercel environment-name inventory, so the default CTA remains `/contact#snapshot-enquiry`.
- [x] Current Snapshot CTA wording requests a Snapshot; it does not promise instant purchase or automated acceptance.
- [x] The form contains the approved fields, required consent and a Privacy Policy link.
- [x] Existing roofing/CareOps payment routes are legacy product flows and are not the Snapshot launch funnel.

## Pre-merge gate

Hydration and browser-console regression gate:

```bash
npx playwright install chromium
npm run test:browser-console
```

This production-preview check must cover every core marketing route plus the legal and CareOps direct-load routes, and must finish with zero React hydration errors, browser console errors and page errors.

- [x] Expected starting head `9cd3ebde2b1cec0730086c243d2832791735c2c7` verified locally and on origin before review.
- [x] `npm run lint` passed.
- [x] `npm run build` passed and prerendered nine core marketing routes.
- [x] `npm audit --omit=dev` passed with zero vulnerabilities.
- [x] Local Vercel preview build passed.
- [x] API defensive-response tests passed without sending email, creating checkout sessions or calling the LLM provider.
- [x] Desktop browser route, image, canonical, console and form-anchor checks passed on the local release candidate.
- [x] Primary external links resolved successfully.
- [ ] Confirm the final pushed SHA and protected preview evidence recorded in PR #1.
- [ ] Obtain explicit final FREEJOY approval for that exact SHA.

## Merge and deploy

- [ ] Merge PR #1 to `main` only after FREEJOY explicitly approves the final SHA.
- [ ] Allow the linked Vercel project to deploy production from `main`.
- [ ] Do not manually deploy the feature branch or another branch to production.
- [ ] Confirm the new production deployment is Ready before starting smoke tests.

## Immediate post-deploy smoke test

- [ ] Homepage returns 200 and has visible content.
- [ ] Approved video hero loads; if video playback is unavailable, the supplied poster is visible.
- [ ] `/ai-business-readiness` returns 200 and renders the expected page.
- [ ] `/ai-visibility-snapshot` returns 200 and retains the approved £395/£495 facts.
- [ ] `/contact#snapshot-enquiry` lands with the form visible below the sticky header.
- [ ] Submit one explicitly approved test enquiry and confirm a controlled success response and receipt by the configured LionTech recipient.
- [ ] Confirm the form does not initiate payment and the Founder sends payment manually only after qualification.
- [ ] Confirm page source and metadata contain no London-based claim.
- [ ] Confirm production canonicals use `https://liontechinnovations.co.uk` only.
- [ ] Confirm `/sitemap.xml`, `/robots.txt` and `/llms.txt` return 200 and contain factual production URLs.
- [ ] Confirm the Companies House trust reference is visible and links to company `17068390`.
- [ ] Confirm `/careops/free-check`, `/careops/free-check/thanks`, `/careops/lost-enquiry-recovery` and `/careops/command-centre` work.
- [ ] Confirm `/privacy-policy` and `/terms-and-conditions` work with route-specific canonicals.
- [ ] Check browser console, broken images and Vercel function logs for new errors.

## Rollback

If a production-blocking regression is found:

1. Stop launch traffic and record the failing route, timestamp and deployment ID.
2. Revert the PR merge commit on `main` and allow Vercel to deploy the revert; or use Vercel to redeploy the previous known-good production deployment.
3. Verify the old homepage, legal routes, CareOps routes and machine-readable files after rollback.
4. Fix forward on the feature branch through a reviewed PR; do not patch production manually.

## Final production gate

`PRODUCTION DEPLOYED: NO`

`PR MERGED: NO`

`AWAITING FINAL FREEJOY RELEASE APPROVAL`
