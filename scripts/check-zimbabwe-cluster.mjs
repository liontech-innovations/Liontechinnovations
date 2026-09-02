import assert from 'node:assert/strict';
import { readFile, access, mkdir, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const decode = s => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const strip = s => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const tokens = s => s.toLowerCase().match(/[a-z0-9]+(?:'[a-z]+)?/g) ?? [];
const banned = ['do not pitch', 'ability to pay', 'founder energy', 'cheap redesign', 'cheap rebuild', 'obvious upsell', 'reluctant buyer', 'targeted only', 'selective', 'a-tier', 'b-tier', 'sales score', 'willingness to pay', 'number one in zimbabwe', 'top ranked', 'best ai company in zimbabwe', '£395'];
const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false } });
try {
  const { zimbabweIndustries: industries, zimbabweIndustryRoutes: routes } = await vite.ssrLoadModule('/src/content/zimbabweIndustries.ts');
  const { zimbabweGateQuestions } = await vite.ssrLoadModule('/src/content/zimbabweGates.ts');
  const { prerenderRoutes } = await vite.ssrLoadModule('/src/prerender.tsx');
  const { routeInventory } = await vite.ssrLoadModule('/src/routes/AppRoutes.tsx');
  const { getActiveNavigationHref } = await vite.ssrLoadModule('/src/content/navigation.ts');
  assert.equal(industries.length, 26); assert.equal(new Set(routes).size, 26);
  for (const field of ['seoTitle', 'metaDescription', 'h1', 'summary', 'context']) assert.equal(new Set(industries.map(p => p[field])).size, 26, `${field} must be unique`);
  const faqQuestions = industries.flatMap(p => p.faq.map(f => f.question));
  assert.equal(new Set(faqQuestions).size, faqQuestions.length, 'FAQ questions must be sector-specific');
  const sitemap = await readFile(resolve(root, 'public/sitemap-zimbabwe.xml'), 'utf8');
  assert.deepEqual([...sitemap.matchAll(/<loc>https:\/\/liontechinnovations.co.uk([^<]+)<\/loc>/g)].map(m => m[1]), routes);
  const pillar = await readFile(resolve(root, 'dist/zimbabwe/index.html'), 'utf8');
  const config = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'));
  assert.ok(config.rewrites.some(r => r.source === '/zimbabwe/:sector' && r.destination === '/zimbabwe/:sector/index.html'));
  const pages = [];
  for (const [index, industry] of industries.entries()) {
    const path = routes[index];
    assert.match(path, /^\/zimbabwe\/[a-z-]+$/); assert.ok(path.length < 100);
    assert.ok(prerenderRoutes.includes(path)); assert.ok(routeInventory.programmatic.includes(path));
    assert.equal(getActiveNavigationHref(path), '/zimbabwe');
    assert.ok(pillar.includes(`href="${path}"`), `Orphan: ${path}`);
    assert.equal(zimbabweGateQuestions[industry.slug].length, 5);
    assert.ok(industry.relatedSlugs.length >= 2 && industry.relatedSlugs.length <= 4);
    assert.equal(new Set(industry.relatedSlugs).size, industry.relatedSlugs.length);
    const html = await readFile(resolve(root, `dist${path}/index.html`), 'utf8');
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
    const text = strip(main);
    assert.equal((main.match(/<h1\b/g) ?? []).length, 1);
    assert.equal(decode(html.match(/<title>(.*?)<\/title>/)[1]), industry.seoTitle);
    assert.ok(html.includes(`content="${industry.metaDescription.replaceAll('&', '&amp;')}"`));
    assert.ok(html.includes(`<link rel="canonical" href="https://liontechinnovations.co.uk${path}"`));
    assert.ok(html.includes('name="robots" content="index,follow"'));
    assert.ok(!html.includes('liontech-hero-poster.jpg'));
    assert.ok(!html.includes('/__founder-review/'), 'Watermarked image must not enter release HTML');
    assert.ok(!html.includes('href="/contact#snapshot-enquiry"'));
    for (const phrase of banned) assert.ok(!text.toLowerCase().includes(phrase), `${path}: banned ${phrase}`);
    for (const price of ['US$750', 'From US$2,500', 'From US$2,750']) assert.ok(text.includes(price), `${path}: price ${price}`);
    assert.ok(main.includes('href="/zimbabwe#zimbabwe-enquiry"'));
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m => JSON.parse(m[1]));
    const faq = schemas.find(s => s['@type'] === 'FAQPage');
    assert.deepEqual(faq.mainEntity.map(q => ({question:q.name, answer:q.acceptedAnswer.text})), industry.faq);
    for (const item of industry.faq) assert.ok(text.includes(item.question) && text.includes(item.answer));
    const crumbs = schemas.find(s => s['@type'] === 'BreadcrumbList').itemListElement;
    assert.equal(crumbs.length, 3); assert.equal(crumbs[2].item, `https://liontechinnovations.co.uk${path}`);
    const service = schemas.find(s => s['@type'] === 'Service');
    assert.equal(service.offers.price, '750'); assert.equal(service.offers.priceCurrency, 'USD');
    assert.equal(service.provider['@id'], 'https://liontechinnovations.co.uk/#organization');
    assert.equal(service.areaServed, 'Zimbabwe');
    for (const slug of industry.relatedSlugs) { assert.notEqual(slug, industry.slug); assert.ok(routes.includes(`/zimbabwe/${slug}`)); assert.ok(main.includes(`href="/zimbabwe/${slug}"`)); }
    for (const [, href] of main.matchAll(/href="(\/[^"]*)"/g)) {
      const [target, hash] = href.split('#');
      assert.ok(target === '/' || target === '/zimbabwe' || routes.includes(target), `${path}: bad link ${href}`);
      if (hash && target === '/zimbabwe') assert.ok(pillar.includes(`id="${hash}"`), `Missing anchor ${href}`);
    }
    for (const [, src] of main.matchAll(/<img[^>]*src="(\/assets\/[^"]+)"/g)) await access(resolve(root, 'public', src.slice(1)));
    for (const id of ['sector-context','readiness-problems','liontech-scope','sector-use-cases','sector-foundations','readiness-checks','controlled-delivery','sector-faq','sector-review','related-zimbabwe-industries']) assert.ok(main.includes(`id="${id}"`));
    pages.push({ path, text, words: tokens(text) });
  }
  // Word coverage by repeated eight-word sequences across the cluster. Includes
  // shared template copy, excludes global header/footer. Not a vocabulary score.
  const owners = new Map();
  for (const [pageIndex, page] of pages.entries()) for (let i=0; i<=page.words.length-8; i++) {
    const shingle=page.words.slice(i,i+8).join(' '); if (!owners.has(shingle)) owners.set(shingle,new Set()); owners.get(shingle).add(pageIndex);
  }
  const quality = pages.map(page => {
    const shared = new Set();
    for(let i=0;i<=page.words.length-8;i++) if(owners.get(page.words.slice(i,i+8).join(' ')).size>1) for(let j=i;j<i+8;j++) shared.add(j);
    const uniquePercent=Math.round((1-shared.size/page.words.length)*1000)/10;
    assert.ok(page.words.length>=650, `${page.path}: only ${page.words.length} words`);
    assert.ok(uniquePercent>=40, `${page.path}: only ${uniquePercent}% differentiated copy`);
    return {path:page.path,words:page.words.length,uniquePercent};
  });
  assert.ok(!(await readdir(resolve(root,'public/assets/zimbabwe/sectors'))).some(f => /banknote/i.test(f)));
  const out = resolve(root,'artifacts/zimbabwe-page/cluster'); await mkdir(out,{recursive:true});
  await writeFile(resolve(out,'content-qa.json'),JSON.stringify({routes:routes.length,bannedPhraseCount:0,quality,approval:'pending-founder-review'},null,2));
  console.table(quality);
  console.log('Zimbabwe cluster PASS: 26 routes; unique metadata/FAQ; Five Gates; valid schema, links and sitemap; zero banned phrases; no preview-only image in release HTML.');
} finally { await vite.close(); }
