# Can AI search understand your business? A practical website audit

Freejoy Chimbizi, Founder, Lion Tech Innovations Ltd

Published and reviewed: 12 November 2026

A reproducible audit of crawl access, company identity and source evidence, using our own website rather than unsupported visibility claims.

Publication update, 12 November 2026: this release adds our verified Companies House and LinkedIn company links to the organisation markup. The downloadable audit preserves the pre-change observations.

Before we commission another article or business listing, we need to answer a simpler question: can a person or search system establish who we are, what we do and where the evidence is? We applied that question to our own website. The useful result was not a visibility score. It was a short list of things we could verify and one specific identity improvement.

## Start with three different questions

Can a crawler access a page? Has a search engine indexed it? Does an answer actually use it? These are separate questions. A successful HTTP response answers only part of the first. It cannot establish that Google has indexed the page or that an AI assistant will recommend the business.

Google’s URL Inspection report distinguishes the indexed version of a page from a live test of whether the current page might be indexable. We use the indexed result to investigate inclusion and the live test to investigate access. Neither is a promise of future traffic. [1]


## What we checked on our own website

On 12 November 2026, we inspected the publicly returned HTML at liontechinnovations.co.uk, its robots.txt file and its sitemap index. This was a small, dated technical sample, not a full crawl or a comparison of AI platforms. The checks can be repeated without access to our customer systems.

The homepage returned HTTP 200. Its HTML contained an index,follow robots directive and a canonical URL pointing to the HTTPS homepage. The robots file allowed Googlebot, Bingbot and OAI-SearchBot to access public content while excluding the /api/ and /admin/ paths. The sitemap index referenced seven sitemap files.

The HTML also included an Organization object with our legal name, website, logo, public contact email and Companies House identifier. Its stable identifier was https://liontechinnovations.co.uk/#organization. What it did not include was a sameAs field linking the business to its external identity pages.


## Treat crawler access as a prerequisite, not an achievement

OpenAI’s crawler documentation identifies OAI-SearchBot as the crawler used for search discovery. Allowing it is a sensible access check, but a robots rule cannot prove that a request has reached the origin. Hosting protections and firewall rules can still affect access. [2]

Our practical approach is to record the response status, relevant headers and actual HTML before changing settings. We then inspect server-side access controls separately where we have permission. Changing a robots file is not a substitute for establishing what the server returned.

Google also says that its AI search features do not require a special AI-specific optimisation method. We therefore prioritise understandable, useful pages and ordinary search fundamentals rather than treating an extra file or a new label as a shortcut. [3]


## Connect the organisation, not every page mentioning it

Google describes Organization structured data as a way to help it understand and distinguish a business. The sameAs property can point to pages that unambiguously identify that organisation. It should not become a collection of vaguely related backlinks. [4]

For our implementation, the relevant candidates are our confirmed LinkedIn company profile and official Companies House record. A founder’s personal profile is a different entity. A similarly named company, a draft directory profile or an article that merely mentions us should not be inserted as though it were an equivalent identity.

We keep the legal name, website and company number consistent. We do not add an invented office, client count, award or VAT identifier to make the object look more complete. Structured information should describe the business as it is, not as we hope it will become.


## Publish evidence a reader can inspect

A useful technical article should show its working. For this audit, the evidence is the returned HTML and crawler files, together with the date and the limits of the sample. For a payment-flow article, it might be a small test programme, documented scenarios and the resulting assertions. Neither needs an invented success story.

We separate three forms of publication. Our website is our primary source. A company directory profile is a self-maintained business reference. An independently commissioned feature or editorial citation involves another publisher’s judgement. Republishing our own thread through a service does not turn it into independent coverage.

The commercial value comes from answering a real question clearly enough that another person can use the answer. We would rather document one reproducible check than publish ten articles which repeat the same unsupported claims.


## Make the next check measurable

Our audit sheet records the URL, the time checked, the observation, the proposed change and the result after release. Search Console provides a separate indexing record. Referral analytics provide a separate traffic record. Actual enquiries provide a separate commercial record.

For AI-answer testing, we would also retain the exact question, product, date, answer and cited URL. Repeating a sample helps reveal variation; it does not justify a universal ranking claim. Google indexing and an OpenAI crawler allowance are not evidence that a specific answer will cite us.

The immediate improvement from this audit is modest and testable: connect verified identity pages, preserve existing crawl access, and make original evidence easy to reach. Whether that leads to additional relevant references must be measured after publication, not promised before it.


## Sources

1. [Google Search Console: URL Inspection tool](https://support.google.com/webmasters/answer/9012289?hl=en)
2. [OpenAI: Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots)
3. [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
4. [Google Search Central: Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)

## Evidence

- [Public audit observations (JSON)](https://liontechinnovations.co.uk/research/evidence/public-site-audit-2026-11-12.json)
