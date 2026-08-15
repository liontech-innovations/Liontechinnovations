import { company } from '../company';
import { industries, industryPageDescriptors, industryPath, snapshotActionUrl } from './index';
import type { IndustryRecord } from './types';

export const programmaticSchemaVersion = '1.0.0';

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
    entity: {
      legalName: company.legalName,
      companyNumber: company.companiesHouseNumber,
      website: company.website,
      location: company.location,
    },
    slug: record.slug,
    name: record.name,
    shortDescription: record.shortDescription,
    fiveGates,
    commonServices: record.commonServices,
    buyerQuestions: record.buyerQuestions,
    trustedSources: record.trustedSources.map(({ label, url, sourceType, supports, reviewedAt }) => ({
      label,
      url,
      sourceType,
      supports,
      reviewedAt,
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
    reviewedAt: record.reviewedAt,
    reviewedBy: record.reviewedBy,
    canonicalPageUrls: industryCanonicalPages(record),
    primaryAction,
  };
}

export function createIndustryIndexRecord() {
  return {
    schemaVersion: programmaticSchemaVersion,
    name: 'LionTech AI-first industry knowledge base',
    description: 'Evidence-led guidance for 20 UK business industries across the Discover, Describe, Trust, Compare and Act gates.',
    entity: {
      legalName: company.legalName,
      companyNumber: company.companiesHouseNumber,
      website: company.website,
      location: company.location,
      registeredOffice: company.registeredOffice.formatted,
    },
    directoryUrl: `${company.website}/industries`,
    primaryAction,
    reviewedAt: industries[0]?.reviewedAt,
    reviewedBy: industries[0]?.reviewedBy,
    industries: industries.map((record) => ({
      slug: record.slug,
      name: record.name,
      group: record.group,
      shortDescription: record.shortDescription,
      dataUrl: `${company.website}/ai-data/industries/${record.slug}.json`,
      canonicalPageUrls: industryCanonicalPages(record),
    })),
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

export const industrySitemapGroups = Array.from({ length: 5 }, (_, index) =>
  industryPageDescriptors.slice(index * 20, (index + 1) * 20),
);

