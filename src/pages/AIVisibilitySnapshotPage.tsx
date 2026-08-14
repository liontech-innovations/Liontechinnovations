import { BarChart3, CalendarClock, CheckCircle2, FileSearch, ListChecks, MessageSquareText, SearchCheck } from 'lucide-react';
import {
  FeatureCard,
  FiveGatesGrid,
  PageHero,
  RouteCta,
  RouteHeading,
  RouteSection,
  SnapshotPricingCard,
} from '../components/sections/RoutePageSections';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { snapshotFaq } from '../content/faq';
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

  const deliverables = [
    { title: snapshotOffer.inclusions[0], icon: FileSearch },
    { title: snapshotOffer.inclusions[1], icon: SearchCheck },
    { title: snapshotOffer.inclusions[2], icon: BarChart3 },
    { title: snapshotOffer.inclusions[3], icon: CheckCircle2 },
    { title: snapshotOffer.inclusions[4], icon: ListChecks },
    { title: snapshotOffer.inclusions[5], icon: CalendarClock },
    { title: snapshotOffer.inclusions[6], icon: MessageSquareText },
  ];

  return (
    <>
      <PageHero eyebrow="AI VISIBILITY SNAPSHOT" title="See what AI says. Know what to fix." description={snapshotOffer.shortScope}>
        <PrimaryCta label="Request a Founding Snapshot" />
        <RouteLink className="lt-button lt-button-secondary" href="/methodology">See how it is assessed</RouteLink>
      </PageHero>

      <RouteSection>
        <SnapshotPricingCard />
      </RouteSection>

      <RouteSection tone="soft">
        <RouteHeading eyebrow="THE DELIVERABLE" title="What you receive" description="A concise, human-reviewed evidence pack built for practical decisions rather than another generic AI score." />
        <div className="lt-route-feature-grid">
          {deliverables.map((item) => (
            <FeatureCard key={item.title} title={item.title} icon={item.icon}>
              <p>Included in the founding AI Visibility Snapshot.</p>
            </FeatureCard>
          ))}
        </div>
      </RouteSection>

      <RouteSection>
        <div className="lt-large-panel lt-route-guarantee">
          <p className="lt-route-card-label">MINIMUM-5 GUARANTEE</p>
          <h2>A useful finding threshold, written into the offer.</h2>
          <p>{snapshotOffer.guarantee}</p>
        </div>
      </RouteSection>

      <RouteSection tone="navy">
        <RouteHeading
          eyebrow="YOUR READINESS PROFILE"
          title="Evidence organised through the Five Gates"
          description="The public deliverable uses Strong, Workable, At Risk and Material Gap. It does not present an unqualified 0-100 score."
        />
        <FiveGatesGrid />
      </RouteSection>

      <RouteSection>
        <RouteHeading eyebrow="COMMON QUESTIONS" title="Snapshot FAQ" />
        <div className="lt-route-faq">
          {snapshotFaq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </RouteSection>

      <RouteCta
        title="Give LionTech the business AI should understand."
        description={`${snapshotOffer.foundingPrice} founding price. ${snapshotOffer.turnaround}.`}
        primaryLabel="Request a Founding Snapshot"
        secondaryHref="/contact"
        secondaryLabel="Contact LionTech"
      />
    </>
  );
}
