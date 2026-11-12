import { ArrowRight, FileCheck2, FlaskConical } from 'lucide-react';
import { PageHero, RouteSection } from '../components/sections/RoutePageSections';
import { RouteLink } from '../components/ui/RouteLink';
import { researchArticles, researchHubSeo } from '../content/research';
import { useSeo } from '../lib/seo';
import '../styles/research.css';

export function ResearchPage() {
  useSeo(researchHubSeo);
  return <>
    <PageHero eyebrow="RESEARCH & PRACTICAL GUIDES" title="Useful answers. Evidence you can inspect." description="We publish original technical checks, reproducible experiments and practical guides for businesses building dependable digital systems." compact />
    <RouteSection className="lt-research-index">
      <div className="lt-research-cards">{researchArticles.map((article,index)=><article className="lt-standard-card lt-research-card" key={article.slug}>
        {index === 0 ? <FileCheck2 size={30} aria-hidden="true" /> : <FlaskConical size={30} aria-hidden="true" />}
        <p className="lt-kicker">{article.category}</p>
        <h2><RouteLink href={article.path}>{article.title}</RouteLink></h2>
        <p>{article.description}</p>
        <p className="lt-research-meta"><time dateTime={article.publishedAt}>12 November 2026</time> · {article.readingMinutes} min read</p>
        <RouteLink href={article.path} className="lt-research-read">Read the research <ArrowRight size={16} aria-hidden="true" /></RouteLink>
      </article>)}</div>
      <div className="lt-research-standards"><h2>Our evidence standard</h2><p>We separate observed results from assumptions, link to original sources and explain the limits of each test. Our own publications and company profiles are not independent endorsements. We do not promise search rankings or AI recommendations.</p><RouteLink href="/methodology">Read our methodology</RouteLink></div>
    </RouteSection>
  </>;
}
