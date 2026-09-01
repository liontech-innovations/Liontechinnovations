import type { SeoConfig } from '../lib/seo';
import {
  breadcrumbSchema,
  contactPageSchema,
  organizationSchema,
  snapshotFaqSchema,
  snapshotServiceSchema,
  zimbabweOrganizationSchema,
  zimbabweServiceSchema,
  zimbabweFaqSchema,
} from '../lib/schema';
import { company } from './company';
import { companyBrainOffer, fixSprintOffer, monitoringOffer, snapshotOffer } from './offers';
import { zimbabwe } from './zimbabwe';

const withOrganization = (...schemas: Array<Record<string, unknown>>) => [organizationSchema, ...schemas];

export const routeSeo = {
  '/zimbabwe': {
    title: zimbabwe.seoTitle,
    description: zimbabwe.seoDescription,
    path: '/zimbabwe',
    image: { path: '/assets/zimbabwe/zimbabwe-og.png', width: 1200, height: 630, type: 'image/png', alt: 'LionTech Zimbabwe: Corporate AI & Digital Modernisation. UK Registered · Zimbabwe Focus.' },
    schema: [zimbabweOrganizationSchema, zimbabweServiceSchema, zimbabweFaqSchema, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Zimbabwe', path: '/zimbabwe' }])],
  },
  '/': {
    title: 'LionTech AI Business Readiness | See What AI Says About Your Business',
    description: company.description,
    path: '/',
    schema: withOrganization(snapshotServiceSchema),
  },
  '/ai-business-readiness': {
    title: 'AI Business Readiness Services | LionTech Innovations',
    description: 'A practical path from AI visibility evidence to priority fixes, monitoring, agent actions and a relationship-led Company Brain.',
    path: '/ai-business-readiness',
    schema: withOrganization(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'AI Business Readiness', path: '/ai-business-readiness' }])),
  },
  '/ai-visibility-snapshot': {
    title: 'AI Visibility Snapshot | LionTech Innovations',
    description: 'See how leading AI systems describe, compare and surface your business, with evidence and a practical 30-day action plan.',
    path: '/ai-visibility-snapshot',
    schema: withOrganization(
      snapshotServiceSchema,
      snapshotFaqSchema,
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: snapshotOffer.name, path: '/ai-visibility-snapshot' }]),
    ),
  },
  '/readiness-fix-sprint': {
    title: 'Readiness Fix Sprint | LionTech Innovations',
    description: 'Implement up to five agreed AI readiness fixes within a defined 10-business-day delivery cap.',
    path: '/readiness-fix-sprint',
    schema: withOrganization(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: fixSprintOffer.name, path: '/readiness-fix-sprint' }])),
  },
  '/monitoring': {
    title: 'AI Visibility Monitoring | LionTech Innovations',
    description: 'Track agreed priority AI buyer questions, factual changes and competitor movement with a concise monthly report.',
    path: '/monitoring',
    schema: withOrganization(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: monitoringOffer.name, path: '/monitoring' }])),
  },
  '/company-brain': {
    title: 'Company Brain | LionTech Innovations',
    description: 'A relationship-led operating layer for persistent knowledge, SOPs, decisions, approved workflows and role-scoped access.',
    path: '/company-brain',
    schema: withOrganization(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: companyBrainOffer.name, path: '/company-brain' }])),
  },
  '/methodology': {
    title: 'Five Gates AI Readiness Methodology | LionTech Innovations',
    description: 'Discover, Describe, Trust, Compare and Act: a human-reviewed framework for practical AI Business Readiness.',
    path: '/methodology',
    schema: withOrganization(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Methodology', path: '/methodology' }])),
  },
  '/about': {
    title: 'About Lion Tech Innovations Ltd | Manchester, UK',
    description: `${company.legalName} is a Manchester-based AI Business Readiness and production systems company serving UK businesses remotely.`,
    path: '/about',
    schema: withOrganization(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])),
  },
  '/contact': {
    title: 'Request an AI Visibility Snapshot | LionTech',
    description: 'Send Lion Tech Innovations Ltd the minimum business details needed to review a founding AI Visibility Snapshot request.',
    path: '/contact',
    schema: withOrganization(contactPageSchema, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])),
  },
} satisfies Record<string, SeoConfig>;

export type MarketingRoutePath = keyof typeof routeSeo;
