import { BadgeCheck, MousePointerClick, Scale, Search } from 'lucide-react';
import {
  FeatureCard,
  FiveGatesGrid,
  OfferCard,
  PageHero,
  RouteCta,
  RouteHeading,
  RouteSection,
} from '../components/sections/RoutePageSections';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { homepage } from '../content/homepage';
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

  const buyerSteps = [
    { title: 'Discover', description: 'Find providers for real buyer questions.', icon: Search },
    { title: 'Compare', description: 'Compare services, facts and alternatives.', icon: Scale },
    { title: 'Verify', description: 'Check claims against credible trust signals.', icon: BadgeCheck },
    { title: 'Contact', description: 'Decide which business deserves the next step.', icon: MousePointerClick },
  ];

  return (
    <>
      <PageHero
        eyebrow="AI BUSINESS READINESS"
        title="See it. Fix it. Stay ready."
        description="LionTech starts with evidence, fixes material gaps, monitors change and adds agent actions only where the business case is clear."
      >
        <PrimaryCta />
        <RouteLink className="lt-button lt-button-secondary" href="/methodology">See the Five Gates</RouteLink>
      </PageHero>

      <RouteSection>
        <RouteHeading
          eyebrow="A CONTROLLED PATH"
          title="The business readiness path"
          description="Start with what customer-facing AI systems can see now. Progress only when the evidence and commercial case support the next step."
        />
        <div className="lt-route-offer-grid">
          <OfferCard
            eyebrow="01 · EVIDENCE"
            title={snapshotOffer.name}
            description="See the evidence and the priority gaps."
            price={snapshotOffer.foundingPrice}
            summaryRows={[snapshotOffer.turnaround, snapshotOffer.inclusions[0], snapshotOffer.inclusions[4]]}
            href="/ai-visibility-snapshot"
            ctaLabel="Explore the Snapshot"
            featured
          />
          <OfferCard
            eyebrow="02 · IMPLEMENT"
            title={fixSprintOffer.name}
            description="Implement up to five agreed priority fixes."
            price={fixSprintOffer.price}
            summaryRows={[fixSprintOffer.duration, fixSprintOffer.scope, fixSprintOffer.credit]}
            href="/readiness-fix-sprint"
            ctaLabel="Explore the Fix Sprint"
          />
          <OfferCard
            eyebrow="03 · MONITOR"
            title={monitoringOffer.name}
            description="Track agreed questions and material movement."
            price={monitoringOffer.price}
            summaryRows={['Agreed priority buyer questions', 'Material factual and competitor movement', 'Concise monthly report']}
            href="/monitoring"
            ctaLabel="Explore Monitoring"
          />
          <OfferCard
            eyebrow="04 · ACT"
            title="Agent Action Sprints"
            description="Improve a proven quote, booking, enquiry or information path."
            price="£1,500-£3,500 per workflow"
            summaryRows={['Quote, booking or enquiry path', 'Separately scoped and approved', 'Human-owned workflow boundaries']}
            href="/monitoring"
            ctaLabel="See Agent Actions"
          />
          <OfferCard
            eyebrow="05 · OPERATE"
            title={companyBrainOffer.name}
            description="Bring persistent knowledge and approved workflows inside."
            price={companyBrainOffer.stage}
            summaryRows={['Persistent company knowledge', 'Approved workflows and decisions', 'Role-scoped access']}
            href="/company-brain"
            ctaLabel="Explore Company Brain"
          />
        </div>
      </RouteSection>

      <RouteSection tone="soft">
        <div className="lt-route-split-heading">
          <RouteHeading eyebrow="WHY NOW" title={homepage.shift.title} description={homepage.shift.description} />
        </div>
        <div className="lt-route-feature-grid lt-route-feature-grid-four">
          {buyerSteps.map((step) => (
            <FeatureCard key={step.title} title={step.title} icon={step.icon}><p>{step.description}</p></FeatureCard>
          ))}
        </div>
      </RouteSection>

      <RouteSection>
        <RouteHeading
          eyebrow="THE FIVE GATES"
          title="What LionTech checks"
          description="A human-reviewed framework for how AI systems find, explain, support, compare and act on public business information."
        />
        <FiveGatesGrid />
      </RouteSection>

      <RouteCta
        title="Start with the evidence, not an AI transformation programme."
        description="The AI Visibility Snapshot shows what leading AI systems currently say, where the material gaps are and what to fix first."
        primaryLabel="Request a Founding Snapshot"
        secondaryHref="/methodology"
        secondaryLabel="Read the methodology"
      />
    </>
  );
}
