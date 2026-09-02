import { company } from './company';
import { zimbabweIndustryPath, zimbabweIndustries, type ZimbabweIndustry } from './zimbabweIndustries';
import { breadcrumbSchema, zimbabweOrganizationSchema, zimbabweServiceSchema } from '../lib/schema';
import type { SeoConfig } from '../lib/seo';

export function createZimbabweIndustrySeo(industry: ZimbabweIndustry): SeoConfig {
  const path = zimbabweIndustryPath(industry.slug);
  return {
    title: industry.seoTitle, description: industry.metaDescription, path,
    image: { path: '/assets/zimbabwe/zimbabwe-og.png', width: 1200, height: 630, type: 'image/png', alt: 'LionTech Zimbabwe corporate AI and digital modernisation' },
    schema: [
      zimbabweOrganizationSchema,
      { ...zimbabweServiceSchema, '@id': `${company.website}${path}#service`, serviceType: `AI and digital readiness for ${industry.title}`, audience: { '@type': 'BusinessAudience', audienceType: industry.title } },
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Zimbabwe', path: '/zimbabwe' }, { name: industry.title, path }]),
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: industry.faq.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
    ],
  };
}
export const zimbabweIndustrySeo = new Map(zimbabweIndustries.map(industry => [zimbabweIndustryPath(industry.slug), createZimbabweIndustrySeo(industry)]));
