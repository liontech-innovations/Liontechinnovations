export const tenderPricing = {
  version: 'proposal-1', status: 'proposed', currency: 'gbp', liveActivation: false, taxBasis: null,
  termsApproved: false, capacityApproved: false,
  offers: [
    { code: 'tender-fit-review', name: 'Tender Fit Review', fullFee: 14900, initialPayment: 14900,
      scope: 'One tender/lot. Initial fit, mandatory-requirement and evidence-gap triage. Up to 50 tender-pack pages. Concise findings and a 20-minute review. No bid drafting.',
      delivery: 'Proposed: within 2 working days after accepted scope, complete inputs and cleared payment. Capacity must be confirmed first.',
      action: 'Request a fit review', productId: null, priceId: null, paymentLink: null },
    { code: 'tender-sprint-standard', name: 'Standard Tender Sprint', fullFee: 245000, initialPayment: 122500,
      scope: 'One bidder, one opportunity/lot. Up to 6 scored narrative responses, 6,000 final words and 100 tender-pack pages. Requirements/evidence map, drafting, review and one consolidated revision round. You supply the technical solution, commercial pricing and proof.',
      delivery: 'Proposed: 5-10 working days from confirmed start and complete evidence. The specific deadline is agreed before any deposit.',
      action: 'Confirm scope and availability', productId: null, priceId: null, paymentLink: null },
    { code: 'tender-sprint-complex', name: 'Complex Tender Sprint', fullFee: 395000, initialPayment: 197500,
      scope: 'One bidder and one defined opportunity/lot. Up to 12 scored responses, 12,000 final words and 200 tender-pack pages. Coordinated evidence mapping, drafting, review and two consolidated revision rounds. Multi-lot or larger work is separately quoted.',
      delivery: 'Delivery date agreed after pack review. No automatic five-day delivery promise.',
      action: 'Request a scoped proposal', productId: null, priceId: null, paymentLink: null },
  ],
  exclusions: ['Award guarantees', 'Automatic portal submission', 'Legal, tax or engineering advice', 'Fabricated certificates or evidence', 'Invented customer commitments', 'Unlimited revisions', 'Access to internal tools'],
} as const;
export const formatTenderMoney = (minor: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(minor / 100);

export function tenderCheckoutAvailable() {
  // No checkout can be issued while commercial approval or returned Stripe IDs are missing.
  return tenderPricing.liveActivation && tenderPricing.taxBasis !== null && tenderPricing.termsApproved && tenderPricing.capacityApproved &&
    tenderPricing.offers.every(offer => offer.productId !== null && offer.priceId !== null && offer.paymentLink !== null);
}
