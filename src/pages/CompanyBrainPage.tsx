import { ArrowRight, BrainCircuit, DatabaseZap, LockKeyhole, Network, Workflow } from 'lucide-react';
import {
  FeatureCard,
  PageHero,
  RouteCta,
  RouteHeading,
  RouteSection,
} from '../components/sections/RoutePageSections';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { companyBrainOffer } from '../content/offers';
import { breadcrumbSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function CompanyBrainPage() {
  useSeo({ title: 'Company Brain | LionTech Innovations', description: 'A relationship-led operating layer for persistent knowledge, SOPs, decisions, approved workflows and role-scoped access.', path: '/company-brain', schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: companyBrainOffer.name, path: '/company-brain' }]) });

  const flow = [
    { title: 'Approved facts', icon: DatabaseZap },
    { title: 'Structured knowledge', icon: BrainCircuit },
    { title: 'Role-scoped access', icon: LockKeyhole },
    { title: 'Approved workflows', icon: Workflow },
    { title: 'Verified output', icon: Network },
  ];

  return (
    <>
      <PageHero eyebrow="COMPANY BRAIN · PHASE 4" title="Bring AI inside when the business is ready." description={companyBrainOffer.scope}>
        <PrimaryCta label="Start with a Snapshot" />
        <RouteLink className="lt-button lt-button-secondary" href="/contact">Explore Company Brain</RouteLink>
      </PageHero>

      <RouteSection>
        <RouteHeading eyebrow="THE OPERATING LAYER" title="From approved knowledge to controlled action" description="Company Brain keeps operational context useful as tools and models change." />
        <div className="lt-route-brain-flow">
          {flow.map((item, index) => {
            const Icon = item.icon;
            return (
              <div className="lt-standard-card lt-route-brain-node" key={item.title}>
                <span><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></span>
                <strong>{item.title}</strong>
                {index < flow.length - 1 ? <ArrowRight className="lt-route-brain-arrow" size={18} aria-hidden="true" /> : null}
              </div>
            );
          })}
        </div>
      </RouteSection>

      <RouteSection tone="soft">
        <div className="lt-route-two-column">
          <div>
            <RouteHeading eyebrow="QUALIFICATION" title="Built after the need is proven" description="Company Brain is considered when repeated knowledge and workflow problems have been demonstrated with a paying customer." />
            <ul className="lt-route-plain-list">
              <li>A proven need for persistent company knowledge</li>
              <li>Approved information, decisions and workflows</li>
              <li>Clear human ownership and access boundaries</li>
              <li>A defined operational use case</li>
            </ul>
          </div>
          <div className="lt-large-panel lt-route-relationship-panel">
            <p className="lt-route-card-label">RELATIONSHIP-LED DELIVERY</p>
            <h2>Scoped with the business, not sold as a login.</h2>
            <p>The operating layer is shaped around real people, approved knowledge and repeated workflows. It is not a speculative product imposed before the business case is clear.</p>
          </div>
        </div>
      </RouteSection>

      <RouteSection>
        <RouteHeading eyebrow="BOUNDARIES" title="What Company Brain is not" description="The phase remains deliberately gated behind evidence, implementation and an established working relationship." />
        <div className="lt-route-boundary-grid">
          <FeatureCard title="Not the first offer"><p>The path starts with external evidence through the AI Visibility Snapshot.</p></FeatureCard>
          <FeatureCard title="Not dashboard SaaS"><p>Company Brain is a relationship-led operating layer, not a self-serve dashboard or login product.</p></FeatureCard>
          <FeatureCard title="Not built without proven need"><p>It is scoped only after recurring knowledge or workflow problems are demonstrated.</p></FeatureCard>
        </div>
      </RouteSection>

      <RouteCta
        eyebrow="PHASE 4"
        title="Build the external evidence and working relationship first."
        description="Start with the AI Visibility Snapshot. Company Brain is explored later when the business is ready for a persistent operating layer."
        primaryLabel="Start with a Snapshot"
        secondaryHref="/contact"
        secondaryLabel="Contact LionTech"
      />
    </>
  );
}
