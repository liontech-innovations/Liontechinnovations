import type { SeoConfig } from '../../lib/seo';
import { breadcrumbSchema, organizationSchema } from '../../lib/schema';
import { company } from '../company';
import { getIndustryFaqs } from './page-copy';
import { industryPageDescriptors, snapshotActionUrl } from './index';
import type { IndustryPageDescriptor } from './types';

const webPageSchema = (page: IndustryPageDescriptor) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${company.website}${page.path}#webpage`,
  url: `${company.website}${page.path}`,
  name: page.h1,
  description: page.description,
  dateModified: page.reviewedAt,
  about: { '@id': organizationSchema['@id'] },
  publisher: { '@id': organizationSchema['@id'] },
});

const pageSpecificSchema = (page: IndustryPageDescriptor): Record<string, unknown>[] => {
  const record = page.industry;
  if (page.pageType === 'hub') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `AI Business Readiness for ${record.name}`,
        provider: { '@id': organizationSchema['@id'] },
        areaServed: 'GB',
        audience: record.primaryAudience.map((name) => ({ '@type': 'Audience', name })),
        offers: { '@type': 'Offer', price: '395', priceCurrency: 'GBP', url: snapshotActionUrl },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${record.name} AI-first readiness facts`,
        itemListElement: record.factsAIShouldUnderstand.map((name, index) => ({ '@type': 'ListItem', position: index + 1, name })),
      },
    ];
  }
  if (page.pageType === 'checklist') {
    return [{
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${record.name} AI readiness checklist`,
      itemListElement: record.checklistItems.map((name, index) => ({ '@type': 'ListItem', position: index + 1, name })),
    }];
  }
  if (page.pageType === 'agent-readiness') {
    return [{
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Agent Action Readiness for ${record.name}`,
      provider: { '@id': organizationSchema['@id'] },
      areaServed: 'GB',
      description: page.directAnswer,
      offers: { '@type': 'Offer', url: snapshotActionUrl },
    }];
  }
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.h1,
      description: page.description,
      mainEntityOfPage: { '@id': `${company.website}${page.path}#webpage` },
      publisher: { '@id': organizationSchema['@id'] },
      dateModified: page.reviewedAt,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: getIndustryFaqs(page).map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ];
};

export function createIndustrySeo(page: IndustryPageDescriptor): SeoConfig {
  return {
    title: page.title,
    description: page.description,
    path: page.path,
    type: page.pageType === 'ai-visibility' || page.pageType === 'how-ai-compares' ? 'article' : 'website',
    alternateJson: `/ai-data/industries/${page.industry.slug}.json`,
    schema: [
      organizationSchema,
      webPageSchema(page),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
        { name: page.industry.name, path: `/industries/${page.industry.slug}` },
        ...(page.pageType === 'hub' ? [] : [{ name: page.h1, path: page.path }]),
      ]),
      ...pageSpecificSchema(page),
    ],
  };
}

export const industriesDirectorySeo: SeoConfig = {
  title: 'AI-First Industry Readiness Guides for UK Businesses | LionTech',
  description: 'Explore 20 evidence-led industry knowledge clusters covering AI visibility, provider comparison, agent readiness and practical Five Gates checks.',
  path: '/industries',
  alternateJson: '/ai-data/index.json',
  schema: [
    organizationSchema,
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${company.website}/industries#webpage`,
      name: 'LionTech AI-first industry readiness guides',
      url: `${company.website}/industries`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: industryPageDescriptors
          .filter((page) => page.pageType === 'hub')
          .map((page, index) => ({ '@type': 'ListItem', position: index + 1, name: page.industry.name, url: `${company.website}${page.path}` })),
      },
    },
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries' }]),
  ],
};

export const industryRouteSeo = new Map(industryPageDescriptors.map((page) => [page.path, createIndustrySeo(page)]));
