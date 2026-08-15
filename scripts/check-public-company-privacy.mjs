import { readdir, readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const scanRoots = ['src', 'public', 'dist', 'api'];
const rootFiles = ['index.html', 'metadata.json', 'vercel.json'];
const textExtensions = new Set([
  '.css', '.html', '.js', '.jsx', '.json', '.md', '.mjs', '.svg', '.ts', '.tsx', '.txt', '.xml',
]);

const prohibitedPatterns = [
  { id: 'registered-office-property', pattern: /registeredOffice/i },
  { id: 'street-address-property', pattern: /streetAddress/i },
  { id: 'address-locality-property', pattern: /addressLocality/i },
  { id: 'address-region-property', pattern: /addressRegion/i },
  { id: 'postal-code-property', pattern: /postalCode/i },
  { id: 'postal-address-type', pattern: /postal(?:\s|&nbsp;|&#160;|%20|[-_])*address/i },
  { id: 'visible-registered-office-label', pattern: /registered\s+office\s*:/i },
  { id: 'visible-company-postal-label', pattern: /postal\s*:\s*Lion\s+Tech\s+Innovations\s+Ltd/i },
];

const requiredPublicFacts = [
  { id: 'legal-name', pattern: /Lion Tech Innovations Ltd/ },
  { id: 'company-number', pattern: /17068390/ },
  { id: 'companies-house-link', pattern: /https:\/\/find-and-update\.company-information\.service\.gov\.uk\/company\/17068390/ },
  { id: 'public-location', pattern: /Manchester-based, serving UK businesses remotely/ },
  { id: 'general-email', pattern: /contact@liontechinnovations\.co\.uk/ },
  { id: 'privacy-email', pattern: /privacy@liontechinnovations\.co\.uk/ },
];

async function collectFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const child = resolve(path, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(child));
    else if (entry.isFile() && textExtensions.has(extname(entry.name).toLowerCase())) files.push(child);
  }

  return files;
}

const files = [];
for (const root of scanRoots) {
  try {
    files.push(...await collectFiles(resolve(projectRoot, root)));
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}
for (const file of rootFiles) files.push(resolve(projectRoot, file));

const findings = [];
let publicText = '';

for (const file of files) {
  const content = await readFile(file, 'utf8');
  publicText += `\n${content}`;

  for (const { id, pattern } of prohibitedPatterns) {
    if (pattern.test(content)) findings.push({ file, id });
  }
}

const missingFacts = requiredPublicFacts.filter(({ pattern }) => !pattern.test(publicText));

if (findings.length || missingFacts.length) {
  for (const { file, id } of findings) {
    process.stderr.write(`Public privacy violation [${id}]: ${file.slice(projectRoot.length + 1)}\n`);
  }
  for (const { id } of missingFacts) process.stderr.write(`Missing approved public company fact: ${id}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Public company privacy gate passed across ${files.length} files.\n`);
  process.stdout.write(`Approved public company facts present: ${requiredPublicFacts.length}.\n`);
}
