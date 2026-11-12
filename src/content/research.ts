import { company } from './company';
import { breadcrumbSchema, organizationSchema } from '../lib/schema';
import type { SeoConfig } from '../lib/seo';

export type ResearchArticle = {
  slug: string; path: string; title: string; description: string; category: string;
  byline: string; publishedAt: string; reviewedAt: string; readingMinutes: number;
  intro: string; publicationNote: string;
  sections: Array<{heading: string; paragraphs: string[]; bullets?: string[]}>;
  sources: Array<{label: string; url: string}>;
  evidence: Array<{label: string; url: string}>;
  ctaLabel: string; ctaHref: string;
};
export const researchArticles: ResearchArticle[] = [
  {
    "slug": "ai-search-business-website-audit",
    "title": "Can AI search understand your business? A practical website audit",
    "description": "A reproducible audit of crawl access, company identity and source evidence, using our own website rather than unsupported visibility claims.",
    "category": "AI discoverability",
    "byline": "Freejoy Chimbizi, Founder, Lion Tech Innovations Ltd",
    "reviewedAt": "2026-11-12",
    "intro": "Before we commission another article or business listing, we need to answer a simpler question: can a person or search system establish who we are, what we do and where the evidence is? We applied that question to our own website. The useful result was not a visibility score. It was a short list of things we could verify and one specific identity improvement.",
    "sections": [
      {
        "heading": "Start with three different questions",
        "paragraphs": [
          "Can a crawler access a page? Has a search engine indexed it? Does an answer actually use it? These are separate questions. A successful HTTP response answers only part of the first. It cannot establish that Google has indexed the page or that an AI assistant will recommend the business.",
          "Google’s URL Inspection report distinguishes the indexed version of a page from a live test of whether the current page might be indexable. We use the indexed result to investigate inclusion and the live test to investigate access. Neither is a promise of future traffic. [1]"
        ]
      },
      {
        "heading": "What we checked on our own website",
        "paragraphs": [
          "On 12 November 2026, we inspected the publicly returned HTML at liontechinnovations.co.uk, its robots.txt file and its sitemap index. This was a small, dated technical sample, not a full crawl or a comparison of AI platforms. The checks can be repeated without access to our customer systems.",
          "The homepage returned HTTP 200. Its HTML contained an index,follow robots directive and a canonical URL pointing to the HTTPS homepage. The robots file allowed Googlebot, Bingbot and OAI-SearchBot to access public content while excluding the /api/ and /admin/ paths. The sitemap index referenced seven sitemap files.",
          "The HTML also included an Organization object with our legal name, website, logo, public contact email and Companies House identifier. Its stable identifier was https://liontechinnovations.co.uk/#organization. What it did not include was a sameAs field linking the business to its external identity pages."
        ]
      },
      {
        "heading": "Treat crawler access as a prerequisite, not an achievement",
        "paragraphs": [
          "OpenAI’s crawler documentation identifies OAI-SearchBot as the crawler used for search discovery. Allowing it is a sensible access check, but a robots rule cannot prove that a request has reached the origin. Hosting protections and firewall rules can still affect access. [2]",
          "Our practical approach is to record the response status, relevant headers and actual HTML before changing settings. We then inspect server-side access controls separately where we have permission. Changing a robots file is not a substitute for establishing what the server returned.",
          "Google also says that its AI search features do not require a special AI-specific optimisation method. We therefore prioritise understandable, useful pages and ordinary search fundamentals rather than treating an extra file or a new label as a shortcut. [3]"
        ]
      },
      {
        "heading": "Connect the organisation, not every page mentioning it",
        "paragraphs": [
          "Google describes Organization structured data as a way to help it understand and distinguish a business. The sameAs property can point to pages that unambiguously identify that organisation. It should not become a collection of vaguely related backlinks. [4]",
          "For our implementation, the relevant candidates are our confirmed LinkedIn company profile and official Companies House record. A founder’s personal profile is a different entity. A similarly named company, a draft directory profile or an article that merely mentions us should not be inserted as though it were an equivalent identity.",
          "We keep the legal name, website and company number consistent. We do not add an invented office, client count, award or VAT identifier to make the object look more complete. Structured information should describe the business as it is, not as we hope it will become."
        ]
      },
      {
        "heading": "Publish evidence a reader can inspect",
        "paragraphs": [
          "A useful technical article should show its working. For this audit, the evidence is the returned HTML and crawler files, together with the date and the limits of the sample. For a payment-flow article, it might be a small test programme, documented scenarios and the resulting assertions. Neither needs an invented success story.",
          "We separate three forms of publication. Our website is our primary source. A company directory profile is a self-maintained business reference. An independently commissioned feature or editorial citation involves another publisher’s judgement. Republishing our own thread through a service does not turn it into independent coverage.",
          "The commercial value comes from answering a real question clearly enough that another person can use the answer. We would rather document one reproducible check than publish ten articles which repeat the same unsupported claims."
        ]
      },
      {
        "heading": "Make the next check measurable",
        "paragraphs": [
          "Our audit sheet records the URL, the time checked, the observation, the proposed change and the result after release. Search Console provides a separate indexing record. Referral analytics provide a separate traffic record. Actual enquiries provide a separate commercial record.",
          "For AI-answer testing, we would also retain the exact question, product, date, answer and cited URL. Repeating a sample helps reveal variation; it does not justify a universal ranking claim. Google indexing and an OpenAI crawler allowance are not evidence that a specific answer will cite us.",
          "The immediate improvement from this audit is modest and testable: connect verified identity pages, preserve existing crawl access, and make original evidence easy to reach. Whether that leads to additional relevant references must be measured after publication, not promised before it."
        ]
      }
    ],
    "sources": [
      {
        "label": "Google Search Console: URL Inspection tool",
        "url": "https://support.google.com/webmasters/answer/9012289?hl=en"
      },
      {
        "label": "OpenAI: Overview of OpenAI Crawlers",
        "url": "https://developers.openai.com/api/docs/bots"
      },
      {
        "label": "Google Search Central: AI features and your website",
        "url": "https://developers.google.com/search/docs/appearance/ai-features"
      },
      {
        "label": "Google Search Central: Organization structured data",
        "url": "https://developers.google.com/search/docs/appearance/structured-data/organization"
      }
    ],
    "evidence": [
      {
        "label": "Public audit observations (JSON)",
        "url": "/research/evidence/public-site-audit-2026-11-12.json"
      }
    ],
    "ctaLabel": "Read our evidence standards",
    "ctaHref": "/methodology",
    "publicationNote": "Publication update, 12 November 2026: this release adds our verified Companies House and LinkedIn company links to the organisation markup. The downloadable audit preserves the pre-change observations.",
    "publishedAt": "2026-11-12",
    "path": "/research/ai-search-business-website-audit",
    "readingMinutes": 4
  },
  {
    "slug": "payment-fulfilment-eight-test-checklist",
    "title": "A successful checkout is not a fulfilled order: eight tests worth running",
    "description": "Eight reproducible local tests for duplicate events, delayed payment and transactional fulfilment, with clear limits and links to Stripe’s guidance.",
    "category": "Payment-flow reliability",
    "byline": "Freejoy Chimbizi, Founder, Lion Tech Innovations Ltd",
    "reviewedAt": "2026-11-12",
    "intro": "A customer can pay successfully while the application fails to grant access, record the order or start delivery. The payment screen is one part of the journey. We built a small, reproducible model to examine the hand-off between a server event and a fulfilment instruction. It uses synthetic records, not customer transactions.",
    "sections": [
      {
        "heading": "Do not make the customer’s browser the only trigger",
        "paragraphs": [
          "Stripe’s integration guidance recommends handling payment events on the server rather than relying only on a customer returning to a landing page. It also distinguishes completed Checkout sessions from delayed payment success and failure events. [1]",
          "For a business owner, the practical question is straightforward: what happens after payment if the browser closes? A confirmation page can explain the outcome to the customer, but the application still needs a reliable way to establish the payment state and perform the agreed next action."
        ]
      },
      {
        "heading": "Define the claim before writing the test",
        "paragraphs": [
          "Our experiment models a single purchase associated with one checkout session. It records three things in SQLite: processed event identifiers, the order state and an outbox instruction to grant access. The outbox is a durable record of intended work; it does not send an email or activate a real account.",
          "The core rule is that one paid session can produce no more than one fulfilment instruction. We use a unique key on the session and a database transaction covering the event record, state change and instruction. A failed transaction rolls all three back together.",
          "This is deliberately narrower than a production payment integration. It assumes that payment status has already been obtained from a trusted server-side source. It does not verify signatures, contact Stripe, charge a card or prove delivery by an external system."
        ]
      },
      {
        "heading": "The eight scenarios and observed results",
        "paragraphs": [
          "We ran the included Python test programme on 12 November 2026. All eight assertions passed in the local model. The output includes each scenario’s processed-event count, final order state and fulfilment-instruction count. These are results from this particular implementation, not industry performance statistics."
        ],
        "bullets": [
          "A paid server event with no browser return produced one fulfilment instruction.",
          "The same event delivered twice produced one processed-event record and one instruction.",
          "Two different paid events for the same session produced two event records but only one instruction.",
          "An unpaid completion followed by a paid confirmation produced no instruction before payment and one afterwards.",
          "An unpaid completion without a later payment produced no fulfilment instruction.",
          "A late failed event did not overwrite an already paid state or create another instruction.",
          "An injected failure before commit left no partial records; retrying produced one complete result.",
          "Eight concurrent deliveries for the same session produced eight event records and one instruction."
        ]
      },
      {
        "heading": "Why duplicate-event checks are not the whole design",
        "paragraphs": [
          "Stripe documents possible duplicate deliveries and does not guarantee event ordering. Its guidance also covers verifying webhook signatures and responding promptly to accepted deliveries. Those are production integration requirements, not features established by our simulation. [2]",
          "In our model, deduplicating only the event identifier would not protect the business action when two distinct events refer to the same purchase. That is why the third scenario checks the session-level rule separately. The seventh checks whether a crash can leave an event marked as handled without the intended work being recorded.",
          "The concurrent scenario adds another useful distinction. A sequential test can pass even when simultaneous workers would both create an instruction. Our test uses separate database connections and transaction serialisation. It demonstrates the behaviour of this local SQLite model, not the scaling characteristics of a hosted database."
        ]
      },
      {
        "heading": "One instruction is not the same as guaranteed delivery",
        "paragraphs": [
          "A worker can read an outbox instruction, call an email service and crash before recording success. Retrying that instruction may repeat the external action unless the receiving system or application also provides suitable idempotency. The unique outbox row is therefore not a claim of exactly-once delivery.",
          "Our paid-state rule is similarly limited. It prevents a stale failure from undoing payment in the model. It does not define refund, dispute, cancellation or subscription behaviour. Those need separate events, state transitions and tests. A later refund must not be silently ignored because a simplified model once marked the order paid.",
          "The right production design also needs reconciliation: an authorised process that compares payment-provider records with application orders and unresolved fulfilment work. Alerts should lead to a named owner and a recoverable action, not just accumulate in a log."
        ]
      },
      {
        "heading": "Use the model as a review aid, then test the real integration",
        "paragraphs": [
          "Stripe’s automated-testing guidance recognises simulated responses as a way to test application behaviour and error recovery. Our downloadable programme follows that limited approach and needs only Python’s standard library. It makes no network calls. [3]",
          "Before release, run the relevant scenarios against the actual integration in its test environment. Verify the real signature path, configured endpoints, trusted payment checks, database constraints, retry handling and delivery worker. Keep test and live credentials separate and avoid placing customer data in public evidence.",
          "For a business buying software, the useful acceptance question is not simply “does checkout work?” It is “can you show what happens when the same event arrives twice, payment is delayed, or the application fails halfway through?” A small evidence pack can make that conversation considerably more precise."
        ]
      }
    ],
    "sources": [
      {
        "label": "Stripe: Payments for existing customers, post-payment events",
        "url": "https://docs.stripe.com/payments/existing-customers?platform=web&ui=stripe-hosted"
      },
      {
        "label": "Stripe: Receive events in your webhook endpoint",
        "url": "https://docs.stripe.com/webhooks"
      },
      {
        "label": "Stripe: Automated testing",
        "url": "https://docs.stripe.com/automated-testing"
      }
    ],
    "evidence": [
      {
        "label": "Runnable Python simulation",
        "url": "/research/evidence/payment_flow_simulation.py"
      },
      {
        "label": "Recorded test results (JSON)",
        "url": "/research/evidence/payment_simulation_results.json"
      }
    ],
    "ctaLabel": "Discuss a payment-flow repair",
    "ctaHref": "/dev-fix",
    "publicationNote": "These results describe a local Python/SQLite simulation using synthetic records. They do not certify a live Stripe integration or establish exactly-once external delivery.",
    "publishedAt": "2026-11-12",
    "path": "/research/payment-fulfilment-eight-test-checklist",
    "readingMinutes": 4
  }
];
export const researchArticleByPath = new Map(researchArticles.map(article => [article.path, article]));
export const researchRoutes = ['/research', ...researchArticles.map(article => article.path)];
export const researchPublishedAt = '2026-11-12';
export const researchHubSeo: SeoConfig = {
  title: 'Research & Practical Guides | LionTech Innovations',
  description: 'Original technical research, reproducible tests and practical guides on AI discoverability and reliable business software from Lion Tech Innovations Ltd.',
  path: '/research',
  schema: [organizationSchema, {'@context':'https://schema.org','@type':'CollectionPage',
    '@id': `${company.website}/research#webpage`, url: `${company.website}/research`,
    name: 'LionTech Research & Practical Guides', publisher: {'@id': organizationSchema['@id']},
    mainEntity: {'@type':'ItemList', itemListElement: researchArticles.map((article,index) => ({
      '@type':'ListItem',position:index+1,name:article.title,url:company.website+article.path,
    }))}}, breadcrumbSchema([{name:'Home',path:'/'},{name:'Research',path:'/research'}])],
};
export function createResearchSeo(article: ResearchArticle): SeoConfig {
  return {
    title: `${article.title} | LionTech`, description: article.description, path: article.path, type: 'article',
    schema: [organizationSchema, {
      '@context':'https://schema.org','@type':'Article','@id':`${company.website}${article.path}#article`,
      headline:article.title,description:article.description,url:company.website+article.path,
      mainEntityOfPage:company.website+article.path,inLanguage:'en-GB',articleSection:article.category,
      datePublished:article.publishedAt,dateModified:article.reviewedAt,
      author:{'@type':'Person',name:'Freejoy Chimbizi',url:company.website+'/about',worksFor:{'@id':organizationSchema['@id']}},
      publisher:{'@id':organizationSchema['@id']},image:company.website+company.ogImage,
      citation:article.sources.map(source=>source.url),
    },breadcrumbSchema([{name:'Home',path:'/'},{name:'Research',path:'/research'},{name:article.title,path:article.path}])],
  };
}
export const researchSeo = {
  '/research': researchHubSeo,
  '/research/ai-search-business-website-audit': createResearchSeo(researchArticles[0]),
  '/research/payment-fulfilment-eight-test-checklist': createResearchSeo(researchArticles[1]),
} satisfies Record<string, SeoConfig>;
