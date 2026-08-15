import { industrySeeds } from './catalog';
import { industryPageTypes } from './types';
import type {
  BuyerQuestion,
  FiveGateIntent,
  IndustryPageDescriptor,
  IndustryPageType,
  IndustryRecord,
  IndustrySeed,
} from './types';

export * from './types';

export const industryReviewDate = '2026-08-15';
export const industryReviewer = 'Lion Tech Innovations Ltd';
export const snapshotActionPath = '/contact#snapshot-enquiry';
export const snapshotActionUrl = `https://liontechinnovations.co.uk${snapshotActionPath}`;

const gateLabels: Record<FiveGateIntent, string> = {
  discover: 'Discover',
  describe: 'Describe',
  trust: 'Trust',
  compare: 'Compare',
  act: 'Act',
};

const question = (intent: FiveGateIntent, text: string, whyItMatters: string): BuyerQuestion => ({
  intent,
  question: text,
  whyItMatters,
});

function createBuyerQuestions(seed: IndustrySeed): BuyerQuestion[] {
  const [serviceA, serviceB, serviceC, serviceD] = seed.commonServices;
  const [concernA, concernB, concernC, concernD, concernE, concernF] = seed.buyerConcerns;
  const [actionA, actionB, actionC, actionD] = seed.actionPaths;

  return [
    question('discover', `Which ${seed.name.toLowerCase()} provide ${serviceA} for ${seed.primaryAudience[0]}?`, `The answer depends on explicit service, audience and location information rather than a broad industry label.`),
    question('discover', `Where can a buyer find a ${seed.singularName} offering ${serviceB} and ${serviceC}?`, `AI systems need a crawlable connection between the service, the provider entity and the area actually served.`),
    question('describe', `Does this ${seed.singularName} clearly explain ${concernA}?`, `A precise answer prevents an AI summary from filling gaps with assumptions or outdated third-party text.`),
    question('describe', `What should a customer expect when asking about ${serviceD}?`, `Scope, process and boundaries should be visible before a buyer shares detailed information.`),
    question('trust', `Which official evidence supports ${concernB}?`, `Public registers and first-party facts should agree so that a buyer can verify rather than merely trust a marketing claim.`),
    question('trust', `How does the provider evidence ${concernC}?`, `Named sources, responsible people and current policies create a traceable trust path.`),
    question('compare', `How should buyers compare providers on ${concernD}?`, `Comparable facts help buyers distinguish genuine service differences without relying on unverified superlatives.`),
    question('compare', `What makes one provider clearer than another about ${concernE}?`, `Completeness, freshness and evidence are safer comparison signals than promotional volume.`),
    question('act', `Can a buyer ${actionA} or ${actionB} without searching across several pages?`, `The next step should be explicit, accessible and connected to the relevant service context.`),
    question('act', `What information is needed to ${actionC} or ${actionD}?`, `A structured action route reduces avoidable back-and-forth while preserving human approval where it matters.`),
  ];
}

