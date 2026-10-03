export const projectTypes = ['Fix my existing app', 'Finish a vibe-coded app', 'Add a feature', 'Supabase / database fix', 'Stripe / payment integration', 'API integration', 'AI automation', 'Website fix', 'Simple MVP / internal tool', 'Other'] as const;
export const budgets = ['Under £300', '£300–£750', '£750–£1,500', '£1,500–£3,000', '£3,000+', 'Not sure yet'] as const;
export const timescales = ['Urgent / ASAP', 'Within 1 week', 'Within 2–4 weeks', 'Within 1–2 months', 'Flexible'] as const;
export const devRequestLimits = { name: 100, email: 180, company: 160, websiteUrl: 500, projectType: 80, description: 4000, budget: 40, timescale: 40, referenceUrl: 500, website: 100, requestId: 36, submittedAt: 24 } as const;
