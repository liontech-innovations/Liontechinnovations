import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDirectory = join(projectRoot, 'public');
const aiDataDirectory = join(publicDirectory, 'ai-data');
const reviewedAt = '2026-08-15';
const siteUrl = 'https://liontechinnovations.co.uk';

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const urlset = (paths) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${escapeXml(new URL(path, siteUrl).toString())}</loc><lastmod>${reviewedAt}</lastmod></url>`).join('\n')}
</urlset>
`;

const sitemapIndex = (files) => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map((file) => `  <sitemap><loc>${siteUrl}/${file}</loc><lastmod>${reviewedAt}</lastmod></sitemap>`).join('\n')}
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
  const artifactModule = await vite.ssrLoadModule('/src/content/industries/artifacts.ts');
  const { industries } = industryModule;
  const {
    coreSitemapRoutes,
    createIndustryIndexRecord,
    createIndustryPublicRecord,
    industrySitemapGroups,
  } = artifactModule;

  await rm(aiDataDirectory, { recursive: true, force: true });
  await mkdir(join(aiDataDirectory, 'industries'), { recursive: true });
  await writeFile(join(aiDataDirectory, 'index.json'), `${JSON.stringify(createIndustryIndexRecord(), null, 2)}\n`, 'utf8');

  for (const industry of industries) {
    const target = join(aiDataDirectory, 'industries', `${industry.slug}.json`);
    await writeFile(target, `${JSON.stringify(createIndustryPublicRecord(industry), null, 2)}\n`, 'utf8');
  }

  const sitemapFiles = ['sitemap-core.xml', ...industrySitemapGroups.map((_, index) => `sitemap-industries-${index + 1}.xml`)];
  await writeFile(join(publicDirectory, 'sitemap.xml'), sitemapIndex(sitemapFiles), 'utf8');
  await writeFile(join(publicDirectory, 'sitemap-core.xml'), urlset(coreSitemapRoutes), 'utf8');
  for (const [index, pages] of industrySitemapGroups.entries()) {
    await writeFile(join(publicDirectory, `sitemap-industries-${index + 1}.xml`), urlset(pages.map((page) => page.path)), 'utf8');
  }

  process.stdout.write(`Generated 21 AI-data records and ${sitemapFiles.length + 1} sitemap files.\n`);
} finally {
  await vite.close();
}