function expandSeed(seed: IndustrySeed): IndustryRecord {
  const bodies = seed.trustedSources.map((item) => item.label);
  const [serviceA, serviceB, serviceC, serviceD, serviceE, serviceF, serviceG, serviceH] = seed.commonServices;
  const [concernA, concernB, concernC, concernD, concernE, concernF] = seed.buyerConcerns;
  const [actionA, actionB, actionC, actionD] = seed.actionPaths;

  const factsAIShouldUnderstand = [
    `${seed.name} may offer different combinations of ${serviceA}, ${serviceB} and ${serviceC}; a provider should state its actual scope rather than rely on the industry category alone.`,
    `The primary audiences commonly include ${seed.primaryAudience.join(', ')}, but each provider should identify the customers it is equipped and willing to serve.`,
    `Responsibility may sit with a ${seed.decisionMakers.join(', or a ')}, so named roles and contact ownership help a buyer understand who is accountable.`,
    `${bodies[0]} is a relevant public evidence source for ${seed.trustedSources[0].supports[0]}.`,
    `${bodies[1]} can support verification of ${seed.trustedSources[1].supports[0]}.`,
    `A useful description separates ${serviceD} and ${serviceE} from adjacent services that may require different expertise, evidence or approval.`,
    `The action journey should make it clear how to ${actionA}, how to ${actionB}, and when a human will review the request.`,
    `Public information should address ${concernF} without implying that a generic web answer replaces case-specific professional judgement.`,
  ];

  const commonVisibilityGaps = seed.buyerConcerns.map((concern, index) =>
    `A buyer cannot confirm ${concern} because the website, directory profile and action page use ${index % 2 === 0 ? 'different wording' : 'incomplete or undated details'}.`,
  );

  const comparisonCriteria = [
    `Relevant service fit across ${serviceA}, ${serviceB} and ${serviceC}`,
    `Clarity about ${concernA}`,
    `Verifiable evidence from ${bodies[0]} or another applicable official source`,
    `Transparent explanation of ${concernD}`,
    `A usable route to ${actionA}`,
    `Responsible boundaries for ${concernF}`,
  ];

  const trustSignals = [
    `A current, matching record or guidance reference from ${bodies[0]}`,
    `A relevant verification route through ${bodies[1]}`,
    `Consistent provider, location and service facts alongside ${bodies[2]}`,
    `Careful use of claims supported by ${bodies[3]}`,
    `Named responsible people or roles for ${serviceF} and ${serviceG}`,
    `Visible terms, privacy information and a clear process to ${actionB}`,
  ];

  const agentReadinessOpportunities = [
    `Collect the minimum structured facts needed to ${actionA}, then pass the request to the responsible human.`,
    `Route enquiries about ${serviceD} and ${serviceE} to the correct team without presenting a final professional judgement.`,
    `Check that location, availability and service-scope fields are complete before allowing a buyer to ${actionC}.`,
    `Acknowledge a request to ${actionD}, provide the next expected step and preserve an auditable handoff.`,
  ];

  const structuredDataRecommendations = [
    `Use Organization and WebSite identity consistently for the legal provider and canonical domain.`,
    `Describe ${serviceA}, ${serviceD} and ${serviceH} with visible Service information only where the provider genuinely offers them.`,
    `Use LocalBusiness or a justified subtype only when address, service area and public contact details match the visible page.`,
    `Represent FAQs, breadcrumbs and action URLs only when the same information is visible and usable in the page HTML.`,
  ];

  const snapshotChecks = [
    `Check whether AI can connect the provider name with ${serviceA}.`,
    `Compare the website's account of ${concernA} with public directory descriptions.`,
    `Verify that ${bodies[0]} evidence is linked or accurately referenced where applicable.`,
    `Check consistency of ${concernB} across the website and ${bodies[1]}.`,
    `Test buyer questions about ${serviceD} and ${serviceE}.`,
    `Inspect whether ${concernC} is stated with enough context to avoid a misleading summary.`,
    `Review how the business explains ${concernD} without unsupported superiority claims.`,
    `Follow the route to ${actionA} on desktop and mobile.`,
    `Confirm that a buyer can ${actionC} without encountering contradictory facts.`,
    `Record where ${concernF} requires human clarification or approval.`,
  ];

  const checklistItems = [
    `Discover: publish a crawlable page connecting the business to ${serviceA}.`,
    `Discover: state the genuine service area and customer groups for ${serviceB}.`,
    `Discover: keep the provider name and location consistent with ${bodies[0]}.`,
    `Discover: link the industry hub to a working route for ${actionA}.`,
    `Describe: distinguish ${serviceC} from ${serviceD}.`,
    `Describe: answer the buyer concern about ${concernA}.`,
    `Describe: identify the responsible role for ${serviceE}.`,
    `Describe: publish the limits that apply to ${concernF}.`,
    `Trust: reference ${bodies[0]} only where it genuinely applies.`,
    `Trust: reconcile public facts with ${bodies[1]}.`,
    `Trust: show when information about ${concernB} was last reviewed.`,
    `Trust: provide privacy, complaints or safeguarding routes relevant to the service.`,
    `Compare: make ${concernC} explicit and factual.`,
    `Compare: explain ${concernD} without unverifiable best-in-market language.`,
    `Compare: separate ${serviceF} from ${serviceG} so buyers can compare like with like.`,
    `Compare: make fees, availability or engagement conditions clear where appropriate.`,
    `Act: test the route to ${actionA}.`,
    `Act: state the information needed to ${actionB}.`,
    `Act: preserve human approval before ${actionC} becomes a commitment.`,
    `Act: confirm that ${actionD} works with keyboard, mobile and assistive technology.`,
  ];

  return {
    ...seed,
    buyerQuestions: createBuyerQuestions(seed),
    regulatorsOrBodies: bodies,
    factsAIShouldUnderstand,
    commonVisibilityGaps,
    comparisonCriteria,
    trustSignals,
    actionPaths: [...seed.actionPaths],
    agentReadinessOpportunities,
    automationBoundaries: [...seed.automationBoundaries],
    structuredDataRecommendations,
    riskAndClaimsNotes: [
      `${seed.name} guidance on this site is general information, not professional advice about a particular business or customer.`,
      seed.automationBoundaries[0],
      `LionTech does not guarantee search rankings, AI recommendations, ${concernE}, or future model behaviour.`,
    ],
    snapshotChecks,
    checklistItems,
    relatedIndustries: [...seed.relatedIndustries],
    primaryCTA: 'snapshot',
    reviewedAt: industryReviewDate,
    reviewedBy: industryReviewer,
  };
}

