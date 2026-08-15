# LionTech GEO / AI Search Readiness Analysis

Reviewed: 2026-08-15

Scope: feature-branch implementation, not production visibility

## Evidence-based verdict

The implementation establishes technical and editorial eligibility for AI-assisted retrieval: prerendered initial HTML, direct answers, visible authoritative sources, stable entity facts, production canonicals, machine-readable first-party records, internal links and explicit crawler policy. It does not establish that any AI system has indexed, cited or recommended LionTech.

## Platform controls

- OpenAI: `OAI-SearchBot` is explicitly allowed on public routes while `/api/` and `/admin/` remain blocked. Training-crawler policy was not changed. See https://developers.openai.com/api/docs/bots.
- Google: pages use people-first visible content, ordinary crawl/index controls and no invented AI schema. See https://developers.google.com/search/docs/fundamentals/ai-optimization-guide and https://developers.google.com/search/docs/essentials/spam-policies.
- Bing/IndexNow: a valid public key and explicit dry-run/submit workflow exist. Submission is not a build side effect and is not evidence of indexing. See https://www.indexnow.org/documentation.

## Citation readiness

Each programmatic route provides an 80–90-word answer block, industry facts, Five Gates buyer questions, two page-specific source observations, four visible source links, practical checks, FAQs, a reviewed date and a qualified action path. The structured JSON layer exposes the same entity and canonical Snapshot action without personal data.

## Remaining off-site dependency

Independent authority still requires consistent Google Business Profile and LinkedIn facts, legitimate industry/local citations, earned references and real case studies. These are Founder handoffs in `docs/AI_SEARCH_ENTITY_AUTHORITY_PLAN.md`; no external profiles were fabricated or modified.

## Measurement

The 45-prompt baseline is intentionally marked not run. Execute before release and at 14, 30, 60 and 90 days. Record actual citations, Search Console/Bing evidence and qualified Snapshot conversions. There is no analytics vendor in the current repository, so referral/conversion instrumentation remains a separate Founder decision.
