export const fiveGates = [
  {
    name: 'Discover',
    question: 'Can AI find the business for real buyer questions?',
  },
  {
    name: 'Describe',
    question: 'Does AI explain the business accurately?',
  },
  {
    name: 'Trust',
    question: 'Can AI find credible evidence for the claims?',
  },
  {
    name: 'Compare',
    question: 'Can AI distinguish the business from alternatives?',
  },
  {
    name: 'Act',
    question: 'Can a buyer or agent take the next step?',
  },
] as const;

export const readinessStatuses = ['Strong', 'Workable', 'At Risk', 'Material Gap'] as const;
