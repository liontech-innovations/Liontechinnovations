export const snapshotOffer = {
  name: 'AI Visibility Snapshot',
  foundingPrice: '£395',
  standardPrice: '£495',
  standardPriceTiming: 'after the first 10 clients',
  turnaround: '48-hour delivery after completed onboarding',
  shortScope: 'Buyer-intent tests across leading AI systems, with competitor benchmarking.',
  inclusions: [
    'Evidence-led findings report',
    'Factual accuracy and source review',
    'Focused competitor benchmark',
    'Five Gates Readiness Profile',
    'Top five priority fixes',
    '30-day action plan',
    '30-minute review call',
  ],
  guarantee:
    'If LionTech cannot identify at least five concrete, evidenced inaccuracies, omissions, competitor gaps or actionable readiness improvements in the agreed sampled tests, we will refund the Snapshot fee.',
} as const;

export const fixSprintOffer = {
  name: 'Readiness Fix Sprint',
  price: 'Starting at £2,750',
  duration: '10 business days',
  scope: 'Up to five agreed priority fixes within the defined delivery cap.',
  credit: 'Your Snapshot fee is credited in full when the Sprint is signed within 14 days.',
} as const;

export const monitoringOffer = {
  name: 'AI Visibility Monitoring',
  price: '£295/month',
  scope:
    'Reruns agreed priority buyer questions, tracks material factual and competitor movement, and delivers a concise monthly report.',
} as const;

export const companyBrainOffer = {
  name: 'Company Brain',
  stage: 'Phase 4',
  price: '£5,000-£25,000+',
  scope:
    'A relationship-led, model-independent operating layer for persistent company knowledge, approved workflows, decisions and role-scoped access.',
} as const;
