import { ArrowRight, Plus } from 'lucide-react';
import { RouteHeading, RouteSection } from '../components/sections/RoutePageSections';
import { RouteLink } from '../components/ui/RouteLink';
import { ZimbabweSectorImage } from '../components/ZimbabweSectorImage';
import { company } from '../content/company';
import { zimbabwe, zimbabweOffers } from '../content/zimbabwe';
import { zimbabweIndustryByPath, zimbabweIndustryPath, type ZimbabweIndustry, type ZimbabwePoint } from '../content/zimbabweIndustries';
import { zimbabweGateNames, zimbabweGateQuestions } from '../content/zimbabweGates';
import { createZimbabweIndustrySeo } from '../content/zimbabweIndustrySeo';
import { useSeo } from '../lib/seo';
import '../styles/zimbabwe.css';
import '../styles/zimbabwe-industries.css';

function Points({ items }: { items: readonly ZimbabwePoint[] }) {
  return <dl className="lt-zw-editorial-points">{items.map(([title, detail]) => <div key={title}><dt>{title}</dt><dd>{detail}</dd></div>)}</dl>;
}
function ExecutiveReviewLink() {
  return <RouteLink href={zimbabwe.enquiryHref} className="lt-button lt-button-primary">Request an Executive Review<ArrowRight size={16} aria-hidden="true" /></RouteLink>;
}

