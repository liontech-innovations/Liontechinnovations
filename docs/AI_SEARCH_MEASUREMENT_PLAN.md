# AI Search Measurement Plan

This plan measures eligibility and observed outcomes; it does not assume that programmatic pages will be indexed, cited or recommended.

## Baseline cadence

Run the controlled prompts in `AI_SEARCH_PROMPT_BASELINE.csv`:

- before production release;
- 14 days after release;
- 30 days after release;
- 60 days after release;
- 90 days after release;
- quarterly thereafter for retained pages.

Use a clean UK test location where the system permits it. Record the system/model label shown at test time, exact prompt, date, result wording, cited URL and notes. Preserve screenshots for material citations or inaccurate claims. Do not convert absence into a zero score.

## Search and referral evidence

- Google Search Console: weekly Page indexing and Performance checks for `/industries/`; export clicks, impressions, queries, pages and device where available.
- Google AI features: record only reporting actually exposed to the property; do not infer an AI-specific view from ordinary impressions.
- Bing Webmaster Tools: review sitemap processing, crawl errors, indexed pages and query performance.
- ChatGPT referrals: monitor `utm_source=chatgpt.com` only if a first-party analytics decision and implementation exists.
- Manual AI citations: capture response, cited URL, date, system and test location.
- Conversion: measure visits to `/contact#snapshot-enquiry`, form starts, valid submissions, qualified Snapshot opportunities and completed manual payment only through approved systems.

No analytics or tracking vendor is present in the repository. Adding one is a separate Founder privacy, consent and vendor decision; this PR does not add analytics.

## Weekly operating view

Track by URL and cohort:

`Discovered | Crawled | Indexed | Impressions | Clicks | Queries | AI citation evidence | Snapshot visits | Valid submissions | Corrections due`

Compare indexed pages with submitted sitemap URLs. Investigate canonical mismatch, crawl failures, source staleness and content overlap before requesting reindexing.

## Decision points

- After 14 days: confirm sitemap processing and early crawl coverage; fix technical errors only.
- After 30 days: review query fit and pages excluded for technical or canonical reasons.
- After 60–90 days: review pages with zero impressions. Strengthen evidence or consolidate pages only where the intended buyer need is not demonstrated.
- Never manufacture traffic by creating near-duplicate query variants.

## Success definitions

Technical success means valid initial HTML, correct canonical/entity data, accepted sitemaps, crawler access and working conversion paths. Commercial success requires observed qualified enquiries or revenue. AI-search success requires captured, attributable citations or referrals; it is not declared by page count.
