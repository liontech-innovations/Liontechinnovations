import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, 'dist/zimbabwe/index.html'), 'utf8');
const decode = (text) => text.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = decode(html).toLowerCase();
const banned = ['do not pitch', 'ability to pay', 'founder energy', 'cheap redesign', 'cheap rebuild', 'obvious upsell', 'reluctant buyer', 'weak buyer', 'high-paying client', 'low-value client', 'targeted only', 'selective', 'a-tier', 'b-tier', 'internal sales logic', 'sales score', 'willingness to pay', 'we can charge', 'we should charge'];
for (const phrase of banned) assert.ok(!text.includes(phrase), `Banned phrase: ${phrase}`);
for (const forbidden of ['£395', 'contact@liontechinnovations.co.uk', 'streetaddress', 'postaladdress', 'registeredoffice', '24/7 support']) assert.ok(!text.includes(forbidden), `Unexpected Zimbabwe content: ${forbidden}`);
const schemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap((match) => JSON.parse(match[1]));
const faq = schemas.find((schema) => schema['@type'] === 'FAQPage');
const service = schemas.find((schema) => schema['@type'] === 'Service');
const org = schemas.find((schema) => schema['@type'] === 'Organization');
assert.equal(service.offers.priceCurrency, 'USD'); assert.equal(service.offers.price, '750');
assert.equal(service.areaServed, 'Zimbabwe'); assert.equal(service.provider['@id'], org['@id']);
assert.equal(org['@id'], 'https://liontechinnovations.co.uk/#organization');
assert.equal(org.email, 'admin@liontechinnovations.co.uk');
assert.ok(html.includes('<link rel="canonical" href="https://liontechinnovations.co.uk/zimbabwe"'));
assert.ok(html.includes('content="https://liontechinnovations.co.uk/assets/zimbabwe/zimbabwe-og.png"'));
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.ok(!html.includes('href="/contact#snapshot-enquiry"'));
assert.ok(!html.includes('liontech-hero-poster.jpg'));
const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false } });
try {
  const { zimbabweFaq, zimbabweOffers, zimbabwe } = await vite.ssrLoadModule('/src/content/zimbabwe.ts');
  const { getActiveNavigationHref } = await vite.ssrLoadModule('/src/content/navigation.ts');
  assert.equal(getActiveNavigationHref('/zimbabwe'), '/zimbabwe');
  assert.equal(getActiveNavigationHref('/zimbabwe/'), '/zimbabwe');
  assert.equal(decode(html.match(/<title>(.*?)<\/title>/)[1]), zimbabwe.seoTitle);
  assert.ok(text.includes(zimbabwe.seoDescription.toLowerCase()));
  assert.deepEqual(faq.mainEntity.map((item) => ({ question: item.name, answer: item.acceptedAnswer.text })), zimbabweFaq);
  const visibleFaq = [...html.matchAll(/<details><summary>([^<]+)<svg[\s\S]*?<\/summary><p>(.*?)<\/p><\/details>/g)].map((match) => ({ question: decode(match[1]), answer: decode(match[2]) }));
  assert.deepEqual(visibleFaq, zimbabweFaq);
  for (const offer of zimbabweOffers) assert.ok(text.includes(offer.price.toLowerCase()));
} finally { await vite.close(); }
for (const image of ['harare-hero', 'harare-business-district', 'harare-digital-future', 'harare-infrastructure-cta']) {
  for (const suffix of ['.jpg', '-480.jpg', '-480.webp', '-960.webp', '-480.avif', '-960.avif']) assert.ok((await stat(resolve(root, `dist/assets/zimbabwe/${image}${suffix}`))).size > 0);
}
const sitemap = await readFile(resolve(root, 'public/sitemap-core.xml'), 'utf8');
assert.ok(sitemap.includes('<loc>https://liontechinnovations.co.uk/zimbabwe</loc>'));
const vercel = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'));
assert.ok(vercel.rewrites.some((rule) => rule.source === '/zimbabwe' && rule.destination === '/zimbabwe/index.html'));
console.log('Zimbabwe copy/SEO firewall: PASS. Banned phrases: 0. FAQ parity, USD service, canonical, assets, sitemap and prerender rewrite verified.');
