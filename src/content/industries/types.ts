export const industryPageTypes = ['hub', 'ai-visibility', 'how-ai-compares', 'agent-readiness', 'checklist'] as const;

export type IndustryPageType = (typeof industryPageTypes)[number];
export type FiveGateIntent = 'discover' | 'describe' | 'trust' | 'compare' | 'act';

export type IndustrySource = {
  label: string;
  url: string;
  sourceType:
    | 'regulator'
    | 'government'
    | 'professional-body'
    | 'official-directory'
    | 'technical-standard'
    | 'primary-industry-source';
  supports: string[];
  checkedAt: string;
};
export type BuyerQuestion = {
  intent: FiveGateIntent;
  question: string;
  whyItMatters: string;
};

export type IndustryRecord = {
  slug: string;
  name: string;
  singularName: string;
  group: 'Health and care' | 'Professional and financial services' | 'Business services' | 'Local and home services';
  shortDescription: string;
  pageAudience: string[];
  endCustomerSegments: string[];
  decisionMakers: string[];
  commonServices: string[];
  buyerQuestions: BuyerQuestion[];
  trustedSources: IndustrySource[];
  regulatorsOrBodies: string[];
  factsAIShouldUnderstand: string[];
  commonVisibilityGaps: string[];
  comparisonCriteria: string[];
  trustSignals: string[];
  actionPaths: string[];
  agentReadinessOpportunities: string[];
  automationBoundaries: string[];
  structuredDataRecommendations: string[];
  riskAndClaimsNotes: string[];
  snapshotChecks: string[];
  checklistItems: string[];
  relatedIndustries: string[];
  primaryCTA: 'snapshot';
  sourceCheckedAt: string;
};

export type IndustrySeed = {
  slug: IndustryRecord['slug'];
  name: string;
  singularName: string;
  group: IndustryRecord['group'];
  shortDescription: string;
  pageAudience: [string, string, string];
  decisionMakers: [string, string, string];
  commonServices: [string, string, string, string, string, string, string, string];
  buyerConcerns: [string, string, string, string, string, string];
  actionPaths: [string, string, string, string];
  automationBoundaries: [string, string, string];
  trustedSources: [IndustrySource, IndustrySource, IndustrySource, IndustrySource];
  relatedIndustries: [string, string, string];
};

export type IndustryPageDescriptor = {
  industry: IndustryRecord;
  pageType: IndustryPageType;
  path: string;
  title: string;
  description: string;
  h1: string;
  directAnswer: string;
  introduction: string;
  sourceCheckedAt: string;
};
