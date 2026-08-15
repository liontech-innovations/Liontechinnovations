# AI-First 100-Page Release Control

Status: preview only; production deployment and merge require FREEJOY approval.

## Inventory

- 20 reviewed industry records.
- Five page types per industry: hub, AI visibility, comparison, agent readiness and checklist.
- 100 programmatic routes plus `/industries`.
- 21 JSON endpoints under `/ai-data/`.
- Five deterministic industry sitemaps with 20 URLs each, plus the core sitemap and sitemap index.

The build prerenders 114 routes in total: the existing 13-route prerender set plus 101 additions.

## Release gates

Run from the repository root:

```text
npm run lint
npm run build
npm run test:programmatic-content
npm run test:programmatic-routes
npm run test:ai-crawlers
npm run test:browser-console
npm run test:snapshot-url
npm run seo:indexnow:dry-run
npm audit --audit-level=high
```

Before any push, inspect status, diff and staged files; scan staged content for secrets and preview URLs. The IndexNow submit command is never part of a build and must not run from preview.

## Controlled cohorts after approval

1. Health and care: 20 URLs selected from the health/care inventory.
2. Professional and financial services: 20 URLs.
3. Business services: 20 URLs.
4. Local/home services A: 20 URLs.
5. Local/home services B and remaining pages: 20 URLs.

The deterministic sitemap files are technical groups of 20. The release owner should record the approved cohort URLs before production IndexNow submission. Monitor crawl, indexing, quality and conversion after each cohort; do not create `noindex` placeholders for weak pages.

## Rollback

If a release creates route, hydration, canonical, schema, crawler or conversion failures, roll back the active Vercel production deployment to the previous known-good deployment and revert the merge commit on `main`. Do not delete source history or force-push.

## Production actions not performed in this PR

- No production deployment.
- No merge to `main`.
- No IndexNow submission.
- No Search Console or Bing sitemap submission.
- No analytics vendor installation.
