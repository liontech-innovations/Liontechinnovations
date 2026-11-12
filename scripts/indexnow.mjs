import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const key = 'ea2e1642bf8083743785ff72bd130b4e';
const host = 'liontechinnovations.co.uk';
const siteUrl = `https://${host}`;
const submit = process.argv.includes('--submit');
const all = process.argv.includes('--all');
const research = process.argv.includes('--research');
const cohortArgument = process.argv.indexOf('--cohort');
const cohortId = cohortArgument >= 0 ? process.argv[cohortArgument + 1] : undefined;

if ([all, research, Boolean(cohortId)].filter(Boolean).length !== 1) throw new Error('Choose exactly one release scope: --all, --research or --cohort <id>.');

const sitemapFiles = [
  'sitemap-core.xml',
  'sitemap-industries-1.xml',
  'sitemap-industries-2.xml',
  'sitemap-industries-3.xml',
  'sitemap-industries-4.xml',
  'sitemap-industries-5.xml',
];

let urls;
let scope;
if (research) {
  const vite = await createServer({ root: projectRoot, configFile: false, appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
  try {
    const { researchRoutes } = await vite.ssrLoadModule('/src/content/research.ts');
    urls = researchRoutes.map(path => new URL(path, siteUrl).toString());
  } finally { await vite.close(); }
  scope = 'research-2026-11-12';
} else if (all) {
  urls = [];
  for (const filename of sitemapFiles) {
    const xml = await readFile(join(projectRoot, 'public', filename), 'utf8');
    for (const match of xml.matchAll(/<loc>(https:\/\/liontechinnovations\.co\.uk\/[^<]*)<\/loc>/g)) urls.push(match[1]);
  }
  const vite = await createServer({ root: projectRoot, configFile: false, appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
  try {
    const { coreSitemapRoutes } = await vite.ssrLoadModule('/src/content/industries/artifacts.ts');
    const { programmaticRoutes } = await vite.ssrLoadModule('/src/content/industries/index.ts');
    const { publishedTenderRoutes } = await vite.ssrLoadModule('/src/content/tenders/index.ts');
    const { researchRoutes } = await vite.ssrLoadModule('/src/content/research.ts');
    const expected = new Set([...coreSitemapRoutes, ...programmaticRoutes, ...publishedTenderRoutes, ...researchRoutes].map(path => new URL(path, siteUrl).toString()));
    if (urls.length !== expected.size || urls.some(url => !expected.has(url))) throw new Error('IndexNow sitemap inventory does not exactly match the authored public route registry.');
  } finally { await vite.close(); }
  scope = 'all-public-routes';
} else {
  const manifest = JSON.parse(await readFile(join(projectRoot, 'public', 'ai-data', 'release-cohorts.json'), 'utf8'));
  const cohort = manifest.cohorts.find((candidate) => candidate.id === cohortId);
  if (!cohort) throw new Error(`Unknown release cohort: ${cohortId}`);
  if (cohort.releaseStatus !== manifest.status || cohort.routes.length !== 20) throw new Error(`Release cohort is incomplete: ${cohortId}`);
  urls = cohort.routes.map((path) => new URL(path, siteUrl).toString());
  scope = cohort.id;
}

if (new Set(urls).size !== urls.length) throw new Error('IndexNow URL inventory contains duplicates.');
if (urls.some((url) => !url.startsWith(`${siteUrl}/`) || /#|vercel\.app|localhost|127\.0\.0\.1/i.test(url))) throw new Error('IndexNow URL inventory contains a non-production or fragment URL.');

const payload = {
  host,
  key,
  keyLocation: `${siteUrl}/${key}.txt`,
  urlList: urls,
};

if (!submit) {
  process.stdout.write(`IndexNow dry run: status=NOT_SUBMITTED scope=${scope} urlCount=${urls.length} batchCount=1\n`);
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

process.stdout.write(`IndexNow submission: status=${response.status} scope=${scope} urlCount=${urls.length} batchCount=1\n`);
if (!response.ok && response.status !== 202) process.exitCode = 1;
