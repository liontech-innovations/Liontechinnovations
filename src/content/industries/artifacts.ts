import { company } from '../company';
import {
  industries,
  industryPageDescriptors,
  industryPageTypes,
  industryPath,
  industrySourceCheckedDate,
  programmaticContentStatus,
  programmaticNoGuaranteeDisclaimer,
  snapshotActionUrl,
} from './index';
import type { IndustryPageType, IndustryRecord } from './types';

export const programmaticSchemaVersion = '1.1.0';
export const sourceManifestUrl = `${company.website}/ai-data/source-manifest.json`;
export const contentReviewManifestUrl = `${company.website}/ai-data/content-review-manifest.json`;
export const releaseCohortManifestUrl = `${company.website}/ai-data/release-cohorts.json`;

export const primaryAction = {
  label: 'Get AI Snapshot',
  url: snapshotActionUrl,
  actionType: 'snapshot-enquiry',
} as const;

export const fiveGates = {
  discover: 'Can a buyer or crawler connect the provider to the relevant service, audience and area served?',
  describe: 'Can the service scope, process and boundaries be explained accurately without filling gaps by assumption?',
  trust: 'Can material facts be checked against current first-party and applicable authoritative evidence?',
  compare: 'Can buyers inspect relevant differences using factual criteria rather than unsupported superlatives?',
  act: 'Can a buyer complete a clear next step with suitable confirmation, escalation and human control?',
} as const;

const entity = {
  legalName: company.legalName,
  companyNumber: company.companiesHouseNumber,
  website: company.website,
  location: company.location,
  companiesHouseUrl: company.companiesHouseUrl,
} as const;

export function industryCanonicalPages(record: IndustryRecord) {
  return {
    hub: `${company.website}${industryPath(record.slug, 'hub')}`,
    aiVisibility: `${company.website}${industryPath(record.slug, 'ai-visibility')}`,
    howAiCompares: `${company.website}${industryPath(record.slug, 'how-ai-compares')}`,
    agentReadiness: `${company.website}${industryPath(record.slug, 'agent-readiness')}`,
    checklist: `${company.website}${industryPath(record.slug, 'checklist')}`,
  };
}

export function createIndustryPublicRecord(record: IndustryRecord) {
  return {
    schemaVersion: programmaticSchemaVersion,
    entity,
    slug: record.slug,
    name: record.name,
    shortDescription: record.shortDescription,
    pageAudience: record.pageAudience,
    endCustomerSegments: record.endCustomerSegments,
    fiveGates,
    commonServices: record.commonServices,
    buyerQuestions: record.buyerQuestions,
    trustedSources: record.trustedSources.map(({ label, url, sourceType, supports, checkedAt }) => ({
      label,
      url,
      sourceType,
      supports,
      checkedAt,
    })),
    factsAIShouldUnderstand: record.factsAIShouldUnderstand,
    commonVisibilityGaps: record.commonVisibilityGaps,
    comparisonCriteria: record.comparisonCriteria,
    trustSignals: record.trustSignals,
    actionPaths: record.actionPaths,
    agentReadinessOpportunities: record.agentReadinessOpportunities,
    automationBoundaries: record.automationBoundaries,
    structuredDataRecommendations: record.structuredDataRecommendations,
    riskNotes: record.riskAndClaimsNotes,
    sourceCheckedAt: record.sourceCheckedAt,
    contentReviewStatus: programmaticContentStatus,
    disclaimer: programmaticNoGuaranteeDisclaimer,
    sourceManifestUrl,
    contentReviewManifestUrl,
    releaseCohortManifestUrl,
    canonicalPageUrls: industryCanonicalPages(record),
    primaryAction,
  };
}

export function createIndustryIndexRecord() {
  return {
    schemaVersion: programmaticSchemaVersion,
    name: 'LionTech AI-first industry knowledge base',
    description: 'Evidence-led guidance for 20 UK business industries across the Discover, Describe, Trust, Compare and Act gates.',
    entity,
    directoryUrl: `${company.website}/industries`,
    primaryAction,
    sourceCheckedAt: industrySourceCheckedDate,
    contentReviewStatus: programmaticContentStatus,
    disclaimer: programmaticNoGuaranteeDisclaimer,
    sourceManifestUrl,
    contentReviewManifestUrl,
    releaseCohortManifestUrl,
    industries: industries.map((record) => ({
      slug: record.slug,
      name: record.name,
      group: record.group,
      shortDescription: record.shortDescription,
      pageAudience: record.pageAudience,
      endCustomerSegments: record.endCustomerSegments,
      dataUrl: `${company.website}/ai-data/industries/${record.slug}.json`,
      canonicalPageUrls: industryCanonicalPages(record),
    })),
  };
}

