import { Activity, Bot, FileClock, Flag, RefreshCw, Workflow } from 'lucide-react';
import {
  FeatureCard,
  OfferCard,
  PageHero,
  RouteCta,
  RouteHeading,
  RouteSection,
} from '../components/sections/RoutePageSections';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { monitoringOffer } from '../content/offers';
import { breadcrumbSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function MonitoringPage() {
  useSeo({ title: 'AI Visibility Monitoring | LionTech Innovations', description: 'Track agreed priority AI buyer questions, factual changes and competitor movement with a concise monthly report.', path: '/monitoring', schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: monitoringOffer.name, path: '/monitoring' }]) });

  return (
    <>
      <PageHero eyebrow="AI VISIBILITY MONITORING" title="Keep the important facts visible and current." description="A measured continuity layer after the Snapshot and priority fixes, with agent actions added only where a proven commercial case exists.">
        <PrimaryCta label="Start with a Snapshot" />
        <RouteLink className="lt-button lt-button-secondary" href="/contact">Contact LionTech</RouteLink>
      </PageHero>

      <RouteSection>
        <RouteHeading eyebrow="CONTINUITY AND ACTION" title="Two ways to keep moving" description="Monitor the questions that matter, then improve a proven customer action path when the evidence supports it." />
        <div className="lt-route-continuity-grid">
          <OfferCard
            eyebrow="MONTHLY OVERSIGHT"
            title="AI Visibility Monitoring"
            description={monitoringOffer.scope}
            price={monitoringOffer.price}
            summaryRows={['Agreed priority buyer questions', 'Material factual and competitor movement', 'Concise monthly report']}
            href="/contact"
            ctaLabel="Add Monitoring"
            variant="continuity"
          />
          <OfferCard
            eyebrow="ADVANCED WORKFLOW"
            title="Agent Action Sprints"
            description="Improve a proven quote, booking, enquiry, availability or information retrieval path."
            price="£1,500-£3,500 per workflow"
            summaryRows={['Focused customer action path', 'Separately scoped and approved', 'Clear human ownership']}
            href="/contact"
            ctaLabel="Build an Action Path"
            variant="advanced"
          />
        </div>
      </RouteSection>

      <RouteSection tone="soft">
        <RouteHeading eyebrow="MONTHLY SCOPE" title="What LionTech tracks" description="A concise reporting scope tied to agreed priority buyer questions rather than open-ended dashboards." />
        <div className="lt-route-feature-grid">
          <FeatureCard title="Priority buyer questions" icon={RefreshCw}><p>Rerun the agreed prompts that matter to discovery, comparison, trust and action.</p></FeatureCard>
          <FeatureCard title="Factual and competitor movement" icon={Activity}><p>Compare material output changes and flag movement that deserves attention.</p></FeatureCard>
          <FeatureCard title="Concise monthly report" icon={FileClock}><p>Receive a focused summary of observed changes, evidence and recommended next actions.</p></FeatureCard>
        </div>
      </RouteSection>

      <RouteSection>
        <RouteHeading eyebrow="THE RHYTHM" title="Report, escalate, act" description="Monitoring maintains visibility. Delivery work remains separately scoped and approved." />
        <div className="lt-route-rhythm">
          <FeatureCard title="Report" icon={FileClock}><p>Document observed results and material movement against the agreed baseline.</p></FeatureCard>
          <FeatureCard title="Escalate" icon={Flag}><p>Identify factual, competitor or customer-path changes that require a decision.</p></FeatureCard>
          <FeatureCard title="Act" icon={Workflow}><p>Scope a fix or Agent Action Sprint only when the evidence and business case are clear.</p></FeatureCard>
          <FeatureCard title="Keep human ownership" icon={Bot}><p>Use automation inside explicit boundaries with clear approval and operational responsibility.</p></FeatureCard>
        </div>
      </RouteSection>

      <RouteCta
        title="Establish the baseline before you monitor movement."
        description="Every monitoring relationship starts with an AI Visibility Snapshot and an agreed set of priority buyer questions."
        primaryLabel="Start with a Snapshot"
        secondaryHref="/contact"
        secondaryLabel="Contact LionTech"
      />
    </>
  );
}
