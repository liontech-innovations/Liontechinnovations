import { PageHero, RouteSection } from '../components/sections/RoutePageSections';
import { RouteLink } from '../components/ui/RouteLink';
import { createResearchSeo, researchArticles, type ResearchArticle } from '../content/research';
import { useSeo } from '../lib/seo';
import '../styles/research.css';

function CitedText({text}: {text:string}) {
  return <>{text.split(/(\[\d+\])/g).map((part,index)=>/^\[\d+\]$/.test(part)
    ? <a className="lt-research-citation" href={`#source-${part.slice(1,-1)}`} aria-label={`Source ${part.slice(1,-1)}`} key={index}>{part}</a>
    : part)}</>;
}
export function ResearchArticlePage({article}: {article:ResearchArticle}) {
  useSeo(createResearchSeo(article));
  return <>
    <PageHero eyebrow={article.category.toUpperCase()} title={article.title} description={article.description} compact>
      <RouteLink href="/research" className="lt-button lt-button-secondary">All research</RouteLink>
    </PageHero>
    <RouteSection className="lt-research-article-section">
      <article className="lt-research-article">
        <p className="lt-research-meta"><RouteLink href="/about">{article.byline}</RouteLink><br />Published <time dateTime={article.publishedAt}>12 November 2026</time> · Reviewed 12 November 2026 · {article.readingMinutes} min read</p>
        <aside className="lt-research-note" aria-label="Publication context">{article.publicationNote}</aside>
        <p className="lt-research-intro">{article.intro}</p>
        <nav className="lt-research-contents" aria-label="Article contents"><h2>In this guide</h2><ol>{article.sections.map((section,index)=><li key={section.heading}><a href={`#section-${index+1}`}>{section.heading}</a></li>)}</ol></nav>
        {article.sections.map((section,index)=><section className="lt-research-section" id={`section-${index+1}`} key={section.heading}>
          <h2>{section.heading}</h2>{section.paragraphs.map((text,i)=><p key={i}><CitedText text={text} /></p>)}
          {section.bullets && <ul>{section.bullets.map(item=><li key={item}>{item}</li>)}</ul>}
        </section>)}
        <section className="lt-research-evidence" aria-labelledby="research-evidence"><h2 id="research-evidence">Inspect the evidence</h2><p>Public records only. The audit is a dated sample; the payment tests use synthetic data.</p><ul>{article.evidence.map(item=><li key={item.url}><a href={item.url} download>{item.label}</a></li>)}</ul></section>
        <section className="lt-research-sources" aria-labelledby="research-sources"><h2 id="research-sources">Sources</h2><p>Source links checked on 12 November 2026.</p><ol>{article.sources.map((source,index)=><li id={`source-${index+1}`} key={source.url}><a href={source.url}>{source.label}</a></li>)}</ol></section>
        <div className="lt-research-next"><RouteLink className="lt-button lt-button-primary" href={article.ctaHref}>{article.ctaLabel}</RouteLink><h2>Continue reading</h2>{researchArticles.filter(item=>item.slug!==article.slug).map(item=><RouteLink href={item.path} key={item.slug}>{item.title}</RouteLink>)}</div>
      </article>
    </RouteSection>
  </>;
}