export function ZimbabweIndustryPage({ industry }: { industry: ZimbabweIndustry }) {
  useSeo(createZimbabweIndustrySeo(industry));
  const related = industry.relatedSlugs.map(slug => zimbabweIndustryByPath.get(zimbabweIndustryPath(slug))!);
  return <article className="lt-zimbabwe-page lt-zw-industry-page">
    <section className="lt-zw-sector-hero">
      <div className="lt-shell">
        <nav className="lt-zw-breadcrumbs" aria-label="Breadcrumb"><RouteLink href="/">Home</RouteLink><span aria-hidden="true">/</span><RouteLink href="/zimbabwe">Zimbabwe</RouteLink><span aria-hidden="true">/</span><span aria-current="page">{industry.shortTitle}</span></nav>
        <div className="lt-zw-sector-intro"><div><p className="lt-kicker">Zimbabwe · {industry.shortTitle}</p><h1>{industry.h1}</h1><p className="lt-zw-sector-summary">{industry.summary}</p><div className="lt-route-actions"><ExecutiveReviewLink /><RouteLink className="lt-zw-text-link" href="/zimbabwe">Explore the Zimbabwe market page<ArrowRight size={16} aria-hidden="true" /></RouteLink></div></div><ZimbabweSectorImage imageKey={industry.imageKey} /></div>
      </div>
    </section>
    <RouteSection id="sector-context" tone="soft"><div className="lt-zw-reading"><RouteHeading eyebrow="Sector context" title={industry.contextHeading} /><p>{industry.context}</p></div></RouteSection>
    <RouteSection id="readiness-problems"><div className="lt-zw-editorial-row"><RouteHeading eyebrow="Where to look" title={`Information gaps to check in ${industry.shortTitle.toLowerCase()}`} /><Points items={industry.challenges} /></div></RouteSection>
    <RouteSection tone="soft" id="liontech-scope"><div className="lt-zw-editorial-row"><RouteHeading eyebrow="Practical scope" title="What LionTech can help with" /><Points items={industry.help} /></div></RouteSection>
    <RouteSection id="sector-use-cases"><div className="lt-zw-editorial-row"><RouteHeading eyebrow="Possible use cases" title={`Practical AI for ${industry.shortTitle.toLowerCase()}`} description="Illustrative opportunities to assess, not delivered client results or a promise that every use case is suitable." /><Points items={industry.useCases} /></div></RouteSection>
    <RouteSection id="sector-foundations" tone="navy"><div className="lt-zw-reading lt-zw-feature-panel"><RouteHeading eyebrow="Foundation before AI" title="Give the tool a source it can rely on" /><p>{industry.foundation}</p></div>
      {industry.slug === 'banking-financial-services' && import.meta.env.MODE === 'founder-review' && <figure className="lt-zw-banknote-preview"><img src="/__founder-review/banknotes.jpg" width={940} height={1280} loading="lazy" alt="Historical Zimbabwe banknotes; supplied image retains its Alamy watermark" /><figcaption>Founder preview only. Third-party stock watermark retained. Production use requires a licensed replacement or confirmation of usage rights. No RBZ endorsement or LionTech ownership is implied.</figcaption></figure>}
    </RouteSection>
    <RouteSection id="readiness-checks"><div className="lt-zw-editorial-row"><RouteHeading eyebrow="Evidence to inspect" title="Example readiness checkpoints" description="Use these questions to guide a review. They are not findings about your organisation." /><Points items={industry.checks} /></div>
      <div className="lt-zw-gates"><h3>Five buyer gates for {industry.shortTitle.toLowerCase()}</h3><dl>{zimbabweGateQuestions[industry.slug].map((question, index) => <div key={question}><dt><span className="lt-zw-gate-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{zimbabweGateNames[index]}</dt><dd>{question}</dd></div>)}</dl></div>
    </RouteSection>
    <RouteSection tone="soft" id="controlled-delivery"><div className="lt-zw-reading lt-zw-feature-panel"><RouteHeading eyebrow="Minimum-access delivery" title="Keep approval with the people responsible" /><p>{industry.humanControl}</p><p>{company.legalName} is registered in England and Wales, company number {company.companiesHouseNumber}. Zimbabwe engagements are delivered from the UK. We agree the scope, use a separate working environment where practical, test the changes and obtain client approval before release.</p><RouteLink className="lt-zw-text-link" href="/zimbabwe#delivery">Read how delivery and access work<ArrowRight size={16} aria-hidden="true" /></RouteLink></div></RouteSection>
    <RouteSection id="sector-faq"><RouteHeading eyebrow="Before you begin" title={`${industry.shortTitle}: questions about the work`} /><div className="lt-zimbabwe-faq">{industry.faq.map(item => <details key={item.question}><summary>{item.question}<Plus size={20} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
      {industry.reference && <p className="lt-zw-reference">Sector reference: <a href={industry.reference.url}>{industry.reference.title}</a>. This is an independent source, not a LionTech endorsement or partnership.</p>}
    </RouteSection>
    <RouteSection tone="soft" id="sector-review"><div className="lt-zw-review"><div><RouteHeading eyebrow="Start with an evidence-led review" title={zimbabweOffers[0].title} /><strong className="lt-zimbabwe-price">{zimbabweOffers[0].price}</strong><p>{industry.ctaContext}</p><p>The review covers external evidence, executive discovery and priority actions. Send the business details first; scope and payment arrangements follow qualification. Implementation is agreed separately.</p><ExecutiveReviewLink /></div><aside><h3>After the review</h3><p>{zimbabweOffers[1].title}<strong>{zimbabweOffers[1].price}</strong></p><p>{zimbabweOffers[2].title}<strong>{zimbabweOffers[2].price}</strong></p><p>{zimbabweOffers[1].qualification}</p><p>No search ranking, AI recommendation or business outcome is guaranteed.</p></aside></div></RouteSection>
    <RouteSection id="related-zimbabwe-industries"><RouteHeading eyebrow="Continue reading" title="Related Zimbabwe industries" /><div className="lt-zw-related-links">{related.map(item => <RouteLink key={item.slug} href={zimbabweIndustryPath(item.slug)}><span>{item.title}</span><ArrowRight size={18} aria-hidden="true" /></RouteLink>)}</div><RouteLink className="lt-zw-text-link" href="/zimbabwe#zimbabwe-industries">Explore more Zimbabwe industries<ArrowRight size={16} aria-hidden="true" /></RouteLink></RouteSection>
  </article>;
}
