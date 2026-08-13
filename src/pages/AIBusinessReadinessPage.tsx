import { PageIntro } from '../components/sections/PageIntro';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { companyBrainOffer, fixSprintOffer, monitoringOffer, snapshotOffer } from '../content/offers';
import { breadcrumbSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function AIBusinessReadinessPage() {
  useSeo({
    title: 'AI Business Readiness Services | LionTech Innovations',
    description: 'A practical path from AI visibility evidence to priority fixes, monitoring, agent actions and a relationship-led Company Brain.',
    path: '/ai-business-readiness',
    schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'AI Business Readiness', path: '/ai-business-readiness' }]),
  });
  const ladder = [
    [snapshotOffer.name, snapshotOffer.foundingPrice, 'See the evidence and the priority gaps.', '/ai-visibility-snapshot'],
    [fixSprintOffer.name, fixSprintOffer.price, 'Implement up to five agreed priority fixes.', '/readiness-fix-sprint'],
    [monitoringOffer.name, monitoringOffer.price, 'Track agreed questions and material movement.', '/monitoring'],
    ['Agent Action Sprints', '£1,500-£3,500 per workflow', 'Improve a proven quote, booking, enquiry or information path.', '/monitoring'],
    [companyBrainOffer.name, companyBrainOffer.price, 'Bring persistent knowledge and approved workflows inside.', '/company-brain'],
  ];
  return <><PageIntro eyebrow="AI BUSINESS READINESS" title="See it. Fix it. Stay ready." description="LionTech starts with evidence, fixes material gaps, monitors change and adds agent actions only where the business case is clear."><PrimaryCta /></PageIntro><section className="lt-section"><div className="lt-shell lt-ladder">{ladder.map(([name, price, description, href]) => <article key={name}><div><h2>{name}</h2><p>{description}</p></div><strong>{price}</strong><RouteLink className="lt-text-link" href={href}>Explore</RouteLink></article>)}</div></section></>;
}
