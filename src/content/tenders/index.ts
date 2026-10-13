import { tenderCatalog } from './catalog';
import { tenderCopy } from './copy';
import type { TenderPage } from './types';
import { tenderHubReview, tenderReviews, isTenderPublished, tenderReleaseEnabled, tenderPreviewCohorts, tenderProductionCohorts } from './release';
export { tenderHubReview, isTenderPublished } from './release';
export * from './types';
export const tendersPreview = import.meta.env.VITE_TENDERS_PREVIEW === 'true';
export const tenderPages: TenderPage[] = /* @__PURE__ */ tenderCatalog.map<TenderPage>(entry => ({
  ...entry, ...tenderCopy[entry.slug], reviewStatus: 'draft', publishStatus: 'draft',
  reviewedBy: null, reviewedAt: null, publishedAt: null, updatedAt: '2026-10-13',
  ...tenderReviews[entry.slug],
}));
export const publishedTenderPages = tenderReleaseEnabled && isTenderPublished(tenderHubReview) ? tenderPages.filter(page => tenderProductionCohorts.includes(page.cohort) && isTenderPublished(page)) : [];
export const tenderVisiblePages = tendersPreview ? tenderPages.filter(page => tenderPreviewCohorts.includes(page.cohort)) : publishedTenderPages;
export const tenderHubVisible = tendersPreview || (tenderReleaseEnabled && isTenderPublished(tenderHubReview));
export const tenderRoutes = [...(tenderHubVisible ? ['/tenders'] : []), ...tenderVisiblePages.map(page => page.path)];
export const tenderPageByPath = new Map(tenderVisiblePages.map(page => [page.path, page]));
export const publishedTenderRoutes = [...(tenderReleaseEnabled && isTenderPublished(tenderHubReview) ? ['/tenders'] : []), ...publishedTenderPages.map(page => page.path)];
export const tenderSourcePaths = tenderRoutes;
