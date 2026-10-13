import { RouteLink } from '../components/ui/RouteLink';
import { useSeo } from '../lib/seo';
import { createTenderSeo } from '../content/tenders/seo';
import { tenderPageByPath, type TenderPage } from '../content/tenders';
import { tenderSources } from '../content/tenders/sources';
import '../styles/tenders.css';
export function TenderSupportPage({ page }: { page: TenderPage }) {
  useSeo(createTenderSeo(page));
  const sources = [...new Set(page.sections.map(section => section.source).filter(Boolean))];
  return <article className="lt-tender-page lt-tender-guide" data-tender-page={page.slug}>
    <div className="lt-shell lt-tender-reading">
      <nav aria-label="Breadcrumb" className="lt-tender-breadcrumb"><RouteLink href="/">Home</RouteLink><span>/</span><RouteLink href="/tenders">Tender support</RouteLink><span>/</span><span aria-current="page">{page.h1}</span></nav>
      <p className="lt-kicker">{page.type === 'sector' ? 'SECTOR PREPARATION' : page.type === 'guide' ? 'PRACTICAL GUIDE' : 'TEMPLATE AND PLANNER'}</p>
      <h1>{page.h1}</h1><p className="lt-tender-answer" data-direct-answer>{page.answer}</p>
      <aside className="lt-tender-review">Editorial review pending · Cohort {page.cohort}. This is practical preparation guidance, not personalised legal advice. Use the actual buyer documents and applicable jurisdiction; requirements and terminology can differ across the UK and between current and legacy procurements.</aside>
      <section><h2>Start with the actual tender</h2><ol>{page.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
      {page.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}{section.points && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}{section.source && <p className="lt-tender-source"><a href={tenderSources[section.source].url} target="_blank" rel="noopener noreferrer">{tenderSources[section.source].title} ↗</a> — {tenderSources[section.source].scope}</p>}</section>)}
      <section className="lt-tender-utility" aria-labelledby="tender-utility-title"><h2 id="tender-utility-title">{page.utility.name}</h2><p>Use one record for each relevant item. Keep unknowns and approvals visible rather than filling them with assumptions.</p><div className="lt-tender-actions"><a className="lt-button lt-button-primary" href={`/downloads/tenders/${page.slug}.csv`} download>Download blank CSV</a><a className="lt-button lt-tender-outline" href={`/downloads/tenders/${page.slug}.md`} download>Download worksheet</a></div><table><caption>Field guide for the blank worksheet</caption><thead><tr><th scope="col">Field</th><th scope="col">What to record</th></tr></thead><tbody>{page.utility.fields.map((field,index) => <tr key={field}><th scope="row">{field}</th><td>{page.fieldHelp[index]}</td></tr>)}</tbody></table></section>
      <section><h2>Fictional worked example</h2><p>{page.example}</p><p>No real customer, live opportunity or contract outcome is described. Do not submit this example as your own evidence.</p></section>
      <section><h2>Common mistakes</h2><ul>{page.mistakes.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className="lt-tender-faq"><h2>Questions about this {page.type === 'template' ? 'template' : 'guide'}</h2>{page.faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
      <section><h2>Source notes and limits</h2>{sources.map(id => id ? <div key={id}><p><a href={tenderSources[id].url} target="_blank" rel="noopener noreferrer">{tenderSources[id].title} ↗</a></p><p>{tenderSources[id].supports} {tenderSources[id].scope} Source accessed {tenderSources[id].checkedAt}; this is not editorial approval.</p></div> : null)}<p>The checklist, worksheet and fictional examples are original planning aids, not government forms or prescribed submission formats.</p></section>
      <section><h2>Continue with related guidance</h2><ul>{page.related.map(path => { const related=tenderPageByPath.get(path); return related ? <li key={path}><RouteLink href={path}>{related.h1}</RouteLink></li> : null; })}</ul><RouteLink href="/tenders">All tender resources</RouteLink></section>
      <section><h2>Need a scoped review?</h2><p>Share the public opportunity and deadline. LionTech will confirm fit, available capacity and a written scope before requesting payment. No award or compliance guarantee.</p><RouteLink className="lt-button lt-button-primary" href={`/tenders?source=${encodeURIComponent(page.slug)}#enquiry`}>Discuss this tender</RouteLink></section>
    </div>
  </article>;
}
