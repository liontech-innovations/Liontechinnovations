import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const key = 'ea2e1642bf8083743785ff72bd130b4e';
const host = 'liontechinnovations.co.uk';
const siteUrl = `https://${host}`;
const submit = process.argv.includes('--submit');

const sitemapFiles = [
  'sitemap-core.xml',
  'sitemap-industries-1.xml',
  'sitemap-industries-2.xml',
  'sitemap-industries-3.xml',
  'sitemap-industries-4.xml',
  'sitemap-industries-5.xml',
];

const urls = [];
for (const filename of sitemapFiles) {
  const xml = await readFile(join(projectRoot, 'public', filename), 'utf8');
  for (const match of xml.matchAll(/<loc>(https:\/\/liontechinnovations\.co\.uk\/[^<]*)<\/loc>/g)) urls.push(match[1]);
}

if (new Set(urls).size !== urls.length) throw new Error('IndexNow URL inventory contains duplicates.');
if (urls.length !== 118) throw new Error(`Expected 118 public URLs for IndexNow, received ${urls.length}.`);

const payload = {
  host,
  key,
  keyLocation: `${siteUrl}/${key}.txt`,
  urlList: urls,
};

if (!submit) {
  process.stdout.write(`IndexNow dry run: status=NOT_SUBMITTED urlCount=${urls.length} batchCount=1\n`);
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

process.stdout.write(`IndexNow submission: status=${response.status} urlCount=${urls.length} batchCount=1\n`);
if (!response.ok && response.status !== 202) process.exitCode = 1;