export function createIndustrySourceManifest() {
  const sources = new Map<string, {
    label: string;
    url: string;
    sourceType: IndustryRecord['trustedSources'][number]['sourceType'];
    supports: Set<string>;
    industries: Set<string>;
    checkedAt: string;
  }>();

  for (const record of industries) {
    for (const source of record.trustedSources) {
      const existing = sources.get(source.url) ?? {
        label: source.label,
        url: source.url,
        sourceType: source.sourceType,
        supports: new Set<string>(),
        industries: new Set<string>(),
        checkedAt: source.checkedAt,
      };
      source.supports.forEach((item) => existing.supports.add(item));
      existing.industries.add(record.slug);
      sources.set(source.url, existing);
    }
  }

  const records = [...sources.values()]
    .map((source) => ({
      label: source.label,
      url: source.url,
      sourceType: source.sourceType,
      supports: [...source.supports].sort(),
      industries: [...source.industries].sort(),
      checkedAt: source.checkedAt,
    }))
    .sort((left, right) => left.url.localeCompare(right.url));

  return {
    schemaVersion: programmaticSchemaVersion,
    status: 'source-reference-checks-only-not-a-provider-audit',
    checkedAt: industrySourceCheckedDate,
    sourceCount: records.length,
    sources: records,
  };
}

export function createContentReviewManifest() {
  return {
    schemaVersion: programmaticSchemaVersion,
    status: programmaticContentStatus,
    approvedRouteCount: 0,
    pendingRouteCount: industryPageDescriptors.length,
    routes: industryPageDescriptors.map((page) => ({
      path: page.path,
      pageType: page.pageType,
      approvalStatus: 'pending',
      sourceCheckedAt: page.sourceCheckedAt,
    })),
  };
}

const cohortDefinitions: Array<{ id: string; pageType: IndustryPageType; label: string }> = [
  { id: '01-industry-hubs', pageType: 'hub', label: 'Industry hubs' },
  { id: '02-ai-visibility', pageType: 'ai-visibility', label: 'AI visibility guides' },
  { id: '03-provider-comparison', pageType: 'how-ai-compares', label: 'Provider comparison guides' },
  { id: '04-agent-readiness', pageType: 'agent-readiness', label: 'Agent readiness guides' },
  { id: '05-readiness-checklists', pageType: 'checklist', label: 'Readiness checklists' },
];

export const industryReleaseCohorts = cohortDefinitions.map((cohort, index) => ({
  ...cohort,
  sitemapFile: `sitemap-industries-${index + 1}.xml`,
  releaseStatus: programmaticContentStatus,
  routes: industryPageDescriptors.filter((page) => page.pageType === cohort.pageType).map((page) => page.path),
}));

if (industryReleaseCohorts.length !== industryPageTypes.length || industryReleaseCohorts.some((cohort) => cohort.routes.length !== 20)) {
  throw new Error('Programmatic release cohorts must map five page types to 20 routes each');
}

export function createReleaseCohortManifest() {
  return {
    schemaVersion: programmaticSchemaVersion,
    status: programmaticContentStatus,
    cohortCount: industryReleaseCohorts.length,
    routeCount: industryReleaseCohorts.reduce((total, cohort) => total + cohort.routes.length, 0),
    cohorts: industryReleaseCohorts,
  };
}

export const coreSitemapRoutes = [
  '/',
  '/ai-visibility-snapshot',
  '/ai-business-readiness',
  '/readiness-fix-sprint',
  '/monitoring',
  '/company-brain',
  '/methodology',
  '/about',
  '/contact',
  '/uk-ai-infrastructure',
  '/saas-platform-development',
  '/ai-intake-systems',
  '/lead-recovery',
  '/careops/lost-enquiry-recovery',
  '/careops/command-centre',
  '/privacy-policy',
  '/terms-and-conditions',
  '/industries',
] as const;

export const industrySitemapGroups = industryReleaseCohorts.map((cohort) => (
  cohort.routes.map((route) => industryPageDescriptors.find((page) => page.path === route)!)
));
