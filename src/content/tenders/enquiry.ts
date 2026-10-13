export const tenderEnquiryLimits = { name: 100, email: 180, company: 160, publicTenderUrl: 1000, deadline: 16, timezone: 80, sector: 100, support: 100, message: 4000, source: 150, consent: 2, website: 200, requestId: 36, submittedAt: 30 } as const;
export const tenderSectors = ['Cleaning', 'Facilities management', 'Construction', 'Grounds maintenance', 'Security', 'Catering', 'Building maintenance', 'IT services', 'Other'] as const;
export const tenderSupport = ['Tender Fit Review', 'Standard Tender Sprint', 'Complex Tender Sprint', 'Review an existing draft', 'Not sure yet'] as const;
