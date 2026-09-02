import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const publicDirectory = join(projectRoot, 'public');
const failures = [];
const siteUrl = 'https://liontechinnovations.co.uk';
const reviewedAt = '2026-08-15';
const sitemapFiles = ['sitemap-core.xml', 'sitemap-industries-1.xml', 'sitemap-industries-2.xml', 'sitemap-industries-3.xml', 'sitemap-industries-4.xml', 'sitemap-industries-5.xml', 'sitemap-zimbabwe.xml'];

const sitemapIndex = await readFile(join(publicDirectory, 'sitemap.xml'), 'utf8');
for (const filename of sitemapFiles) if (!sitemapIndex.includes(`${siteUrl}/${filename}`)) failures.push(`sitemap.xml: missing ${filename}`);
if ((sitemapIndex.match(/<sitemap>/g) ?? []).length !== 7) failures.push('sitemap.xml: expected seven sitemap entries');

const urls = [];
for (const [index, filename] of sitemapFiles.entries()) {
  const xml = await readFile(join(publicDirectory, filename), 'utf8');
  const entries = [...xml.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)];
  const expected = index === 0 ? 19 : filename === 'sitemap-zimbabwe.xml' ? 26 : 20;
  if (entries.length !== expected) failures.push(`${filename}: expected ${expected} URLs, received ${entries.length}`);
  for (const [, url, lastmod] of entries) {
    if (!url.startsWith(`${siteUrl}/`) || /#|vercel\.app|localhost|127\.0\.0\.1/i.test(url)) failures.push(`${filename}: invalid public URL ${url}`);
    const expectedLastmod = url === `${siteUrl}/zimbabwe` || url.startsWith(`${siteUrl}/zimbabwe/`) ? '2026-09-02' : reviewedAt;
    if (lastmod !== expectedLastmod) failures.push(`${filename}: invalid lastmod ${lastmod}`);
    urls.push(url);
  }
}
if (urls.length !== 145 || new Set(urls).size !== 145) failures.push(`Sitemap inventory expected 145 unique URLs, received ${urls.length}/${new Set(urls).size}`);

const llms = await readFile(join(publicDirectory, 'llms.txt'), 'utf8');
for (const fact of ['Lion Tech Innovations Ltd', '17068390', 'Manchester-based, serving UK businesses remotely', siteUrl, `${siteUrl}/contact#snapshot-enquiry`, `${siteUrl}/ai-data/index.json`, `${siteUrl}/ai-data/source-manifest.json`, `${siteUrl}/ai-data/content-review-manifest.json`, `${siteUrl}/ai-data/release-cohorts.json`]) {
  if (!llms.includes(fact)) failures.push(`llms.txt: missing canonical fact ${fact}`);
}
if ((llms.match(/https:\/\/liontechinnovations\.co\.uk\/industries\/[a-z-]+/g) ?? []).length !== 20) failures.push('llms.txt: expected 20 industry hub links');

const key = 'ea2e1642bf8083743785ff72bd130b4e';
if ((await readFile(join(publicDirectory, `${key}.txt`), 'utf8')).trim() !== key) failures.push('IndexNow key file content mismatch');

const industryFiles = await readdir(join(publicDirectory, 'ai-data', 'industries'));
if (industryFiles.length !== 20) failures.push(`AI-data: expected 20 industry files, received ${industryFiles.length}`);
const aiDataFiles = ['index.json', 'source-manifest.json', 'content-review-manifest.json', 'release-cohorts.json', ...industryFiles.map((name) => `industries/${name}`)];
for (const filename of aiDataFiles) {
  const text = await readFile(join(publicDirectory, 'ai-data', filename), 'utf8');
  try { JSON.parse(text); } catch (error) { failures.push(`AI-data ${filename}: ${error.message}`); }
  if (/vercel\.app|localhost|127\.0\.0\.1/i.test(text)) failures.push(`AI-data ${filename}: preview/local URL detected`);
  if (/registeredOffice|streetAddress|addressLocality|addressRegion|postalCode|PostalAddress/i.test(text)) failures.push(`AI-data ${filename}: prohibited private-location field detected`);
}

const entityIndex = JSON.parse(await readFile(join(publicDirectory, 'ai-data', 'index.json'), 'utf8'));
if (JSON.stringify(Object.keys(entityIndex.entity).sort()) !== JSON.stringify(['companiesHouseUrl', 'companyNumber', 'legalName', 'location', 'website'])) failures.push('AI-data index entity key set is invalid');

const releaseManifest = JSON.parse(await readFile(join(publicDirectory, 'ai-data', 'release-cohorts.json'), 'utf8'));
if (releaseManifest.cohortCount !== 5 || releaseManifest.routeCount !== 100 || releaseManifest.cohorts.length !== 5) failures.push('Release cohort manifest inventory is invalid');
for (const cohort of releaseManifest.cohorts) {
  const sitemap = await readFile(join(publicDirectory, cohort.sitemapFile), 'utf8');
  const sitemapRoutes = [...sitemap.matchAll(/<loc>https:\/\/liontechinnovations\.co\.uk([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (JSON.stringify(sitemapRoutes) !== JSON.stringify(cohort.routes)) failures.push(`${cohort.id}: sitemap routes do not match the release cohort`);
}

const reviewManifest = JSON.parse(await readFile(join(publicDirectory, 'ai-data', 'content-review-manifest.json'), 'utf8'));
if (reviewManifest.approvedRouteCount !== 0 || reviewManifest.pendingRouteCount !== 100 || reviewManifest.routes.some((route) => route.approvalStatus !== 'pending')) failures.push('Content review manifest must keep all routes pending');

process.stdout.write(`SEO artifacts: sitemapUrls=${urls.length} aiDataFiles=${aiDataFiles.length} llmsIndustryLinks=20 releaseCohorts=5\n`);
process.stdout.write(`SEO artifact failures: ${failures.length}\n`);
if (failures.length) throw new Error(failures.join('\n'));