export const industries = industrySeeds.map(expandSeed);
export const industriesBySlug = new Map(industries.map((industry) => [industry.slug, industry]));

const pageSuffix: Record<IndustryPageType, string> = {
  hub: '',
  'ai-visibility': '/ai-visibility',
  'how-ai-compares': '/how-ai-compares',
  'agent-readiness': '/agent-readiness',
  checklist: '/checklist',
};

export function industryPath(slug: string, pageType: IndustryPageType) {
  return `/industries/${slug}${pageSuffix[pageType]}`;
}

const openingPatterns = [
  'A buyer rarely starts with the provider’s preferred terminology.',
  'Public facts become useful only when a buyer can verify and act on them.',
  'AI-assisted discovery exposes gaps that ordinary navigation can conceal.',
  'A strong local reputation does not automatically become a clear machine-readable identity.',
  'The practical question is not whether a business uses AI internally.',
  'Trust begins before the first call, form or appointment request.',
  'Comparison systems need more than a category label and a postcode.',
  'A provider can be excellent operationally and still be described poorly online.',
  'The safest AI-first strategy begins with accurate public information.',
  'Customers increasingly move between search, maps, directories and AI answers.',
  'A useful industry page should reduce uncertainty rather than repeat marketing slogans.',
  'Buyer intent is specific even when the first query looks broad.',
  'Evidence has to travel with the claim if a third-party system is expected to trust it.',
  'Being findable is only the first step in a credible customer journey.',
  'Actionable information connects service detail with a responsible next step.',
  'Official records and first-party pages answer different parts of the same question.',
  'An AI summary is only as reliable as the public facts available to ground it.',
  'Businesses lose clarity when service, trust and contact information drift apart.',
  'The most useful comparison criteria are factual, current and relevant to the buyer.',
  'Machine readability matters because human buyers also benefit from structured clarity.',
];

