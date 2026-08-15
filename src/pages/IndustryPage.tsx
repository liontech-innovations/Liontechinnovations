import { RouteLink } from '../components/ui/RouteLink';
import { IndustryCta, IndustryList, IndustryPanel, SourceLink } from '../components/industry/IndustryComponents';
import { industryPath, industriesBySlug, programmaticContentStatus, programmaticNoGuaranteeDisclaimer } from '../content/industries';
import { contentReviewManifestUrl, sourceManifestUrl } from '../content/industries/artifacts';
import { getGateInterpretations, getIndustryFaqs, getPageSpecificItems, getPracticalChecks, getSourceObservations } from '../content/industries/page-copy';
import type { IndustryPageDescriptor } from '../content/industries';

const pageTypeNames = {
  hub: 'AI-first readiness',
  'ai-visibility': 'AI visibility',
  'how-ai-compares': 'How AI compares',
  'agent-readiness': 'Agent readiness',
  checklist: 'Readiness checklist',
} as const;

export function IndustryPage({ page }: { page: IndustryPageDescriptor }) {
  const record = page.industry;
  const sourceObservations = getSourceObservations(page);
  const gateInterpretations = getGateInterpretations(page);
  const pageSpecificItems = getPageSpecificItems(page);
  const practicalChecks = getPracticalChecks(page);
  const faqs = getIndustryFaqs(page);
  const related = record.relatedIndustries.map((slug) => industriesBySlug.get(slug)).filter(Boolean);
  const buyerQuestions = record.buyerQuestions.filter((item, index) => index % 2 === (page.pageType === 'hub' || page.pageType === 'checklist' ? 0 : 1)).slice(0, 5);

  return (
    <>
      <article className="lt-industry-page" data-programmatic-content data-industry={record.slug} data-page-type={page.pageType}>
        <header className="lt-industry-hero">
          <div className="lt-shell">
            <nav className="lt-industry-breadcrumbs" aria-label="Breadcrumb">
              <RouteLink href="/">Home</RouteLink><span>/</span><RouteLink href="/industries">Industries</RouteLink><span>/</span>
              {page.pageType === 'hub' ? <span aria-current="page">{record.name}</span> : <><RouteLink href={industryPath(record.slug, 'hub')}>{record.name}</RouteLink><span>/</span><span aria-current="page">{pageTypeNames[page.pageType]}</span></>}
            </nav>
            <p className="lt-kicker">{record.group} · {pageTypeNames[page.pageType]}</p>
            <h1>{page.h1}</h1>
            <p className="lt-industry-answer" data-direct-answer>{page.directAnswer}</p>
            <IndustryCta
              placement="hero"
              title={`See what AI can understand about your ${record.singularName}`}
              description="The £395 founding Snapshot checks sampled buyer questions, records the evidence and identifies priority corrections. Delivery is within 48 hours after completed onboarding; rankings and recommendations are not guaranteed."
            />
          </div>
        </header>

        <div className="lt-shell lt-industry-body">
          <p className="lt-industry-introduction" data-industry-introduction>{page.introduction}</p>

          <IndustryPanel eyebrow="KEY FACTS" title="What AI and buyers need to understand">
            <div className="lt-industry-fact-grid">
              {record.factsAIShouldUnderstand.slice(0, 6).map((fact) => <article className="lt-standard-card" key={fact}><p>{fact}</p></article>)}
            </div>
          </IndustryPanel>

          <IndustryPanel eyebrow="FIVE GATES" title={`How the Five Gates apply to ${record.name.toLowerCase()}`}>
            <div className="lt-industry-gates">
              {gateInterpretations.map((gate) => (
                <article className="lt-standard-card" data-gate={gate.intent} key={gate.intent}>
                  <p className="lt-route-card-label">{gate.label}</p>
                  <h3>{gate.question}</h3>
                  <p>{gate.text}</p>
                </article>
              ))}
            </div>
          </IndustryPanel>

          <IndustryPanel eyebrow="PAGE FOCUS" title={`${pageTypeNames[page.pageType]} checks for ${record.name.toLowerCase()}`}>
            <IndustryList items={pageSpecificItems} className={page.pageType === 'checklist' ? 'lt-industry-checklist' : ''} />
          </IndustryPanel>

          <IndustryPanel eyebrow="BUYER INTENT" title="Questions the public information should answer">
            <div className="lt-industry-question-grid" data-buyer-questions>
              {buyerQuestions.map((item) => (
                <article className="lt-standard-card" key={item.question}>
                  <p className="lt-route-card-label">{item.intent}</p>
                  <h3>{item.question}</h3>
                  <p>{item.whyItMatters}</p>
                </article>
              ))}
            </div>
          </IndustryPanel>

          <IndustryPanel eyebrow="EVIDENCE" title="Page-specific evidence observations">
            <div className="lt-industry-evidence-grid">
              {sourceObservations.map((item) => (
                <article className="lt-standard-card lt-industry-evidence-card" data-source-observation key={item.heading}>
                  <h3>{item.heading}</h3>
                  <p>{item.observation}</p>
                  <SourceLink href={item.url} label={`Review ${item.label}`} />
                </article>
              ))}
            </div>
          </IndustryPanel>

          <IndustryPanel eyebrow="PRACTICAL REVIEW" title="Six checks to run next">
            <IndustryList items={practicalChecks} ordered />
          </IndustryPanel>

          <IndustryCta
            placement="contextual"
            title={`Turn ${record.name.toLowerCase()} visibility questions into evidence`}
            description={`The Snapshot reviews buyer questions about ${record.commonServices[0]}, public trust sources and the route to ${record.actionPaths[0]}. It produces observed findings, not an invented industry score.`}
          />

          <IndustryPanel eyebrow="TRUSTED SOURCES" title="Evidence and official reference points">
            <div className="lt-industry-source-list" data-source-list>
              {record.trustedSources.map((item) => (
                <article className="lt-standard-card" key={item.url}>
                  <h3><SourceLink href={item.url} label={item.label} /></h3>
                  <p>{item.supports.join(' ')}</p>
                  <span>Source reference checked {item.checkedAt}</span>
                </article>
              ))}
            </div>
          </IndustryPanel>

          <IndustryPanel eyebrow="COMMON QUESTIONS" title={`${pageTypeNames[page.pageType]} FAQ`}>
            <div className="lt-industry-faq" data-faq-list>
              {faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
            </div>
          </IndustryPanel>

          <IndustryPanel eyebrow="CONNECTED GUIDANCE" title="Continue through this industry cluster">
            <div className="lt-industry-link-grid" data-contextual-links>
              {Object.keys(pageTypeNames).map((pageType) => (
                <RouteLink key={pageType} href={industryPath(record.slug, pageType as keyof typeof pageTypeNames)}>{pageTypeNames[pageType as keyof typeof pageTypeNames]}</RouteLink>
              ))}
              {related.map((item) => item ? <RouteLink key={item.slug} href={industryPath(item.slug, 'hub')}>{item.name}</RouteLink> : null)}
              <RouteLink href="/ai-visibility-snapshot">AI Visibility Snapshot</RouteLink>
              <RouteLink href="/methodology">Five Gates methodology</RouteLink>
              <RouteLink href="/ai-business-readiness">AI Business Readiness</RouteLink>
              <RouteLink href="/readiness-fix-sprint">Readiness Fix Sprint</RouteLink>
            </div>
          </IndustryPanel>

          <div className="lt-industry-review" data-source-check-date data-content-review-status={programmaticContentStatus}>
            <strong>Content approval status: pending</strong>
            <span>Source references checked: {record.sourceCheckedAt}</span>
            <p>{programmaticNoGuaranteeDisclaimer} <RouteLink href="/methodology">Read the methodology</RouteLink>.</p>
            <p><RouteLink href={sourceManifestUrl}>View the source manifest</RouteLink> · <RouteLink href={contentReviewManifestUrl}>View the content review manifest</RouteLink></p>
          </div>

          <IndustryCta
            placement="final"
            title="See what AI says about your business"
            description={`Start with the existing form-first Snapshot path. LionTech will qualify the request before any payment link, implementation or monitoring work is considered.`}
          />
        </div>
      </article>
    </>
  );
}
