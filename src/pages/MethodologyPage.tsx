import { Eye, FileCheck2, SearchCheck, ShieldCheck } from 'lucide-react';
import {
  FeatureCard,
  FiveGatesGrid,
  PageHero,
  RouteCta,
  RouteHeading,
  RouteSection,
} from '../components/sections/RoutePageSections';
import { PrimaryCta } from '../components/ui/PrimaryCta';
import { RouteLink } from '../components/ui/RouteLink';
import { readinessStatuses } from '../content/methodology';
import { breadcrumbSchema } from '../lib/schema';
import { useSeo } from '../lib/seo';

export function MethodologyPage() {
  useSeo({ title: 'Five Gates AI Readiness Methodology | LionTech Innovations', description: 'Discover, Describe, Trust, Compare and Act: a human-reviewed framework for practical AI Business Readiness.', path: '/methodology', schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Methodology', path: '/methodology' }]) });

  const statusCopy = [
    'The sampled evidence supports the buyer question clearly.',
    'The path is usable, with limited improvements identified.',
    'Material weaknesses could affect buyer understanding or action.',
    'A significant evidence, accuracy or action-path issue requires attention.',
  ];

  return (
    <>
      <PageHero eyebrow="THE FIVE GATES METHOD" title="A clear way to inspect AI readiness." description="LionTech observes how AI systems find, explain, support, compare and act on public business information.">
        <PrimaryCta />
        <RouteLink className="lt-button lt-button-secondary" href="/ai-business-readiness">See the readiness path</RouteLink>
      </PageHero>

      <RouteSection>
        <RouteHeading eyebrow="THE FRAMEWORK" title="Five buyer gates, reviewed with evidence" description="Each gate asks a practical question about what customer-facing AI systems can currently understand and support." />
        <FiveGatesGrid />
      </RouteSection>

      <RouteSection tone="soft">
        <RouteHeading eyebrow="STATUS MODEL" title="A profile, not a public score" description="The founding Snapshot uses four plain-language statuses. A public 0-100 benchmark remains blocked pending Customer Zero and further validation." />
        <div className="lt-route-status-grid">
          {readinessStatuses.map((status, index) => (
            <article className={`lt-route-status-card lt-route-status-${index + 1}`} key={status}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{status}</h3>
              <p>{statusCopy[index]}</p>
            </article>
          ))}
        </div>
      </RouteSection>

      <RouteSection>
        <RouteHeading eyebrow="EVIDENCE STANDARDS" title="Observed, captured and human-reviewed" description="Findings remain tied to the agreed sampled tests and the public information available at the time of review." />
        <div className="lt-route-evidence-grid">
          <FeatureCard title="Observed outputs" icon={Eye}><p>LionTech records what the selected AI systems returned for agreed buyer questions.</p></FeatureCard>
          <FeatureCard title="Captured sources" icon={SearchCheck}><p>Relevant facts, sources and competitor appearances are documented for review.</p></FeatureCard>
          <FeatureCard title="Human-reviewed findings" icon={FileCheck2}><p>Recommendations are checked for factual relevance and practical business use.</p></FeatureCard>
          <FeatureCard title="What LionTech does not claim" icon={ShieldCheck} className="lt-route-evidence-claims">
            <p className="lt-route-evidence-claim">No invented authority. No future ranking guarantee.</p>
            <ul className="lt-route-plain-list">
              <li>No control over third-party AI systems</li>
              <li>No guarantee of future recommendations or rankings</li>
              <li>No unqualified public 0-100 readiness score</li>
              <li>No findings detached from the sampled evidence</li>
            </ul>
          </FeatureCard>
        </div>
      </RouteSection>

      <RouteSection tone="navy">
        <RouteHeading eyebrow="TESTING PROCESS" title="A controlled path from question to action" description="The process stays focused on real buyer intent, recorded evidence and changes the business can approve." />
        <div className="lt-route-process-line">
          {[
            ['01', 'Agree', 'Confirm the business, buyer questions and focused competitor set.'],
            ['02', 'Test', 'Run sampled tests across leading AI systems.'],
            ['03', 'Review', 'Check factual accuracy, sources, comparison and action paths.'],
            ['04', 'Prioritise', 'Map the findings to the Five Gates and the top five fixes.'],
            ['05', 'Act', 'Deliver a practical 30-day plan and review call.'],
          ].map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </RouteSection>

      <RouteCta
        title="See the methodology applied to your business."
        description="The AI Visibility Snapshot turns sampled buyer questions into evidence, a Five Gates profile and a practical 30-day action plan."
        primaryLabel="Request a Founding Snapshot"
        secondaryHref="/ai-visibility-snapshot"
        secondaryLabel="Review the Snapshot"
      />
    </>
  );
}
