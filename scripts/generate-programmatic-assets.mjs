import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDirectory = join(projectRoot, 'public');
const aiDataDirectory = join(publicDirectory, 'ai-data');
const reviewedAt = '2026-08-15';
const routeLastModified = { '/zimbabwe': '2026-09-02', '/': '2026-10-05', '/dev-fix': '2026-10-05' };
const siteUrl = 'https://liontechinnovations.co.uk';
let coreSitemapLastModified = '2026-10-05';

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const urlset = (paths) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${escapeXml(new URL(path, siteUrl).toString())}</loc><lastmod>${routeLastModified[path] ?? reviewedAt}</lastmod></url>`).join('\n')}
</urlset>
`;

const sitemapIndex = (files) => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map((file) => `  <sitemap><loc>${siteUrl}/${file}</loc><lastmod>${file === 'sitemap-core.xml' ? coreSitemapLastModified : file === 'sitemap-zimbabwe.xml' ? '2026-09-02' : reviewedAt}</lastmod></sitemap>`).join('\n')}
</sitemapindex>
`;

const vite = await createServer({
  root: projectRoot,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
});

try {
  const industryModule = await vite.ssrLoadModule('/src/content/industries/index.ts');
  const { zimbabweIndustryRoutes, zimbabweIndustryUpdatedAt } = await vite.ssrLoadModule('/src/content/zimbabweIndustries.ts');
  const { tenderVisiblePages, publishedTenderRoutes, tenderPages, tenderHubReview } = await vite.ssrLoadModule('/src/content/tenders/index.ts');
  const { tenderCsv, tenderWorksheet } = await vite.ssrLoadModule('/src/content/tenders/downloads.ts');
  const tenderDownloads = join(publicDirectory, 'downloads', 'tenders');
  if (!tenderDownloads.startsWith(`${publicDirectory}${process.platform === 'win32' ? '\\' : '/'}`)) throw new Error('Unsafe tender download path');
  await rm(tenderDownloads, { recursive: true, force: true });
  if (tenderVisiblePages.length) await mkdir(tenderDownloads, { recursive: true });
  for (const page of tenderVisiblePages) {
    await writeFile(join(tenderDownloads, `${page.slug}.csv`), tenderCsv(page), 'utf8');
    await writeFile(join(tenderDownloads, `${page.slug}.md`), tenderWorksheet(page), 'utf8');
  }
  for (const route of publishedTenderRoutes) routeLastModified[route] = route === '/tenders' ? tenderHubReview.updatedAt : tenderPages.find(page => page.path === route).updatedAt;
  coreSitemapLastModified = [coreSitemapLastModified, ...publishedTenderRoutes.map(route => routeLastModified[route])].sort().at(-1);
  for (const route of zimbabweIndustryRoutes) routeLastModified[route] = zimbabweIndustryUpdatedAt;
  const artifactModule = await vite.ssrLoadModule('/src/content/industries/artifacts.ts');
  const { industries } = industryModule;
  const {
    coreSitemapRoutes,
    createContentReviewManifest,
    createIndustryIndexRecord,
    createIndustryPublicRecord,
    createIndustrySourceManifest,
    createReleaseCohortManifest,
    industrySitemapGroups,
  } = artifactModule;

  await rm(aiDataDirectory, { recursive: true, force: true });
  await mkdir(join(aiDataDirectory, 'industries'), { recursive: true });
  await writeFile(join(aiDataDirectory, 'index.json'), `${JSON.stringify(createIndustryIndexRecord(), null, 2)}\n`, 'utf8');
  await writeFile(join(aiDataDirectory, 'source-manifest.json'), `${JSON.stringify(createIndustrySourceManifest(), null, 2)}\n`, 'utf8');
  await writeFile(join(aiDataDirectory, 'content-review-manifest.json'), `${JSON.stringify(createContentReviewManifest(), null, 2)}\n`, 'utf8');
  await writeFile(join(aiDataDirectory, 'release-cohorts.json'), `${JSON.stringify(createReleaseCohortManifest(), null, 2)}\n`, 'utf8');

  for (const industry of industries) {
    const target = join(aiDataDirectory, 'industries', `${industry.slug}.json`);
    await writeFile(target, `${JSON.stringify(createIndustryPublicRecord(industry), null, 2)}\n`, 'utf8');
  }

  const sitemapFiles = ['sitemap-core.xml', ...industrySitemapGroups.map((_, index) => `sitemap-industries-${index + 1}.xml`), 'sitemap-zimbabwe.xml'];
  await writeFile(join(publicDirectory, 'sitemap.xml'), sitemapIndex(sitemapFiles), 'utf8');
  await writeFile(join(publicDirectory, 'sitemap-core.xml'), urlset([...coreSitemapRoutes, ...publishedTenderRoutes]), 'utf8');
  await writeFile(join(publicDirectory, 'sitemap-zimbabwe.xml'), urlset(zimbabweIndustryRoutes), 'utf8');
  for (const [index, pages] of industrySitemapGroups.entries()) {
    await writeFile(join(publicDirectory, `sitemap-industries-${index + 1}.xml`), urlset(pages.map((page) => page.path)), 'utf8');
  }

  process.stdout.write(`Generated 24 AI-data records and ${sitemapFiles.length + 1} sitemap files.\n`);
} finally {
  await vite.close();
}
