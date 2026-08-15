# AI-First Search Console Handoff

## After approved production release

1. Confirm `https://liontechinnovations.co.uk/sitemap.xml` returns the sitemap index with production URLs.
2. Submit the sitemap index in Google Search Console and Bing Webmaster Tools. Record submission date and processing result; do not state that submission equals indexing.
3. Inspect `/industries`, one URL from each approved cohort and any URL reported as excluded.
4. Confirm the inspected canonical matches the production URL and rendered HTML contains the direct answer, sources and Snapshot CTA.
5. Run `AI_CRAWLER_BASE_URL=https://liontechinnovations.co.uk npm run test:ai-crawlers` after release.
6. Run `npm run seo:indexnow:submit` only after production approval and only for the canonical URLs approved for that cohort. The current script holds the complete 118-public-URL inventory; use the release record to constrain a cohort before submitting.

## Weekly checks

- Page indexing: submitted, indexed, crawled-not-indexed, discovered-not-indexed, duplicate/canonical and soft-404 states.
- Performance: impressions, clicks, queries, country, device and landing page for `/industries/`.
- Enhancements: schema parsing and any breadcrumb issues actually reported.
- Crawl: sitemap fetch status, host availability and spikes in 4xx/5xx.
- Conversion: approved first-party evidence for Snapshot route visits and valid submissions, if measurement is available.

## URL inspection sample

- Directory.
- One hub per cohort.
- One page of each supporting type.
- Highest-impression and zero-impression pages.
- Any URL whose declared and selected canonical differ.

## 60–90 day review

Pages with zero impressions require a source and intent review. Confirm demand, uniqueness, internal links, crawl evidence and the usefulness of the page without its CTA. Strengthen, consolidate with a 301 redirect or retire only under the governance policy; do not multiply variants.

## Evidence record

Store: `URL | cohort | submitted date | inspection date | crawl/index state | selected canonical | impressions | clicks | query examples | conversion evidence | action | owner`.

No Search Console, Bing or analytics results were fabricated or accessed by this implementation.
