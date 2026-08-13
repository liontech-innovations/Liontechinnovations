import { Check } from 'lucide-react';
import { PageIntro } from '../components/sections/PageIntro';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { fixSprintOffer } from '../content/offers';
import { breadcrumbSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function ReadinessFixSprintPage() {
  useSeo({ title: 'Readiness Fix Sprint | LionTech Innovations', description: 'Implement up to five agreed AI readiness fixes within a defined 10-business-day delivery cap.', path: '/readiness-fix-sprint', schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: fixSprintOffer.name, path: '/readiness-fix-sprint' }]) });
  const scope = ['Website and metadata corrections', 'Company source-of-truth improvements', 'Structured data implementation', 'Trust and evidence sections', 'Quote, booking or enquiry path improvements'];
  return <><PageIntro eyebrow="READINESS FIX SPRINT" title="Turn priority gaps into approved changes." description={`${fixSprintOffer.scope} ${fixSprintOffer.duration}.`}><div className="lt-page-actions"><PrimaryCta label="Request a Snapshot First" /><span>{fixSprintOffer.price}</span></div></PageIntro><section className="lt-section"><div className="lt-shell lt-detail-split"><div><h2>Focused delivery</h2><ul className="lt-check-list">{scope.map((item) => <li key={item}><Check aria-hidden="true" size={17} />{item}</li>)}</ul></div><div className="lt-detail-note"><h2>Commercial boundary</h2><p>One structured revision round is included. Work outside the agreed delivery cap is quoted separately.</p><p>{fixSprintOffer.credit}</p><p>Day 10 verifies the changes. Day 28-30 reruns the sampled tests and reports observed movement without claiming control of third-party AI outputs.</p></div></div></section></>;
}