function descriptorText(industry: IndustryRecord, pageType: IndustryPageType, industryIndex: number) {
  const [serviceA, serviceB, serviceC, serviceD] = industry.commonServices;
  const [concernA, concernB, concernC, concernD] = industry.comparisonCriteria;
  const [sourceA, sourceB] = industry.trustedSources;
  const [actionA, actionB] = industry.actionPaths;
  const opening = openingPatterns[industryIndex];

  const titles: Record<IndustryPageType, string> = {
    hub: `AI-First Readiness for ${industry.name}: Services, Evidence and Action | LionTech`,
    'ai-visibility': `${industry.name} AI Visibility: ${sourceA.label}, Service Facts and Buyer Questions | LionTech`,
    'how-ai-compares': `How AI Compares ${industry.name}: ${concernA} and Trust Evidence | LionTech`,
    'agent-readiness': `${industry.name} Agent Readiness: Enquiries, Human Approval and ${actionA} | LionTech`,
    checklist: `${industry.name} AI Readiness Checklist: ${serviceA}, Evidence and Action | LionTech`,
  };
  const descriptions: Record<IndustryPageType, string> = {
    hub: `${industry.name}: clarify ${serviceA}, ${serviceD} and ${concernB.toLowerCase()}; verify ${sourceA.supports[0]} through ${sourceA.label}; assign ${industry.decisionMakers[1]} ownership for ${actionA}. The review is framed for ${industry.primaryAudience[1]}.`,
    'ai-visibility': `${industry.name}: test retrieval of ${serviceB}; reconcile ${sourceA.supports[0]}; explain ${concernB.toLowerCase()}; direct ${industry.primaryAudience[2]} towards ${actionA}. Separate ${industry.commonServices[5]} from ${industry.commonServices[6]}.`,
    'how-ai-compares': `${industry.name}: weigh ${serviceA} against ${serviceD}; verify ${sourceA.supports[0]}; inspect ${concernC.toLowerCase()}; confirm the route to ${actionA}. AI output remains general, not professional advice. Review lens: ${opening.toLowerCase()}`,
    'agent-readiness': `${industry.name}: structure ${actionA}; route ${serviceD}; retain ${industry.decisionMakers[0]} approval because ${industry.automationBoundaries[0].toLowerCase()}.`,
    checklist: `${industry.name}: audit ${serviceC}, ${serviceD}, ${sourceB.supports[0]}, ${concernD.toLowerCase()}, ${industry.commonServices[7]} and the working journey to ${actionA} through the Five Gates.`,
  };
  const h1s: Record<IndustryPageType, string> = {
    hub: `AI-first business readiness for ${industry.name.toLowerCase()}`,
    'ai-visibility': `What can AI find and say about ${industry.name.toLowerCase()}?`,
    'how-ai-compares': `How AI systems compare ${industry.name.toLowerCase()}`,
    'agent-readiness': `Can an AI-assisted buyer act with this ${industry.singularName}?`,
    checklist: `${industry.name} AI readiness checklist`,
  };

  const directAnswers: Record<IndustryPageType, string> = {
    hub: `${industry.name} become more AI-first when their public pages connect real services such as ${serviceA} and ${serviceB} with a consistent provider identity, current evidence and a working enquiry path. The goal is not an automated maturity score. It is to help buyers and customer-facing AI systems discover the provider, describe its actual scope, verify relevant facts, compare meaningful criteria and move safely toward ${actionA}. The evidence should identify a responsible owner and the route to ${actionB}.`,
    'ai-visibility': `AI visibility for ${industry.name.toLowerCase()} depends on accessible, consistent facts about service scope, audience, location, responsible people and the next step. A source such as ${sourceA.label} may support ${sourceA.supports[0]}, while the provider’s own site must explain ${serviceC}, ${concernB.toLowerCase()} and how to ${actionA}. Neither source is sufficient alone; the evidence should agree and remain current. The answer must remain attributable, qualified and human-usable.`,
    'how-ai-compares': `AI systems can compare ${industry.name.toLowerCase()} only through the facts and evidence they can retrieve. Useful criteria include ${concernA.toLowerCase()}, ${concernC.toLowerCase()}, a verifiable source such as ${sourceA.label}, and a clear route to ${actionA}. This does not make an AI comparison a professional recommendation. A responsible comparison keeps those limits visible and points the buyer to source evidence.`,
    'agent-readiness': `Agent readiness for a ${industry.singularName} means a buyer can move from a question to a controlled next step without the system inventing availability, suitability or an outcome. The public journey should say what is needed to ${actionA}, route questions about ${serviceD}, and stop for human approval at the boundaries that apply. Reliable action starts with accurate identity, evidence and service information, not autonomous decision-making. Every controlled handoff needs a named owner, visible fallback and recorded confirmation.`,
    checklist: `A useful ${industry.name.toLowerCase()} AI readiness checklist tests five connected outcomes: can the provider be discovered, described accurately, trusted through visible evidence, compared on relevant facts and contacted through a working action path? It should examine ${serviceA}, ${concernD.toLowerCase()}, evidence from ${sourceB.label} and the route to ${actionA}. Passing the checklist improves clarity; it does not guarantee ranking or recommendation. Each result needs a clear source, named owner and retest date.`,
  };

  const introductions: Record<IndustryPageType, string> = {
    hub: `${opening} For ${industry.name.toLowerCase()}, the decisive details include ${industry.buyerQuestions[0].question.toLowerCase()}, ${industry.buyerQuestions[4].question.toLowerCase()} and whether a visitor can ${actionA}. A broad claim that the business offers “complete solutions” cannot answer those questions. The site has to name services such as ${serviceA}, ${serviceB} and ${serviceC}; identify the audiences and areas genuinely served; and point to evidence without overstating what a register or membership proves. ${sourceA.label} and ${sourceB.label} provide relevant external context, while the provider remains responsible for keeping its own pages, directory entries and action routes accurate. LionTech’s Five Gates organise that work around Discover, Describe, Trust, Compare and Act. The result is a practical public information layer for human buyers and machine systems, not a claim that every AI model will interpret or rank the business in the same way.`,
    'ai-visibility': `${opening} Visibility for ${industry.name.toLowerCase()} is shaped by how separate sources answer the same buyer question. A service page may describe ${serviceB}; ${sourceA.label} may hold ${sourceA.supports[0]}; and an enquiry page may explain how to ${actionA}. If names, locations, service scope or dates disagree, an AI answer may omit the provider, merge stale facts or respond cautiously. The remedy is not to repeat keywords. It is to publish specific facts, connect them to the relevant provider entity and review them against authoritative sources. This page focuses on the information most likely to be missing: ${concernB.toLowerCase()}, ${concernC.toLowerCase()} and the responsible boundary around ${industry.automationBoundaries[0].toLowerCase()}. These are general industry checks. They do not state that LionTech has audited every provider or that an official directory endorses a business beyond the information it actually records.`,
    'how-ai-compares': `${opening} A comparison involving ${industry.name.toLowerCase()} should help a buyer test fit and evidence, not produce an unsupported league table. The meaningful questions concern ${concernA.toLowerCase()}, ${concernB.toLowerCase()}, ${concernC.toLowerCase()} and whether the provider can support ${actionA}. Some answers belong on first-party service pages; others can be checked through ${sourceA.label} or ${sourceB.label}. A provider becomes easier to compare when it explains the distinction between ${serviceA}, ${serviceC} and ${serviceD}, names the conditions attached to an enquiry, and avoids vague claims such as “best” or “fully approved” without context. AI systems may still produce different outputs because models, indexes and retrieval methods change. The responsible objective is therefore a clear, current evidence trail that a human can inspect and a machine can quote without losing the qualification that makes the fact accurate.`,
    'agent-readiness': `${opening} For ${industry.name.toLowerCase()}, an agent-assisted journey should be deliberately narrower than the full professional service. It can collect structured information for ${actionA}, explain what happens before ${actionB}, and route questions about ${serviceC}. It should not cross the boundary that ${industry.automationBoundaries[0].toLowerCase()}. The website must expose the prerequisites, responsible team, expected response and fallback route in ordinary HTML before an API or automation is considered. Evidence from ${sourceA.label} and ${sourceB.label} helps establish what can be verified, but it does not authorise a transaction or professional decision. LionTech sequences the work accordingly: visibility first, then consistent facts and trust, then a tested action path, with deeper operating integrations only when the business has approved the workflow, data handling, exceptions and human controls. That approach makes action safer and easier to maintain as tools change.`,
    checklist: `${opening} This checklist turns the Five Gates into a review a ${industry.singularName} can perform against its own public evidence. It asks whether a buyer can find ${serviceA}, understand ${serviceB}, verify relevant facts through sources such as ${sourceA.label}, compare ${concernD.toLowerCase()} and then ${actionA}. Each item should be answered with a URL, screenshot, register entry, form test or named owner rather than an assumption. A failed item is not a public score and does not prove poor service; it identifies information that is missing, inconsistent or difficult to act on. The checklist also preserves boundaries around ${industry.automationBoundaries[1].toLowerCase()}. LionTech uses this evidence-led approach because AI outputs change and no page can guarantee inclusion. The practical outcome is a prioritised set of corrections that improves the experience for human buyers while making the same facts easier for crawlers and AI-assisted systems to retrieve.`,
  };

  return {
    title: titles[pageType],
    description: descriptions[pageType],
    h1: h1s[pageType],
    directAnswer: directAnswers[pageType],
    introduction: introductions[pageType],
  };
}

