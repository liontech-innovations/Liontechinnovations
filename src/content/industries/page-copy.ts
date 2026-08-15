import type { FiveGateIntent, IndustryPageDescriptor, IndustryPageType } from './types';

const pageTypeLabels: Record<IndustryPageType, string> = {
  hub: 'AI-first readiness',
  'ai-visibility': 'AI visibility',
  'how-ai-compares': 'provider comparison',
  'agent-readiness': 'agent readiness',
  checklist: 'readiness checking',
};

const pageTypeFocus: Record<IndustryPageType, string> = {
  hub: 'connect the complete journey from public identity to a responsible next step',
  'ai-visibility': 'make facts retrievable, attributable and consistent across first-party and official sources',
  'how-ai-compares': 'separate factual service fit from unsupported claims of superiority',
  'agent-readiness': 'make the next action structured while preserving human approval and professional boundaries',
  checklist: 'turn every material claim into a repeatable evidence check with a named owner',
};

export function getGateInterpretations(page: IndustryPageDescriptor) {
  const intents: FiveGateIntent[] = ['discover', 'describe', 'trust', 'compare', 'act'];
  const offset = ['hub', 'how-ai-compares', 'checklist'].includes(page.pageType) ? 0 : 1;
  return intents.map((intent) => {
    const questions = page.industry.buyerQuestions.filter((item) => item.intent === intent);
    const selected = questions[offset % questions.length];
    const details: Record<FiveGateIntent, string> = {
      discover: `Test whether a crawler can connect the provider, its real service area and ${page.industry.commonServices[offset]} without depending on a map widget or client-only interface.`,
      describe: `Publish enough context to distinguish ${page.industry.commonServices[2 + offset]} from ${page.industry.commonServices[4 + offset]}, including who the service is for and which limits apply.`,
      trust: `Reconcile the provider's own wording with ${page.industry.trustedSources[offset].label}, while explaining what that source does and does not verify.`,
      compare: `Help a buyer inspect ${page.industry.comparisonCriteria[1 + offset].toLowerCase()} alongside service fit, evidence and a current action route.`,
      act: `Make it possible to ${page.industry.actionPaths[offset]} with clear prerequisites, confirmation and a route to a responsible human.`,
    };
    return {
      intent,
      label: intent[0].toUpperCase() + intent.slice(1),
      question: selected.question,
      text: `${details[intent]} For this ${pageTypeLabels[page.pageType]} page, the aim is to ${pageTypeFocus[page.pageType]}.`,
    };
  });
}
export function getPageSpecificItems(page: IndustryPageDescriptor) {
  const record = page.industry;
  const items: Record<IndustryPageType, string[]> = {
    hub: [
      ...record.factsAIShouldUnderstand.slice(0, 4),
      ...record.commonVisibilityGaps.slice(0, 2),
      ...record.actionPaths.slice(0, 2).map((action) => `Document the complete path to ${action}, including the responsible role and expected response.`),
    ],
    'ai-visibility': [
      ...record.commonVisibilityGaps,
      `Check whether a plain-text crawler can retrieve the page that explains ${record.commonServices[5]}.`,
      `Keep the provider name, service area and ${record.comparisonCriteria[1].toLowerCase()} aligned with official profiles.`,
    ],
    'how-ai-compares': [
      ...record.comparisonCriteria,
      `Show the evidence behind ${record.trustSignals[0].toLowerCase()} rather than using an unqualified badge.`,
      `Explain where ${record.commonServices[6]} sits outside or alongside ${record.commonServices[2]}.`,
    ],
    'agent-readiness': [
      ...record.agentReadinessOpportunities,
      ...record.automationBoundaries.map((boundary) => `Stop and escalate because ${boundary.toLowerCase()}.`),
      `Record a fallback contact route when the structured path to ${record.actionPaths[2]} cannot complete.`,
    ],
    checklist: record.checklistItems,
  };
  return items[page.pageType];
}

export function getPracticalChecks(page: IndustryPageDescriptor) {
  const offsets: Record<IndustryPageType, number> = {
    hub: 0,
    'ai-visibility': 2,
    'how-ai-compares': 4,
    'agent-readiness': 1,
    checklist: 3,
  };
  const offset = offsets[page.pageType];
  return Array.from({ length: 6 }, (_, index) => page.industry.snapshotChecks[(index + offset) % page.industry.snapshotChecks.length]);
}

export function getSourceObservations(page: IndustryPageDescriptor) {
  const typeIndex = ['hub', 'ai-visibility', 'how-ai-compares', 'agent-readiness', 'checklist'].indexOf(page.pageType);
  const sources = [
    page.industry.trustedSources[typeIndex % 4],
    page.industry.trustedSources[(typeIndex + 2) % 4],
  ];
  const lenses: Record<IndustryPageType, [string, string]> = {
    hub: ['Entity evidence', 'Service boundary'],
    'ai-visibility': ['Retrieval signal', 'Consistency check'],
    'how-ai-compares': ['Comparison evidence', 'Qualification'],
    'agent-readiness': ['Pre-action verification', 'Human-control signal'],
    checklist: ['Recorded check', 'Review evidence'],
  };
  return sources.map((source, index) => ({
    ...source,
    heading: `${lenses[page.pageType][index]}: ${source.label}`,
    observation: `${source.label} provides an authoritative route for ${source.supports[0]}. On this ${pageTypeLabels[page.pageType]} page, a ${page.industry.singularName} should reference that evidence only where it applies, keep its own service facts current, and avoid turning a listing, membership or guidance source into a broader endorsement claim.`,
  }));
}

