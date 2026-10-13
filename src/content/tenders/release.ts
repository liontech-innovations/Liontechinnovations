export type TenderReview = { reviewStatus: 'draft' | 'approved'; publishStatus: 'draft' | 'published'; reviewedBy: string | null; reviewedAt: string | null; publishedAt: string | null; updatedAt: string };
export const tenderReleaseEnabled = true;
export const tenderPreviewCohorts: readonly number[] = [1];
export const tenderProductionCohorts: readonly number[] = [1];
// Founder release authorisation on 13 October, based on documented editorial QA;
// not a claim of personal sentence-by-sentence inspection or deployment evidence.
export const tenderHubReview: TenderReview = { reviewStatus: 'approved', publishStatus: 'published', reviewedBy: 'Freejoy Chimbizi', reviewedAt: '2026-10-13', publishedAt: '2026-10-13', updatedAt: '2026-10-13' };
export const tenderReviews: Record<string, TenderReview> = {
  'cleaning-tender-support': { reviewStatus: 'approved', publishStatus: 'published', reviewedBy: 'Freejoy Chimbizi', reviewedAt: '2026-10-13', publishedAt: '2026-10-13', updatedAt: '2026-10-13' },
  'facilities-management-tender-support': { reviewStatus: 'approved', publishStatus: 'published', reviewedBy: 'Freejoy Chimbizi', reviewedAt: '2026-10-13', publishedAt: '2026-10-13', updatedAt: '2026-10-13' },
  'construction-tender-support': { reviewStatus: 'approved', publishStatus: 'published', reviewedBy: 'Freejoy Chimbizi', reviewedAt: '2026-10-13', publishedAt: '2026-10-13', updatedAt: '2026-10-13' },
  'bid-no-bid-checklist': { reviewStatus: 'approved', publishStatus: 'published', reviewedBy: 'Freejoy Chimbizi', reviewedAt: '2026-10-13', publishedAt: '2026-10-13', updatedAt: '2026-10-13' },
  'tender-compliance-matrix-template': { reviewStatus: 'approved', publishStatus: 'published', reviewedBy: 'Freejoy Chimbizi', reviewedAt: '2026-10-13', publishedAt: '2026-10-13', updatedAt: '2026-10-13' },
};
export const isTenderPublished = (page: TenderReview) => page.reviewStatus === 'approved' && page.publishStatus === 'published' && Boolean(page.reviewedBy && page.reviewedAt && page.publishedAt);