export const industryPageDescriptors: IndustryPageDescriptor[] = industries.flatMap((industry, industryIndex) =>
  industryPageTypes.map((pageType) => ({
    industry,
    pageType,
    path: industryPath(industry.slug, pageType),
    ...descriptorText(industry, pageType, industryIndex),
    reviewedAt: industry.reviewedAt,
  })),
);

export const industryPageByPath = new Map(industryPageDescriptors.map((page) => [page.path, page]));
export const programmaticRoutes = industryPageDescriptors.map((page) => page.path);

export function validateIndustryRecords(records: IndustryRecord[] = industries) {
  const errors: string[] = [];
  const expectedCounts: Array<[keyof IndustryRecord, number]> = [
    ['commonServices', 8],
    ['buyerQuestions', 10],
    ['trustedSources', 4],
    ['factsAIShouldUnderstand', 8],
    ['commonVisibilityGaps', 6],
    ['comparisonCriteria', 6],
    ['trustSignals', 6],
    ['actionPaths', 4],
    ['agentReadinessOpportunities', 4],
    ['automationBoundaries', 3],
    ['structuredDataRecommendations', 4],
    ['riskAndClaimsNotes', 3],
    ['snapshotChecks', 10],
    ['checklistItems', 20],
    ['relatedIndustries', 3],
  ];

  if (records.length !== 20) errors.push(`Expected 20 industry records, received ${records.length}`);
  const slugs = new Set(records.map((record) => record.slug));
  if (slugs.size !== records.length) errors.push('Industry slugs must be unique');

  for (const record of records) {
    for (const [key, minimum] of expectedCounts) {
      const value = record[key];
      if (!Array.isArray(value) || value.length < minimum) errors.push(`${record.slug}.${key} requires at least ${minimum} values`);
    }
    for (const intent of Object.keys(gateLabels) as FiveGateIntent[]) {
      if (record.buyerQuestions.filter((item) => item.intent === intent).length < 2) {
        errors.push(`${record.slug} requires at least two ${gateLabels[intent]} buyer questions`);
      }
    }
    for (const item of record.trustedSources) {
      try {
        const url = new URL(item.url);
        if (url.protocol !== 'https:') errors.push(`${record.slug} source is not HTTPS: ${item.url}`);
      } catch {
        errors.push(`${record.slug} source URL is invalid: ${item.url}`);
      }
      if (!item.supports.length || item.reviewedAt !== record.reviewedAt) errors.push(`${record.slug} source metadata is incomplete: ${item.label}`);
    }
    for (const related of record.relatedIndustries) {
      if (!slugs.has(related)) errors.push(`${record.slug} references unknown related industry: ${related}`);
    }
    if (record.reviewedBy !== industryReviewer || record.primaryCTA !== 'snapshot') errors.push(`${record.slug} review or CTA metadata is invalid`);
  }

  if (industryPageDescriptors.length !== 100 || new Set(programmaticRoutes).size !== 100) {
    errors.push('Programmatic route inventory must contain exactly 100 unique URLs');
  }
  if (errors.length) throw new Error(`Industry content validation failed:\n${errors.join('\n')}`);
  return true;
}

validateIndustryRecords();
