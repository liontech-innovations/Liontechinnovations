import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const key = 'ea2e1642bf8083743785ff72bd130b4e';
const host = 'liontechinnovations.co.uk';
const siteUrl = `https://${host}`;
const submit = process.argv.includes('--submit');
const all = process.argv.includes('--all');
const cohortArgument = process.argv.indexOf('--cohort');
const cohortId = cohortArgument >= 0 ? process.argv[cohortArgument + 1] : undefined;

if (all && cohortId) throw new Error('Choose either --all or --cohort <id>, not both.');
if (!all && !cohortId) throw new Error('Choose an explicit release scope with --all or --cohort <id>.');

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
if (all) {
  urls = [];
  for (const filename of sitemapFiles) {
    const xml = await readFile(join(projectRoot, 'public', filename), 'utf8');
    for (const match of xml.matchAll(/<loc>(https:\/\/liontechinnovations\.co\.uk\/[^<]*)<\/loc>/g)) urls.push(match[1]);
  }
  if (urls.length !== 118) throw new Error(`Expected 118 public URLs for the all-routes scope, received ${urls.length}.`);
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
