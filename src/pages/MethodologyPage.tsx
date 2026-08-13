import { PageIntro } from '../components/sections/PageIntro';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { fiveGates, readinessStatuses } from '../content/methodology';
import { breadcrumbSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function MethodologyPage() {
  useSeo({ title: 'Five Gates AI Readiness Methodology | LionTech Innovations', description: 'Discover, Describe, Trust, Compare and Act: a human-reviewed framework for practical AI Business Readiness.', path: '/methodology', schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Methodology', path: '/methodology' }]) });
  return <><PageIntro eyebrow="THE FIVE GATES METHOD" title="A clear way to inspect AI readiness." description="LionTech observes how AI systems find, explain, support, compare and act on public business information."><PrimaryCta /></PageIntro><section className="lt-section"><div className="lt-shell lt-method-detail">{fiveGates.map((gate) => <article key={gate.name}><h2>{gate.name}</h2><p>{gate.question}</p></article>)}</div></section><section className="lt-section lt-status-section"><div className="lt-shell"><h2>A profile, not a public score.</h2><p>The founding Snapshot uses four plain-language statuses. A public 0-100 benchmark remains blocked pending Customer Zero and further validation.</p><div className="lt-statuses">{readinessStatuses.map((status) => <span key={status}>{status}</span>)}</div></div></section></>;
}
