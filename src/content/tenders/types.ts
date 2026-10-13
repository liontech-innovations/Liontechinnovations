export type TenderCatalogEntry = {
  id: string; slug: string; path: string; type: 'sector' | 'guide' | 'template'; cohort: number;
  h1: string; title: string; intent: string; audience: string;
  utility: { name: string; fields: string[] }; related: string[];
};
export type TenderSection = { heading: string; paragraphs: string[]; points?: string[]; source?: string };
export type TenderCopy = {
  description: string; answer: string; steps: string[]; sections: TenderSection[];
  fieldHelp: string[]; example: string; mistakes: string[];
  faqs: Array<{ question: string; answer: string }>;
};
export type TenderPage = TenderCatalogEntry & TenderCopy & {
  reviewStatus: 'draft' | 'approved'; publishStatus: 'draft' | 'published';
  reviewedBy: string | null; reviewedAt: string | null; publishedAt: string | null; updatedAt: string;
};
