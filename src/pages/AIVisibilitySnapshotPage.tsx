import { Check } from 'lucide-react';
import { PageIntro } from '../components/sections/PageIntro';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { snapshotFaq } from '../content/faq';
import { fiveGates } from '../content/methodology';
import { snapshotOffer } from '../content/offers';
import { breadcrumbSchema, snapshotFaqSchema, snapshotServiceSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function AIVisibilitySnapshotPage() {
  useSeo({
    title: 'AI Visibility Snapshot | LionTech Innovations',
    description: 'See how leading AI systems describe, compare and surface your business, with evidence and a practical 30-day action plan.',
    path: '/ai-visibility-snapshot',
    schema: [snapshotServiceSchema, snapshotFaqSchema, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: snapshotOffer.name, path: '/ai-visibility-snapshot' }])],
  });

  return (
    <>
      <PageIntro eyebrow="AI VISIBILITY SNAPSHOT" title="See what AI says. Know what to fix." description={snapshotOffer.shortScope}>
        <div className="lt-page-actions"><PrimaryCta /><span>{snapshotOffer.foundingPrice} founding price. {snapshotOffer.turnaround}.</span></div>
      </PageIntro>
      <section className="lt-section"><div className="lt-shell lt-detail-split"><div><h2>What you receive</h2><ul className="lt-check-list">{snapshotOffer.inclusions.map((item) => <li key={item}><Check aria-hidden="true" size={17} />{item}</li>)}</ul></div><div className="lt-detail-note"><strong>{snapshotOffer.standardPrice}</strong><p>Standard price {snapshotOffer.standardPriceTiming}. The founding offer is {snapshotOffer.foundingPrice}.</p><p>{snapshotOffer.guarantee}</p></div></div></section>
      <section className="lt-section lt-method-section"><div className="lt-shell"><h2>Your Five Gates Readiness Profile</h2><ol className="lt-gates-flow">{fiveGates.map((gate) => <li key={gate.name}><span>{gate.name}</span><p>{gate.question}</p></li>)}</ol><p className="lt-section-lede">The public deliverable uses Strong, Workable, At Risk and Material Gap. It does not present an unqualified 0-100 score.</p></div></section>
      <section className="lt-section"><div className="lt-shell lt-faq"><h2>Snapshot questions</h2>{snapshotFaq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
    </>
  );
}
