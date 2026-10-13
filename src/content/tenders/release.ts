export type TenderReview = { reviewStatus: 'draft' | 'approved'; publishStatus: 'draft' | 'published'; reviewedBy: string | null; reviewedAt: string | null; publishedAt: string | null; updatedAt: string };
export const tenderReleaseEnabled = false;
export const tenderPreviewCohorts: readonly number[] = [1];
export const tenderProductionCohorts: readonly number[] = [];
export const tenderHubReview: TenderReview = { reviewStatus: 'draft', publishStatus: 'draft', reviewedBy: null, reviewedAt: null, publishedAt: null, updatedAt: '2026-10-13' };
export const tenderReviews: Record<string, TenderReview> = {
  'cleaning-tender-support': { reviewStatus: 'draft', publishStatus: 'draft', reviewedBy: null, reviewedAt: null, publishedAt: null, updatedAt: '2026-10-13' },
  'facilities-management-tender-support': { reviewStatus: 'draft', publishStatus: 'draft', reviewedBy: null, reviewedAt: null, publishedAt: null, updatedAt: '2026-10-13' },
  'construction-tender-support': { reviewStatus: 'draft', publishStatus: 'draft', reviewedBy: null, reviewedAt: null, publishedAt: null, updatedAt: '2026-10-13' },
  'bid-no-bid-checklist': { reviewStatus: 'draft', publishStatus: 'draft', reviewedBy: null, reviewedAt: null, publishedAt: null, updatedAt: '2026-10-13' },
  'tender-compliance-matrix-template': { reviewStatus: 'draft', publishStatus: 'draft', reviewedBy: null, reviewedAt: null, publishedAt: null, updatedAt: '2026-10-13' },
};
export const isTenderPublished = (page: TenderReview) => page.reviewStatus === 'approved' && page.publishStatus === 'published' && Boolean(page.reviewedBy && page.reviewedAt && page.publishedAt);
