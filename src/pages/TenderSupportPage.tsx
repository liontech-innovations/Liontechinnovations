import type { ReactNode } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { RouteLink } from '../components/ui/RouteLink';
import { useSeo } from '../lib/seo';
import { createTenderSeo } from '../content/tenders/seo';
import { tenderPageByPath, type TenderPage } from '../content/tenders';
import { tenderSources } from '../content/tenders/sources';
import '../styles/tenders.css';
function ResourceSection({ title, id, soft = false, children }: { title: string; id?: string; soft?: boolean; children: ReactNode }) {
  return <section id={id} className={`lt-tender-resource-section lt-typography-polish ${soft ? 'section-light-connected' : 'section-dark-connected'} py-12 sm:py-14`}>
    <div className="lt-shell"><h2 className="text-3xl font-semibold sm:text-[40px]">{title}</h2><div className="mt-6">{children}</div></div>
  </section>;
}
export function TenderSupportPage({ page }: { page: TenderPage }) {
  useSeo(createTenderSeo(page));
  const sources = [...new Set(['nations', 'transitional', ...page.sections.map(section => section.source).filter(Boolean)])];
  return <article className="lt-tender-page lt-tender-guide" data-tender-page={page.slug}>
    <header className="lt-tender-resource-header section-dark-connected py-12 sm:py-14"><div className="lt-shell">
      <nav aria-label="Breadcrumb" className="lt-tender-breadcrumb"><RouteLink href="/">Home</RouteLink><span>/</span><RouteLink href="/tenders">Tender support</RouteLink><span>/</span><span aria-current="page">{page.h1}</span></nav>
      <p className="section-eyebrow">{page.type === 'sector' ? 'SECTOR PREPARATION' : page.type === 'guide' ? 'PRACTICAL GUIDE' : 'TEMPLATE AND PLANNER'}</p>
      <h1 className="mt-3">{page.h1}</h1><p className="lt-tender-answer mt-5" data-direct-answer>{page.answer}</p>
      <aside className="lt-tender-guidance-note mt-6">This is practical preparation guidance, not personalised legal advice. Use the actual buyer documents and applicable jurisdiction; requirements and terminology can differ across the UK and between current and legacy procurements.</aside>
    </div></header>
    <ResourceSection title="Start with the actual tender" soft>
      <ol className="lt-tender-step-grid lt-restored-gates">{page.steps.map((step, index) => <li className="lt-standard-card light-card p-5" key={step}><span className="section-eyebrow" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p className="mt-3">{step}</p></li>)}</ol>
    </ResourceSection>
    {page.sections.map((section, index) => <ResourceSection key={section.heading} title={section.heading} soft={index % 2 !== 0}>
      <div className="lt-tender-prose space-y-4">{section.paragraphs.map(text => <p key={text}>{text}</p>)}{section.points && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}{section.source && <p className="lt-tender-source"><a href={tenderSources[section.source].url} target="_blank" rel="noopener noreferrer">{tenderSources[section.source].title} ↗</a> — {tenderSources[section.source].scope}</p>}</div>
    </ResourceSection>)}
    <ResourceSection title={page.utility.name} id="worksheet" soft>
      <div className="lt-tender-utility"><p>Use one record for each relevant item. Keep unknowns and approvals visible rather than filling them with assumptions.</p><div className="lt-tender-actions"><a className="lt-button lt-button-primary" href={`/downloads/tenders/${page.slug}.csv`} download>Download blank CSV</a><a className="lt-button lt-button-secondary" href={`/downloads/tenders/${page.slug}.md`} download>Download worksheet</a></div><table><caption>Field guide for the blank worksheet</caption><thead><tr><th scope="col">Field</th><th scope="col">What to record</th></tr></thead><tbody>{page.utility.fields.map((field,index) => <tr key={field}><th scope="row">{field}</th><td>{page.fieldHelp[index]}</td></tr>)}</tbody></table></div>
    </ResourceSection>
    <ResourceSection title="Fictional worked example"><div className="lt-tender-prose space-y-4"><p>{page.example}</p><p>No real customer, live opportunity or contract outcome is described. Do not submit this example as your own evidence.</p></div></ResourceSection>
    <ResourceSection title="Common mistakes" soft><ul className="lt-tender-mistake-grid grid gap-4 md:grid-cols-3">{page.mistakes.map(item => <li className="lt-standard-card light-card p-5" key={item}>{item}</li>)}</ul></ResourceSection>
    <ResourceSection title={`Questions about this ${page.type === 'template' ? 'template' : 'guide'}`}>
      <div className="lt-tender-faq lt-faq">{page.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<ChevronDown size={18} aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div>
    </ResourceSection>
    <ResourceSection title="Source notes and limits" soft>
      <div className="grid gap-4 md:grid-cols-2">{sources.map(id => id ? <div className="lt-standard-card light-card p-5 space-y-3" key={id}><p><a href={tenderSources[id].url} target="_blank" rel="noopener noreferrer">{tenderSources[id].title} ↗</a></p><p>{tenderSources[id].supports} {tenderSources[id].scope}</p><p className="lt-tender-source">Source accessed {tenderSources[id].checkedAt}.</p></div> : null)}</div><p className="mt-5">The checklist, worksheet and fictional examples are original planning aids, not government forms or prescribed submission formats.</p>
    </ResourceSection>
    <ResourceSection title="Continue with related guidance">
      <ul className="lt-tender-related-grid grid gap-4 md:grid-cols-3">{page.related.map(path => { const related=tenderPageByPath.get(path); return related ? <li key={path}><RouteLink className="lt-standard-card light-card p-5" href={path}>{related.h1}<ArrowRight size={16} aria-hidden="true" /></RouteLink></li> : null; })}</ul><RouteLink className="lt-tender-all-resources mt-5" href="/tenders">All tender resources <ArrowRight size={16} aria-hidden="true" /></RouteLink>
    </ResourceSection>
    <ResourceSection title="Need a scoped review?" soft><div className="lt-commercial-card lt-tender-scope-panel p-6"><p>Share the opportunity and deadline. LionTech will confirm fit, available capacity and a written scope before work begins. No award or compliance guarantee.</p><RouteLink className="lt-button lt-button-primary" href={`/tenders?source=${encodeURIComponent(page.slug)}#enquiry`}>Request Tender Support</RouteLink></div></ResourceSection>
  </article>;
}
