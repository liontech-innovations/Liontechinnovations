import { PageIntro } from '../components/sections/PageIntro';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { monitoringOffer } from '../content/offers';
import { breadcrumbSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function MonitoringPage() {
  useSeo({ title: 'AI Visibility Monitoring | LionTech Innovations', description: 'Track agreed priority AI buyer questions, factual changes and competitor movement with a concise monthly report.', path: '/monitoring', schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: monitoringOffer.name, path: '/monitoring' }]) });
  return <><PageIntro eyebrow="AI VISIBILITY MONITORING" title="Keep the important facts visible and current." description={monitoringOffer.scope}><div className="lt-page-actions"><PrimaryCta label="Start with a Snapshot" /><span>{monitoringOffer.price}</span></div></PageIntro><section className="lt-section"><div className="lt-shell lt-continuity-grid"><article><h2>Stay accurate</h2><p>Rerun agreed priority questions, compare material outputs, and flag factual or competitor movement that deserves attention.</p></article><article><h2>Become actionable</h2><p>Where a documented commercial case exists, an Agent Action Sprint can improve quote, booking, enquiry, availability or information retrieval paths.</p><strong>£1,500-£3,500 per workflow</strong></article></div></section></>;
}
