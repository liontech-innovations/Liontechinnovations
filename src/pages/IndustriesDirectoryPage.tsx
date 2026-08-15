import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { IndustryCta } from '../components/industry/IndustryComponents';
import { RouteLink } from '../components/ui/RouteLink';
import { industries, industryPath } from '../content/industries';

const groups = ['Health and care', 'Professional and financial services', 'Local and home services', 'Business services'] as const;

const guideFilters = [
  { value: 'all', label: 'All', description: 'All five routes remain visible for every industry.' },
  { value: 'ai-visibility', label: 'AI Visibility', description: 'Prioritises the facts and sources that support accurate retrieval and description.' },
  { value: 'how-ai-compares', label: 'How AI Compares', description: 'Prioritises factual comparison criteria without unsupported rankings.' },
  { value: 'agent-readiness', label: 'Agent Readiness', description: 'Prioritises controlled action paths with explicit human boundaries.' },
  { value: 'checklist', label: 'Checklists', description: 'Prioritises repeatable evidence checks with a responsible owner.' },
] as const;

const supportingGuides = [
  { value: 'ai-visibility', label: 'AI Visibility' },
  { value: 'how-ai-compares', label: 'How AI Compares' },
  { value: 'agent-readiness', label: 'Agent Readiness' },
  { value: 'checklist', label: 'Checklist' },
] as const;

type GuideFilter = (typeof guideFilters)[number]['value'];

export function IndustriesDirectoryPage() {
  const [activeGuideType, setActiveGuideType] = useState<GuideFilter>('all');
  const activeFilter = guideFilters.find((filter) => filter.value === activeGuideType) ?? guideFilters[0];

  return (
    <article className="lt-industry-directory" data-industry-directory>
      <header className="lt-industry-hero lt-industry-directory-hero">
        <div className="lt-shell">
          <p className="lt-kicker">AI-FIRST INDUSTRY KNOWLEDGE BASE</p>
          <h1>Industry-specific AI readiness guidance for UK businesses</h1>
          <p className="lt-industry-answer">Explore 100 substantial, evidence-led guides across 20 UK industries and five page types. This is general guidance, not a promise of rankings, recommendations or regulatory outcomes.</p>
          <p className="lt-industry-inventory" data-industry-inventory><strong>20 industries</strong><span>5 page types</span><span>100 substantial guides</span></p>
          <IndustryCta placement="hero" title="Test your own business with the £395 founding AI Visibility Snapshot." description="" />
        </div>
      </header>
      <div className="lt-shell lt-industry-body">
        <p className="lt-industry-introduction">A buyer searching for a dentist, mortgage broker, managed IT provider or roofing contractor is not asking the same question with a different noun. The evidence, regulated boundaries, service vocabulary, comparison criteria and safe action route change by sector. This directory keeps those distinctions visible while applying one stable LionTech framework: Discover, Describe, Trust, Compare and Act. Every industry hub links to four purpose-built supporting pages and to the official or professional sources used to frame the guidance. The system is structured for meaningful initial HTML, stable production canonicals and machine-readable public data, but it remains written for real owners and buyers first. Use the relevant cluster to inspect what information should be clear, where a third party may verify it and which actions still need accountable human judgement.</p>
        <section className="lt-industry-guide-filter" aria-labelledby="guide-filter-heading" data-guide-filter>
          <div>
            <p className="lt-kicker">GUIDE TYPES</p>
            <h2 id="guide-filter-heading">Choose a supporting guide</h2>
          </div>
          <div className="lt-industry-filter-controls" role="group" aria-label="Prioritise a guide type">
            {guideFilters.map((filter) => (
              <button
                type="button"
                data-guide-filter-button={filter.value}
                aria-pressed={activeGuideType === filter.value}
                className={activeGuideType === filter.value ? 'is-active' : undefined}
                key={filter.value}
                onClick={() => setActiveGuideType(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <p className="lt-industry-filter-status" aria-live="polite"><strong>{activeFilter.label}:</strong> {activeFilter.description}</p>
        </section>
        {groups.map((group) => {
          const groupIndustries = industries.filter((industry) => industry.group === group);
          return (
            <section className="lt-industry-directory-group" data-industry-group={group} key={group}>
              <p className="lt-kicker">{group}</p>
              <h2>{group} readiness guides</h2>
              <div className="lt-industry-directory-grid">
                {groupIndustries.map((industry) => (
                  <article className="lt-standard-card lt-industry-directory-card" data-industry-directory-entry={industry.slug} data-prioritised-guide={activeGuideType} key={industry.slug}>
                    <RouteLink className="lt-industry-primary-link" data-guide-type="hub" href={industryPath(industry.slug, 'hub')}>
                      <span className="lt-industry-primary-heading"><h3>{industry.name}</h3><ArrowRight size={20} aria-hidden="true" /></span>
                      <p>{industry.shortDescription}</p>
                      <span className="lt-industry-primary-action">View industry guide <ArrowRight size={15} aria-hidden="true" /></span>
                    </RouteLink>
                    <nav className="lt-industry-secondary-actions" aria-label={`${industry.name} supporting guides`}>
                      {supportingGuides.map((guide) => (
                        <RouteLink
                          className={activeGuideType === guide.value ? 'is-prioritised' : undefined}
                          data-guide-type={guide.value}
                          href={industryPath(industry.slug, guide.value)}
                          key={guide.value}
                        >
                          {guide.label}<ArrowRight size={13} aria-hidden="true" />
                        </RouteLink>
                      ))}
                    </nav>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
        <IndustryCta placement="final" title="See what AI says about your business" description="Move from general industry guidance to an evidence-led Snapshot of your own public information and buyer action path." />
      </div>
    </article>
  );
}
