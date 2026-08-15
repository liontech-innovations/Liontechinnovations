import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const expectedImageUrl = 'https://liontechinnovations.co.uk/assets/ogliontech.png';
const expectedAlt = 'LionTech Innovations — AI Business Readiness and AI Visibility';
const expectedHash = 'e51c0947be32610a5333cb24a3198bfce179ee6814fcdf73d49c969f19394f11';
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

function inspectPng(buffer, label) {
  assert(buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a', `${label}: invalid PNG signature`);
  assert(buffer.readUInt32BE(16) === 1731, `${label}: expected width 1731, received ${buffer.readUInt32BE(16)}`);
  assert(buffer.readUInt32BE(20) === 909, `${label}: expected height 909, received ${buffer.readUInt32BE(20)}`);
  assert(createHash('sha256').update(buffer).digest('hex') === expectedHash, `${label}: SHA-256 mismatch`);
}

function metaContent(html, attribute, value) {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+[^>]*${attribute}=["']${escapedValue}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
  const reversePattern = new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*${attribute}=["']${escapedValue}["'][^>]*>`, 'i');
  return html.match(pattern)?.[1] ?? html.match(reversePattern)?.[1];
}

function validateMetadata(html, label, canonicalPath) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  assert(metaContent(head, 'property', 'og:image') === expectedImageUrl, `${label}: og:image changed`);
  assert(metaContent(head, 'name', 'twitter:image') === expectedImageUrl, `${label}: twitter:image changed`);
  assert(metaContent(head, 'property', 'og:image:type') === 'image/png', `${label}: og:image:type changed`);
  assert(metaContent(head, 'property', 'og:image:width') === '1731', `${label}: og:image:width changed`);
  assert(metaContent(head, 'property', 'og:image:height') === '909', `${label}: og:image:height changed`);
  assert(metaContent(head, 'property', 'og:image:alt') === expectedAlt, `${label}: og:image:alt changed`);
  assert(metaContent(head, 'name', 'twitter:image:alt') === expectedAlt, `${label}: twitter:image:alt changed`);
  assert(metaContent(head, 'name', 'twitter:card') === 'summary_large_image', `${label}: twitter card changed`);
  assert(head.includes(`<link rel="canonical" href="https://liontechinnovations.co.uk${canonicalPath}"`), `${label}: canonical changed`);
  assert(!/vercel\.app|localhost|127\.0\.0\.1/i.test(head), `${label}: preview or local URL leaked into metadata`);
  assert(!/London-based|infrastructure-only/i.test(head), `${label}: retired positioning appears in metadata`);
  assert(!/registered\s+office|streetAddress|addressLocality|addressRegion|postalCode|PostalAddress/i.test(head), `${label}: private-location data appears in metadata`);
  assert(!/og:image[^>]+(?:data:|base64)/i.test(head), `${label}: embedded OG image found`);
}

inspectPng(await readFile(join(projectRoot, 'public', 'assets', 'ogliontech.png')), 'public OG asset');
inspectPng(await readFile(join(projectRoot, 'dist', 'assets', 'ogliontech.png')), 'dist OG asset');

validateMetadata(await readFile(join(projectRoot, 'index.html'), 'utf8'), 'source index', '/');

const prerenderedRoutes = [
  ['homepage', join(projectRoot, 'dist', 'index.html'), '/'],
  ['Snapshot', join(projectRoot, 'dist', 'ai-visibility-snapshot', 'index.html'), '/ai-visibility-snapshot'],
  ['AI Business Readiness', join(projectRoot, 'dist', 'ai-business-readiness', 'index.html'), '/ai-business-readiness'],
  ['Industries directory', join(projectRoot, 'dist', 'industries', 'index.html'), '/industries'],
  ['representative industry guide', join(projectRoot, 'dist', 'industries', 'accountancy-firms', 'ai-visibility', 'index.html'), '/industries/accountancy-firms/ai-visibility'],
];

for (const [label, path, canonicalPath] of prerenderedRoutes) {
  validateMetadata(await readFile(path, 'utf8'), label, canonicalPath);
}

const companySource = await readFile(join(projectRoot, 'src', 'content', 'company.ts'), 'utf8');
assert(companySource.includes("ogImage: '/assets/ogliontech.png'"), 'company OG image source changed');

process.stdout.write(`OG social card asset: 1731x909 sha256=${expectedHash}\n`);
process.stdout.write(`OG metadata routes checked: ${prerenderedRoutes.length}\n`);
process.stdout.write(`OG social card failures: ${failures.length}\n`);
if (failures.length) throw new Error(failures.join('\n'));