export function getIndustryFaqs(page: IndustryPageDescriptor) {
  const record = page.industry;
  const faqs: Record<IndustryPageType, Array<{ question: string; answer: string }>> = {
    hub: [
      {
        question: `What does AI-first readiness mean for a ${record.singularName}?`,
        answer: `It means publishing a consistent provider identity, specific service and audience information, visible evidence, meaningful comparison facts and a working route to ${record.actionPaths[0]}. It does not require an AI maturity score or replacing professional judgement with automation.`,
      },
      {
        question: `Does an official listing guarantee AI visibility for ${record.name.toLowerCase()}?`,
        answer: `No. ${record.trustedSources[0].label} may support ${record.trustedSources[0].supports[0]}, but AI systems use changing indexes and retrieval methods. The provider's website, public profiles and action paths still need accurate, crawlable information.`,
      },
      {
        question: `Where should a ${record.singularName} start?`,
        answer: `Start by testing real buyer questions about ${record.commonServices[0]}, ${record.comparisonCriteria[1].toLowerCase()} and the route to ${record.actionPaths[0]}. Record the output and source, then prioritise corrections that improve factual accuracy or prevent a buyer from acting.`,
      },
    ],
    'ai-visibility': [
      {
        question: `Why might AI omit a relevant ${record.singularName}?`,
        answer: `The provider may not have a crawlable page connecting its entity, service area and ${record.commonServices[1]}; its official profiles may be incomplete; or public sources may disagree. Omission is not proof of poor service, but it is evidence that the public information path needs review.`,
      },
      {
        question: `Which source should be trusted for ${record.name.toLowerCase()}?`,
        answer: `Use the source that is authoritative for the fact being checked. ${record.trustedSources[0].label} supports ${record.trustedSources[0].supports[0]}, while the provider's own site should explain live scope, availability and how to ${record.actionPaths[0]}.`,
      },
      {
        question: `Can LionTech guarantee a provider will appear in an AI answer?`,
        answer: `No. LionTech can test sampled buyer questions, capture what is returned, identify evidence gaps and implement approved improvements. Search indexes, AI models and responses remain controlled by third parties and can change after a review.`,
      },
    ],
    'how-ai-compares': [
      {
        question: `What can AI compare safely between ${record.name.toLowerCase()}?`,
        answer: `It can surface retrievable facts such as actual service scope, location, applicable register evidence, stated fees or engagement conditions and the available action path. It should not turn those facts into professional advice or an unsupported claim that one provider is universally best.`,
      },
      {
        question: `Why could another provider surface more clearly?`,
        answer: `A competitor may have more complete pages for ${record.commonServices[2]}, better agreement with ${record.trustedSources[1].label}, fresher structured information or a clearer path to ${record.actionPaths[1]}. That visibility difference is not proof of higher service quality.`,
      },
      {
        question: `Should a provider publish competitor names on this page?`,
        answer: `Not for a generic readiness guide. The safer approach is to explain the factual criteria buyers use, test representative competitors privately in the Snapshot and avoid disparaging or unverified statements about individual businesses.`,
      },
    ],
    'agent-readiness': [
      {
        question: `What can an agent do for a ${record.singularName}?`,
        answer: `A controlled agent can collect structured information to ${record.actionPaths[0]}, explain the next step, validate required fields and route the request. It should not cross the boundary that ${record.automationBoundaries[0].toLowerCase()}.`,
      },
      {
        question: `What information should be available before automating an action?`,
        answer: `The provider needs current service scope, location or coverage, eligibility or prerequisites, privacy information, human escalation, confirmation behaviour and an owner for exceptions. Those facts should be visible before they are encoded into a workflow.`,
      },
      {
        question: `Does agent readiness mean removing people from the journey?`,
        answer: `No. For ${record.name.toLowerCase()}, the useful pattern is structured intake and routing with explicit human control. The site should identify where professional judgement, safeguarding, suitability, pricing or final commitment requires review.`,
      },
    ],
    checklist: [
      {
        question: `How should a ${record.singularName} use this checklist?`,
        answer: `Assign an owner to each item and attach evidence such as a public URL, official record, screenshot or completed form test. Mark unknown items for investigation rather than guessing. Recheck material service, trust and action facts when they change.`,
      },
      {
        question: `Is the checklist an official compliance assessment?`,
        answer: `No. It is general AI-readiness guidance for public information and customer journeys. It is not legal, medical, financial, regulatory or compliance advice, and it does not replace the requirements of ${record.trustedSources[0].label} or another competent authority.`,
      },
      {
        question: `What should happen after failed checks are found?`,
        answer: `Prioritise factual errors, broken action routes and misleading ambiguity first. Confirm the correct source, update the public page and retest the same buyer question. Larger implementation work should be separately scoped and approved after the evidence is reviewed.`,
      },
    ],
  };
  return faqs[page.pageType];
}
