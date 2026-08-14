# Website Architecture

## Baseline

- Canonical repository: `https://github.com/liontech-innovations/Liontechinnovations.git`
- Starting commit: `6585ce8be2523f3982e8e37eaa0a1b0580db1eff`
- Feature branch: `feat/ai-business-readiness-v1`
- Framework: Vite 6, React 19, TypeScript, Tailwind CSS 4, Motion, Lucide
- Deployment target: Vercel with serverless Edge API handlers and SPA fallback

The pre-change application placed all routes and almost all pages in a 2,183-line `src/App.tsx`. The committed `package-lock.json` was out of sync with `package.json`; `npm ci` failed. After repairing the lockfile, TypeScript passed. The local build was additionally affected by an ancestor PostCSS configuration, so a repository-local PostCSS boundary was added.

## Route model

The project retains its lightweight History API router to avoid adding a routing dependency and to preserve Vercel's existing SPA fallback and static CareOps rewrites.

`src/App.tsx` now delegates to `src/routes/AppRoutes.tsx`.

New marketing routes use the shared LionTech marketing layout:

- `/`
- `/ai-visibility-snapshot`
- `/ai-business-readiness`
- `/readiness-fix-sprint`
- `/monitoring`
- `/company-brain`
- `/methodology`
- `/about`
- `/contact`

Preserved legacy React routes are delegated unchanged to `src/legacy/LegacySite.tsx`:

- `/uk-ai-infrastructure`
- `/saas-platform-development`
- `/ai-intake-systems`
- `/lead-recovery`
- `/roofing-brief`
- `/careops/lost-enquiry-recovery`
- `/careops/command-centre`
- `/privacy-policy`
- `/terms-and-conditions`

Preserved static routes:

- `/careops/free-check`
- `/careops/free-check/thanks.html`

## API inventory

Preserved handlers:

- `/api/intake`
- `/api/intake-submit`
- `/api/create-managed-checkout`
- `/api/create-oneoff-checkout`
- `/api/get-checkout-session`
- `/api/submit-roofing-brief`

New handler:

- `/api/snapshot-enquiry`: validates the short Snapshot request, rejects a honeypot submission, sends through the server-side Resend key and never exposes secrets to the browser.

## Content and facts

- `src/content/company.ts`: legal and public company facts
- `src/content/offers.ts`: price, scope, guarantee and delivery boundaries
- `src/content/methodology.ts`: Five Gates and approved statuses
- `src/content/homepage.ts`: locked homepage copy and finding types
- `src/content/platforms.ts`: owned product portfolio
- `src/content/navigation.ts`: public navigation
- `src/content/faq.ts`: visible FAQ content used by the Snapshot schema

## Security boundary

Private provider keys stay in Vercel serverless handlers. `vite.config.ts` no longer injects `GEMINI_API_KEY` into client bundles. Frontend configuration is limited to the intentionally public `VITE_AI_SNAPSHOT_CTA_URL`.

## Prerendering decision

This branch does not add a prerender dependency. The project currently relies on the Vercel SPA fallback, and adding a browser-driven prerender stage would expand the build surface while legacy payment and CareOps routes are still coupled to the client router. Static prerendering for the nine marketing routes is the highest-priority post-preview SEO engineering item if the preview build and route regression remain stable.

## Verification status

- TypeScript: pass
- Production build: pass
- Dependency audit: zero known vulnerabilities
- Snapshot enquiry handler: method, malformed body, validation, honeypot and missing-provider-key branches pass
- React route smoke test: 18 of 18 pass with no browser console errors
- Static route and asset HTTP checks: 26 of 26 pass
- Accessibility structure: nine of nine marketing routes pass
- Responsive viewport matrix: eight of eight pass without horizontal overflow
- Vercel preview deployment: READY and protected by Vercel Authentication; no production promotion performed
