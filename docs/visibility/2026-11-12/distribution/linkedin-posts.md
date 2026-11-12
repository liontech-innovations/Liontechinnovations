# LinkedIn publication copy

Status: the articles are live and one combined company-page post linking both was published on 12 November 2026. See `../RELEASE-STATUS.md` for its verified URL. The component drafts below were not posted separately.

## Post 1: AI discoverability

Being accessible, being indexed and being cited are three different things.

We checked our own website before deciding what to publish next. The basics were already there: an accessible homepage, a canonical URL, a sitemap and Organisation structured data.

One useful gap was more specific. Our structured data did not connect our company identity to verified external profiles through sameAs.

That is a practical fix, not a promise that an AI assistant will suddenly recommend us.

The audit explains what we inspected, what the findings establish and what they do not. We are publishing the evidence because clear, repeatable checks are more useful than a mysterious visibility score.

Read the full audit:
https://liontechinnovations.co.uk/research/ai-search-business-website-audit

#AIVisibility #SmallBusiness #SoftwareDevelopment

## Post 2: Payment reliability

“Payment successful” is not the same as “order fulfilled”.

What happens when the customer closes the browser? When the same payment event arrives twice? When two workers process it simultaneously? When the application crashes before saving the fulfilment instruction?

We built a small local Python/SQLite model to make those questions testable. Eight scenarios passed, including duplicate events, delayed payment, retries and concurrent deliveries.

The important qualification: this is a reproducible local simulation, not a claim that we tested Stripe’s infrastructure or a customer’s live system. A real integration still needs its own security, delivery and reconciliation checks.

The article includes the runnable model, results and links to Stripe’s guidance.

Read the checklist:
https://liontechinnovations.co.uk/research/payment-fulfilment-eight-test-checklist

#SoftwareTesting #Payments #BusinessAutomation
