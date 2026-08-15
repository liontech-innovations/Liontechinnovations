import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const publicDirectory = join(projectRoot, 'public');
const failures = [];
const siteUrl = 'https://liontechinnovations.co.uk';
const reviewedAt = '2026-08-15';
const sitemapFiles = ['sitemap-core.xml', 'sitemap-industries-1.xml', 'sitemap-industries-2.xml', 'sitemap-industries-3.xml', 'sitemap-industries-4.xml', 'sitemap-industries-5.xml'];

const sitemapIndex = await readFile(join(publicDirectory, 'sitemap.xml'), 'utf8');
for (const filename of sitemapFiles) if (!sitemapIndex.includes(`${siteUrl}/${filename}`)) failures.push(`sitemap.xml: missing ${filename}`);
if ((sitemapIndex.match(/<sitemap>/g) ?? []).length !== 6) failures.push('sitemap.xml: expected six sitemap entries');

const urls = [];
for (const [index, filename] of sitemapFiles.entries()) {
  const xml = await readFile(join(publicDirectory, filename), 'utf8');
  const entries = [...xml.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)];
  const expected = index === 0 ? 18 : 20;
  if (entries.length !== expected) failures.push(`${filename}: expected ${expected} URLs, received ${entries.length}`);
  for (const [, url, lastmod] of entries) {
    if (!url.startsWith(`${siteUrl}/`) || /#|vercel\.app|localhost|127\.0\.0\.1/i.test(url)) failures.push(`${filename}: invalid public URL ${url}`);
    if (lastmod !== reviewedAt) failures.push(`${filename}: invalid lastmod ${lastmod}`);
    urls.push(url);
  }
}
if (urls.length !== 118 || new Set(urls).size !== 118) failures.push(`Sitemap inventory expected 118 unique URLs, received ${urls.length}/${new Set(urls).size}`);

const llms = await readFile(join(publicDirectory, 'llms.txt'), 'utf8');
for (const fact of ['Lion Tech Innovations Ltd', '17068390', 'Manchester-based, serving UK businesses remotely', siteUrl, `${siteUrl}/contact#snapshot-enquiry`, `${siteUrl}/ai-data/index.json`]) {
  if (!llms.includes(fact)) failures.push(`llms.txt: missing canonical fact ${fact}`);
}
if ((llms.match(/https:\/\/liontechinnovations\.co\.uk\/industries\/[a-z-]+/g) ?? []).length !== 20) failures.push('llms.txt: expected 20 industry hub links');

const key = 'ea2e1642bf8083743785ff72bd130b4e';
if ((await readFile(join(publicDirectory, `${key}.txt`), 'utf8')).trim() !== key) failures.push('IndexNow key file content mismatch');

const industryFiles = await readdir(join(publicDirectory, 'ai-data', 'industries'));
if (industryFiles.length !== 20) failures.push(`AI-data: expected 20 industry files, received ${industryFiles.length}`);
for (const filename of ['index.json', ...industryFiles.map((name) => `industries/${name}`)]) {
  const text = await readFile(join(publicDirectory, 'ai-data', filename), 'utf8');
  try { JSON.parse(text); } catch (error) { failures.push(`AI-data ${filename}: ${error.message}`); }
  if (/vercel\.app|localhost|127\.0\.0\.1/i.test(text)) failures.push(`AI-data ${filename}: preview/local URL detected`);
}

process.stdout.write(`SEO artifacts: sitemapUrls=${urls.length} aiDataFiles=${industryFiles.length + 1} llmsIndustryLinks=20\n`);
process.stdout.write(`SEO artifact failures: ${failures.length}\n`);
if (failures.length) throw new Error(failures.join('\n'));
