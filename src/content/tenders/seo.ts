import type { SeoConfig } from '../../lib/seo';
import { organizationSchema, breadcrumbSchema } from '../../lib/schema';
import { company } from '../company';
import { isTenderPublished, tenderHubReview, tendersPreview, type TenderPage } from './index';
const image = { path: '/assets/tenders/tender-hero-meeting-1672.webp', width: 1672, height: 941, type: 'image/webp', alt: 'AI-generated illustration of professionals reviewing documents; not LionTech staff or premises.' };
export const tenderHubSeo: SeoConfig = {
  title: 'UK Tender Support & Bid Preparation | LionTech Innovations',
  description: 'Evidence-led tender support for UK SMEs. Organise requirements and proof and prepare a clearer response with AI assistance and human review.',
  path: '/tenders', image, robots: tendersPreview || !isTenderPublished(tenderHubReview) ? 'noindex,follow' : 'index,follow',
  schema: [organizationSchema, { '@context': 'https://schema.org', '@type': 'Service', name: 'LionTech tender support', provider: { '@id': organizationSchema['@id'] }, areaServed: 'GB', url: `${company.website}/tenders`, description: 'Independent evidence-led tender preparation with AI assistance, human review and client approval. No award guarantees.' }, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Tender support', path: '/tenders' }])],
};
export function createTenderSeo(page: TenderPage): SeoConfig {
  return { title: page.title, description: page.description, path: page.path, image,
    type: page.type === 'guide' ? 'article' : 'website',
    robots: tendersPreview || !isTenderPublished(page) ? 'noindex,follow' : 'index,follow',
    schema: [organizationSchema, { '@context': 'https://schema.org', '@type': page.type === 'guide' ? 'Article' : 'WebPage', name: page.h1, headline: page.h1, description: page.description, url: `${company.website}${page.path}`, dateModified: page.updatedAt, inLanguage: 'en-GB', publisher: { '@id': organizationSchema['@id'] } }, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Tender support', path: '/tenders' }, { name: page.h1, path: page.path }])],
  };
}
