import { IndustryCta } from '../components/industry/IndustryComponents';
import { RouteLink } from '../components/ui/RouteLink';
import { industries, industryPath } from '../content/industries';

const groups = ['Health and care', 'Professional and financial services', 'Local and home services', 'Business services'] as const;

export function IndustriesDirectoryPage() {
  return (
    <article className="lt-industry-directory" data-industry-directory>
      <header className="lt-industry-hero">
        <div className="lt-shell">
          <p className="lt-kicker">AI-FIRST INDUSTRY KNOWLEDGE BASE</p>
          <h1>Industry-specific AI readiness guidance for UK businesses</h1>
          <p className="lt-industry-answer">Explore 20 evidence-led industry clusters designed to help owners understand the facts, sources, buyer questions and action paths that customer-facing AI systems may need. Each cluster covers AI visibility, provider comparison, safe agent readiness and a practical Five Gates checklist. The pages provide general guidance and transparent sources; they do not promise rankings, recommendations or regulatory outcomes.</p>
          <IndustryCta placement="hero" title="Test your own business, not an industry average" description="The £395 founding Snapshot samples real buyer questions, records what leading AI systems return and identifies priority corrections after completed onboarding." />
        </div>
      </header>
      <div className="lt-shell lt-industry-body">
        <p className="lt-industry-introduction">A buyer searching for a dentist, mortgage broker, managed IT provider or roofing contractor is not asking the same question with a different noun. The evidence, regulated boundaries, service vocabulary, comparison criteria and safe action route change by sector. This directory keeps those distinctions visible while applying one stable LionTech framework: Discover, Describe, Trust, Compare and Act. Every industry hub links to four purpose-built supporting pages and to the official or professional sources used to frame the guidance. The system is structured for meaningful initial HTML, stable production canonicals and machine-readable public data, but it remains written for real owners and buyers first. Use the relevant cluster to inspect what information should be clear, where a third party may verify it and which actions still need accountable human judgement.</p>
        {groups.map((group) => (
          <section className="lt-industry-directory-group" key={group}>
            <p className="lt-kicker">{group}</p>
            <h2>{group} readiness guides</h2>
            <div className="lt-industry-directory-grid">
              {industries.filter((industry) => industry.group === group).map((industry) => (
                <article className="lt-standard-card" key={industry.slug}>
                  <h3><RouteLink href={industryPath(industry.slug, 'hub')}>{industry.name}</RouteLink></h3>
                  <p>{industry.shortDescription}</p>
                  <div>
                    <RouteLink href={industryPath(industry.slug, 'ai-visibility')}>AI visibility</RouteLink>
                    <RouteLink href={industryPath(industry.slug, 'how-ai-compares')}>How AI compares</RouteLink>
                    <RouteLink href={industryPath(industry.slug, 'agent-readiness')}>Agent readiness</RouteLink>
                    <RouteLink href={industryPath(industry.slug, 'checklist')}>Checklist</RouteLink>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
        <IndustryCta placement="final" title="See what AI says about your business" description="Move from general industry guidance to a human-reviewed Snapshot of your own public evidence and buyer action path." />
      </div>
    </article>
  );
}
