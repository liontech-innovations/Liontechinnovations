import { ArrowRight, Eye, FileCheck2, LockKeyhole, MapPin, Network, Wrench } from 'lucide-react';
import {
  FeatureCard,
  PageHero,
  RouteCta,
  RouteHeading,
  RouteSection,
} from '../components/sections/RoutePageSections';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { company } from '../content/company';
import { platforms } from '../content/platforms';
import { routeSeo } from '../content/routeSeo';
import { useSeo } from '../lib/seo';

export function AboutPage() {
  useSeo(routeSeo['/about']);

  const principles = [
    { title: 'Evidence before hype', description: 'Start with observed outputs, facts and practical buyer questions.', icon: Eye },
    { title: 'Human-reviewed findings', description: 'Apply judgement before a result becomes a recommendation.', icon: FileCheck2 },
    { title: 'Model-independent thinking', description: 'Build useful company capability without depending on one AI vendor.', icon: Network },
    { title: 'Production implementation capability', description: 'Turn agreed findings into controlled, working changes.', icon: Wrench },
    { title: 'Privacy and access discipline', description: 'Keep information, roles and operational boundaries explicit.', icon: LockKeyhole },
    { title: 'Manchester-based, UK-wide delivery', description: 'Work remotely with UK businesses from Manchester.', icon: MapPin },
  ];

  return (
    <>
      <PageHero eyebrow="ABOUT LIONTECH" title="Evidence-led readiness. Production engineering." description={`${company.legalName} is ${company.location}.`}>
        <PrimaryCta />
        <RouteLink className="lt-button lt-button-secondary" href="/ai-business-readiness">See the readiness path</RouteLink>
      </PageHero>

      <RouteSection>
        <div className="lt-route-about-intro">
          <RouteHeading eyebrow="PRACTICAL BY DESIGN" title="Built for practical decisions" description="LionTech helps businesses understand what customer-facing AI systems currently say, then turns material gaps into a controlled implementation plan." />
          <p>
            Lion Tech Innovations Ltd is registered in England and Wales under company number <strong>{company.companiesHouseNumber}</strong>.{' '}
            <a href={company.companiesHouseUrl} target="_blank" rel="noreferrer">Verify the company record on Companies House</a>.
          </p>
          <RouteLink className="lt-route-text-link" href="/industries">Explore the industry guides <ArrowRight size={15} aria-hidden="true" /></RouteLink>
        </div>
      </RouteSection>

      <RouteSection tone="navy">
        <RouteHeading eyebrow="PLATFORM PROOF" title="Production systems, not presentation concepts" description="Four existing LionTech platforms demonstrate the ability to build and operate real customer journeys." />
        <div className="lt-route-platform-grid">
          {platforms.map((platform) => (
            <RouteLink className="lt-route-platform-card" href={platform.href} key={platform.name}>
              <div className="lt-route-platform-image"><img src={platform.image} alt={`${platform.name} platform preview`} /></div>
              <div>
                <h3>{platform.name}</h3>
                <p>{platform.description}</p>
                <span>View platform</span>
              </div>
            </RouteLink>
          ))}
        </div>
      </RouteSection>

      <RouteSection>
        <RouteHeading eyebrow="OPERATING PRINCIPLES" title="The standard behind the work" description="A practical set of constraints for useful AI readiness and production delivery." />
        <div className="lt-route-principles-grid">
          {principles.map((principle) => (
            <FeatureCard key={principle.title} title={principle.title} icon={principle.icon}><p>{principle.description}</p></FeatureCard>
          ))}
        </div>
      </RouteSection>

      <RouteCta
        title="Start with what customer-facing AI can see now."
        description="The AI Visibility Snapshot gives the evidence, priority gaps and 30-day action plan needed for a practical first decision."
        primaryLabel="Request a Founding Snapshot"
        secondaryHref="/contact"
        secondaryLabel="Contact LionTech"
      />
    </>
  );
}
