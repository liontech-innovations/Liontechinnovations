export const company = {
  legalName: 'Lion Tech Innovations Ltd',
  tradingName: 'LionTech Innovations',
  companiesHouseNumber: '17068390',
  companiesHouseUrl: 'https://find-and-update.company-information.service.gov.uk/company/17068390',
  website: 'https://liontechinnovations.co.uk',
  location: 'Manchester-based, serving UK businesses remotely',
  serviceArea: 'UK-based, serving businesses remotely',
  email: 'contact@liontechinnovations.co.uk',
  privacyEmail: 'privacy@liontechinnovations.co.uk',
  logo: '/assets/liontechlogo.png',
  ogImage: '/assets/ogliontech.png',
  description:
    'Lion Tech Innovations Ltd is a Manchester-based AI Business Readiness company serving UK businesses with AI visibility evidence and priority fixes.',
  coreServices: [
    'AI Visibility Snapshot',
    'Readiness Fix Sprint',
    'AI Visibility Monitoring',
    'Agent Action Sprints',
    'Company Brain',
  ],
} as const;

export type Company = typeof company;
