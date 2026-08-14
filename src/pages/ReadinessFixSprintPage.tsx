import { Braces, GitPullRequestArrow, ScanSearch } from 'lucide-react';
import {
  FeatureCard,
  PageHero,
  RouteCta,
  RouteHeading,
  RouteSection,
} from '../components/sections/RoutePageSections';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { fixSprintOffer } from '../content/offers';
import { routeSeo } from '../content/routeSeo';
import { useSeo } from '../lib/seo';

export function ReadinessFixSprintPage() {
  useSeo(routeSeo['/readiness-fix-sprint']);

  return (
    <>
      <PageHero eyebrow="READINESS FIX SPRINT" title="Turn priority gaps into approved changes." description="A focused implementation sprint for the material issues identified in your Snapshot.">
        <PrimaryCta label="Request a Snapshot First" />
        <RouteLink className="lt-button lt-button-secondary" href="/ai-visibility-snapshot">Review the Snapshot</RouteLink>
      </PageHero>

      <RouteSection>
        <RouteHeading eyebrow="FOCUSED DELIVERY" title="Three implementation tracks" description="The agreed scope is selected from the highest-value changes the evidence supports." />
        <div className="lt-route-process-grid">
          <FeatureCard title="Source-of-truth fixes" icon={ScanSearch}>
            <p>Correct inaccurate or missing public information and strengthen the approved facts AI systems can find.</p>
          </FeatureCard>
          <FeatureCard title="Structured implementation" icon={Braces}>
            <p>Implement agreed website, metadata, structured data, trust evidence or customer-path improvements.</p>
          </FeatureCard>
          <FeatureCard title="Verified handoff" icon={GitPullRequestArrow}>
            <p>Review the approved changes, document the work and rerun the sampled tests after implementation.</p>
          </FeatureCard>
        </div>

        <article className="lt-commercial-card lt-route-price-strip">
          <p className="lt-route-card-label">IMPLEMENTATION OFFER</p>
          <h3>{fixSprintOffer.name}</h3>
          <p>{fixSprintOffer.scope}</p>
          <div className="lt-route-price-facts">
            <div><span>Investment</span><strong>{fixSprintOffer.price}</strong></div>
            <div><span>Delivery cap</span><strong>Up to five priority fixes</strong></div>
            <div><span>Delivery window</span><strong>{fixSprintOffer.duration}</strong></div>
          </div>
          <PrimaryCta label="Request a Snapshot First" />
        </article>
      </RouteSection>

      <RouteSection tone="soft">
        <RouteHeading eyebrow="CLEAR BOUNDARIES" title="What sits outside the Sprint" description="The delivery cap keeps the work controlled, reviewable and commercially clear." />
        <div className="lt-route-boundary-grid">
          <FeatureCard title="One structured revision round"><p>Additional revision or implementation work is separately scoped.</p></FeatureCard>
          <FeatureCard title="Work beyond the agreed cap"><p>Anything outside the selected priority fixes is quoted separately.</p></FeatureCard>
          <FeatureCard title="Third-party AI outputs"><p>LionTech verifies observed movement without claiming control of future AI recommendations.</p></FeatureCard>
        </div>
        <p className="lt-route-credit-note">{fixSprintOffer.credit} Day 10 verifies the changes. Day 28-30 reruns the sampled tests and reports observed movement.</p>
      </RouteSection>

      <RouteCta
        title="Evidence first. Controlled implementation second."
        description="The Fix Sprint starts from agreed Snapshot findings, so the work is tied to real buyer questions and evidenced gaps."
        primaryLabel="Request a Snapshot First"
        secondaryHref="/contact"
        secondaryLabel="Discuss the scope"
      />
    </>
  );
}
