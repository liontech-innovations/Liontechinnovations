import { company } from '../content/company';
import { snapshotFaq } from '../content/faq';
import { snapshotOffer } from '../content/offers';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  alternateName: company.tradingName,
  url: company.website,
  logo: `${company.website}${company.logo}`,
  description: company.description,
  areaServed: 'GB',
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'Companies House',
    value: company.companiesHouseNumber,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'general',
    email: company.email,
    areaServed: 'GB',
    availableLanguage: 'English',
  },
};

export const snapshotServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: snapshotOffer.name,
  description: snapshotOffer.shortScope,
  provider: organizationSchema,
  areaServed: 'GB',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: '395',
    availability: 'https://schema.org/InStock',
    url: `${company.website}/ai-visibility-snapshot`,
  },
};

export const snapshotFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: snapshotFaq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, company.website).toString(),
    })),
  };
}
