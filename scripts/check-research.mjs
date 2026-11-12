import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const base = 'https://liontechinnovations.co.uk';
const articles = JSON.parse(await readFile('docs/visibility/2026-11-12/articles/articles.json', 'utf8'));
const routes = ['/research', ...articles.map(article => article.path)];
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const sitemap = await readFile('dist/sitemap-core.xml', 'utf8');
for (const path of routes) {
  const html = await readFile(join('dist', path.slice(1), 'index.html'), 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one h1`);
  assert.ok(html.includes(`rel="canonical" href="${base}${path}"`), `${path}: canonical`);
  assert.ok(html.includes('content="index,follow"'), `${path}: indexable`);
  assert.ok(sitemap.includes(`<loc>${base}${path}</loc><lastmod>2026-11-12</lastmod>`), `${path}: sitemap date`);
  assert.ok(config.rewrites.some(rule => rule.source === path && rule.destination === path + '/index.html'), `${path}: exact rewrite`);
  const schema = JSON.parse(html.match(/<script id="route-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const org = schema.find(item => item['@type'] === 'Organization');
  assert.equal(org['@id'], base + '/#organization');
  assert.equal(org.sameAs.length, 2);
  const article = articles.find(item => item.path === path);
  if (article) {
    const structured = schema.find(item => item['@type'] === 'Article');
    assert.equal(structured.headline, article.title);
    assert.equal(structured.author.name, 'Freejoy Chimbizi');
    assert.equal(structured.datePublished, '2026-11-12');
    assert.equal(structured.publisher['@id'], org['@id']);
    assert.ok(html.includes('property="og:type" content="article"'));
    for (const item of [...article.sources, ...article.evidence]) assert.ok(html.includes(item.url.replaceAll('&','&amp;')), `${path}: ${item.url}`);
    for (const item of article.evidence) assert.ok((await readFile(join('dist', item.url.slice(1)))).length > 100);
  }
  for (const banned of ['INTERNAL-search-console', 'submission-register.json', 'Review manuscript', '12627856-publishers-and-developers-faq']) {
    assert.ok(!html.includes(banned), `${path}: excludes ${banned}`);
  }
}
const files = await readdir('public/research/evidence');
assert.deepEqual(files.sort(), ['payment_flow_simulation.py', 'payment_simulation_results.json', 'public-site-audit-2026-11-12.json'].sort());
const results = JSON.parse(await readFile('public/research/evidence/payment_simulation_results.json','utf8'));
assert.equal(results.pass_count,8); assert.equal(results.fail_count,0);
console.log(JSON.stringify({status:'PASS', routes, scope:'Prerendered article content, canonical, Article/Organization schema, evidence, exact rewrites and dated sitemap'}, null, 2));
