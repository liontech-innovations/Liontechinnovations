export const company = {
  legalName: 'Lion Tech Innovations Ltd',
  tradingName: 'LionTech Innovations',
  companiesHouseNumber: '17068390',
  website: 'https://liontechinnovations.co.uk',
  location: 'Manchester, United Kingdom',
  serviceArea: 'UK-based, serving businesses remotely',
  email: 'contact@liontechinnovations.co.uk',
  privacyEmail: 'privacy@liontechinnovations.co.uk',
  logo: '/assets/liontechlogo.png',
  ogImage: '/assets/ogliontech.png',
  description:
    'LionTech is a UK AI Business Readiness company. We test what leading AI systems say about a business, show the evidence, and help fix the gaps.',
  coreServices: [
    'AI Visibility Snapshot',
    'Readiness Fix Sprint',
    'AI Visibility Monitoring',
    'Agent Action Sprints',
    'Company Brain',
  ],
} as const;

export type Company = typeof company;
