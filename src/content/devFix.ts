export const DEV_FIX_PAYMENT_LINKS = {
  faultFindCall: 'https://buy.stripe.com/dRm14pajb1605ZEgfH5wI0h',
  singleFix48h: 'https://buy.stripe.com/5kQeVf4YR2a4afUbZr5wI0i',
  revenueFlow72h: 'https://buy.stripe.com/9B64gBdvn3e89bQ8Nf5wI0j',
  appRescue7Day: 'https://buy.stripe.com/fZu5kF9f73e873I5B35wI0k',
} as const;

export const devFixDescription = 'Fast fixed-scope repairs for broken websites, apps, forms, Stripe flows, Vercel/Supabase issues, AI-built MVPs and business workflows.';

export const devFixPackages = [
  {
    name: 'Fault-Find Call', price: '£150', amount: 150,
    turnaround: '45-minute diagnosis',
    bestFor: 'Unclear problems or deciding what needs fixing first.',
    includes: ['45-minute technical review', 'Issue diagnosis', 'Recommended fix path', 'Written action plan'],
    cta: 'Book Fault-Find Call', href: DEV_FIX_PAYMENT_LINKS.faultFindCall,
  },
  {
    name: '48h Single Fix', price: '£750', amount: 750,
    turnaround: '48 hours after access and scope confirmation',
    bestFor: 'One clear issue: form, Stripe, deployment, email, page issue, small app bug.',
    includes: ['One defined fix', 'Root-cause diagnosis', 'Repair and test', 'Short handover note', 'Before/after evidence where practical'],
    cta: 'Pay for 48h Single Fix', href: DEV_FIX_PAYMENT_LINKS.singleFix48h,
  },
  {
    name: '72h Revenue Flow Repair', price: '£1,500', amount: 1500,
    turnaround: '72 hours after access and scope confirmation',
    bestFor: 'A complete lead, payment, booking, enquiry, or admin workflow that needs fixing end-to-end.',
    includes: ['Workflow diagnosis', 'End-to-end repair', 'Form/payment/email/routing tests', 'Handover note', 'Practical recommendations for next improvement'],
    cta: 'Pay for 72h Flow Repair', href: DEV_FIX_PAYMENT_LINKS.revenueFlow72h,
  },
  {
    name: '7-Day App Rescue Sprint', price: '£2,500', amount: 2500,
    turnaround: '7 days after access and scope confirmation',
    bestFor: 'AI-built or half-built apps stuck before launch.',
    includes: ['Repo/code review', 'Deployment blocker review', 'Environment variable check', 'Vercel/Supabase/API/Auth/Stripe issue repair where in scope', 'Main user-flow testing', 'Launch-readiness handover'],
    cta: 'Pay for App Rescue Sprint', href: DEV_FIX_PAYMENT_LINKS.appRescue7Day,
  },
] as const;

export const devFixServices = [
  { title: 'Website & Form Fixes', description: 'Broken contact forms, enquiry routing, booking forms, email delivery, broken buttons, landing page issues, and conversion leaks.' },
  { title: 'Stripe & Payment Flow Fixes', description: 'Checkout problems, payment links, failed payment flows, missing success pages, webhook issues, and basic Stripe integration faults.' },
  { title: 'Vercel / Supabase / Next.js Fixes', description: 'Deployment failures, environment variables, build errors, database connection issues, auth problems, API bugs, and live-site errors.' },
  { title: 'AI-Built App Rescue', description: 'Apps built with AI tools that work locally but break on deployment, have messy code, broken integrations, missing handover, or unclear launch blockers.' },
  { title: 'Business Workflow Fixes', description: 'Manual admin bottlenecks, enquiry capture, email notifications, simple CRM routing, document workflows, and lightweight automation fixes.' },
  { title: 'Email & Deliverability Fixes', description: 'Forms saying “sent” but emails never arrive, missing admin notifications, reply-to errors, domain mail problems, and basic routing issues.' },
] as const;

export const devFixSteps = [
  'Send the link, repo, screenshots, or error message.',
  'LionTech confirms whether the issue fits a fixed-scope repair.',
  'You pay the agreed package.',
  'LionTech repairs, tests, and documents the fix.',
  'You receive a clear handover note.',
] as const;

export const devFixBoundaries = ['No large vague builds', 'No equity-only work', 'No unpaid discovery', 'No trading bots or investment products', 'No months-long SaaS builds', 'No projects without code, hosting, or admin access', 'No work starting before payment', 'No “pay after it works” arrangements'] as const;
export const devFixPrinciples = ['Clear diagnosis before repair', 'Fixed-scope delivery', 'Practical handover notes', 'Mobile and desktop checks where relevant', 'Fast communication', 'No bloated agency process'] as const;
export const devFixUrgencies = ['48h', '72h', '7 days', 'Not urgent'] as const;
export const devFixPackageInterests = ['Fault-Find Call £150', '48h Single Fix £750', '72h Revenue Flow Repair £1,500', '7-Day App Rescue Sprint £2,500', 'Not sure'] as const;
export const devFixRequestLimits = {
  requestType: 7, name: 100, email: 180, phone: 40, company: 160, websiteUrl: 500,
  description: 4000, expectedOutcome: 4000, tools: 1000, urgency: 20, packageInterest: 80,
  referenceLinks: 1500, consent: 2, website: 100, requestId: 36, submittedAt: 24,
} as const;
