import { PageIntro } from '../components/sections/PageIntro';
import { RouteLink } from '../components/ui/RouteLink';
import { companyBrainOffer } from '../content/offers';
import { breadcrumbSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function CompanyBrainPage() {
  useSeo({ title: 'Company Brain | LionTech Innovations', description: 'A relationship-led operating layer for persistent knowledge, SOPs, decisions, approved workflows and role-scoped access.', path: '/company-brain', schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: companyBrainOffer.name, path: '/company-brain' }]) });
  const capabilities = [['Persistent knowledge', 'A maintained source of truth for approved company information.'], ['SOPs and decisions', 'Operational memory that keeps context available across teams.'], ['Approved workflows', 'Repeatable actions with clear human ownership and boundaries.'], ['Role-scoped access', 'People and agents see only the context their work requires.'], ['Model-independent layer', 'The company retains its operating knowledge as models change.']];
  return <><PageIntro eyebrow="COMPANY BRAIN · PHASE 4" title="Bring AI inside when the business is ready." description={companyBrainOffer.scope}><RouteLink className="lt-button lt-button-primary" href="/contact">Explore Company Brain</RouteLink></PageIntro><section className="lt-section"><div className="lt-shell lt-brain-capabilities">{capabilities.map(([title, description]) => <article key={title}><h2>{title}</h2><p>{description}</p></article>)}</div></section><section className="lt-section lt-brain-boundary"><div className="lt-shell"><h2>Relationship-led, not self-serve.</h2><p>Company Brain is not a dashboard, login product or speculative platform. It is scoped after repeated knowledge and workflow problems are proven with a paying customer.</p></div></section></>;
}
