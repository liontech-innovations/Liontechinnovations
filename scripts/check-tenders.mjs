import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { createHash } from 'node:crypto';
const root = resolve(import.meta.dirname, '..');
const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true, hmr: false } });
const assetHashes = {
  'tender-hero-meeting-640.webp':'d2e51534d54c60853b70809e510d192646681a2aa96e59a2b3859b2022586160',
  'tender-hero-meeting-960.webp':'f1bd2a906d885ae78d0e56c7b0c82e48eb910fa8bbfb8c3907d3a8bda9847037',
  'tender-hero-meeting-1440.webp':'7802d5cb1e26ae128e7d70a66ee0cd23a08424625cf8ba98e6aab7e1e5b665e2',
  'tender-hero-meeting-1672.webp':'27bae2782e6159011a24ce5d533f91c148289f5dd5b7a34eb3aeb7bf20308b9c',
  'tender-support-illustration-640.webp':'b574890134255f8ae6eff3e8671632df9b03288575cb195d67e5f49da5715674',
  'tender-support-illustration-960.webp':'6857ca4f8258bba52e6e667083869d3d7386f96812e9cc9c529fcdaced57b062',
  'tender-support-illustration-1440.webp':'952869133c31a548dcdec580f930d9915bb95d8a09fa081c5eafdae7b194e53a',
  'tender-support-illustration-1672.webp':'2479acd3fe7fb9f84ea578bd1a9e6a72519ce2dba8e3f946f59def8532cdaeb7',
};
try {
  for (const [file,hash] of Object.entries(assetHashes)) for (const folder of ['public','dist']) {
    assert.equal(createHash('sha256').update(await readFile(resolve(root,folder,'assets/tenders',file))).digest('hex'),hash, `${folder}/${file} differs from the approved web asset`);
  }
  const { tenderPages, tenderRoutes, tendersPreview, publishedTenderRoutes, isTenderPublished } = await vite.ssrLoadModule('/src/content/tenders/index.ts');
  const { tenderPreviewCohorts, tenderProductionCohorts, tenderHubReview, tenderReviews, tenderReleaseEnabled } = await vite.ssrLoadModule('/src/content/tenders/release.ts');
  assert.deepEqual(Object.keys(tenderReviews).sort(),tenderPages.filter(page=>page.cohort===1).map(page=>page.slug).sort(),'Prepare exactly five page-specific approval records plus the hub');
  if (!tenderReleaseEnabled) for (const record of [tenderHubReview,...Object.values(tenderReviews)]) {
    assert.equal(record.reviewStatus,'draft'); assert.equal(record.publishStatus,'draft');
    assert.equal(record.reviewedBy,null); assert.equal(record.reviewedAt,null); assert.equal(record.publishedAt,null);
  }
  const { tenderSources } = await vite.ssrLoadModule('/src/content/tenders/sources.ts');
  const { csvCell, tenderCsv, tenderWorksheet } = await vite.ssrLoadModule('/src/content/tenders/downloads.ts');
  const config = JSON.parse(await readFile(resolve(root,'vercel.json'),'utf8'));
  const rewrites = new Map(config.rewrites.map(r => [r.source,r.destination]));
  assert.equal(rewrites.get('/tenders/:path*'),'/api/tender-not-found');
  assert.equal(rewrites.get('/downloads/tenders/:path*'),'/api/tender-not-found');
  assert.equal(tenderPages.length,25);
  assert.deepEqual(['sector','guide','template'].map(type=>tenderPages.filter(p=>p.type===type).length),[8,9,8]);
  assert.deepEqual([1,2,3].map(cohort=>tenderPages.filter(p=>p.cohort===cohort).length),[5,10,10]);
  if (tendersPreview) assert.deepEqual(tenderRoutes, ['/tenders', ...tenderPages.filter(p=>tenderPreviewCohorts.includes(p.cohort)).map(p=>p.path)]);
  const sitemapTenderUrls = new Set();
  const titles=new Set(), descriptions=new Set(), answers=new Set();
  const similarity = text => new Set(text.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean).map((_,i,a)=>a.slice(i,i+4).join(' ')));
  let highest={score:0,pair:[]};
  for (const page of tenderPages) {
    if (page.reviewStatus === 'draft') { assert.equal(page.reviewedBy,null); assert.equal(page.reviewedAt,null); }
    else { assert(page.reviewedBy && page.reviewedAt && Number.isFinite(Date.parse(page.reviewedAt)), 'Approval requires an actual reviewer and valid date'); }
    if (page.publishStatus === 'published') assert(isTenderPublished(page), 'Published pages require approval and publication evidence');
    if (!tenderPreviewCohorts.includes(page.cohort) && !tenderProductionCohorts.includes(page.cohort)) { assert.equal(page.reviewStatus,'draft'); assert.equal(page.publishStatus,'draft'); }
    assert(!titles.has(page.title)); titles.add(page.title); assert(!descriptions.has(page.description)); descriptions.add(page.description); assert(!answers.has(page.answer)); answers.add(page.answer);
    assert.equal(page.utility.fields.length,page.fieldHelp.length);
    assert.equal(page.faqs.length,3); assert.equal(page.related.length,3);
    assert(page.steps.length >= 4 && page.mistakes.length >= 3 && page.sections.length >= 2);
    assert.match(page.example,/fictional/i);
    for(const path of page.related) assert(tenderPages.some(p=>p.path===path));
    for(const section of page.sections) if(section.source) { const source=tenderSources[section.source]; assert(source?.supports && source.scope && source.checkedAt); assert.equal(new URL(source.url).protocol,'https:'); }
    if (tenderPreviewCohorts.includes(page.cohort) || tenderProductionCohorts.includes(page.cohort)) assert.equal(rewrites.get(page.path),`${page.path}/index.html`);
    else assert.equal(rewrites.has(page.path),false,'Unreleased cohorts must use the genuine 404 fallback');
    const htmlPath=resolve(root,'dist',page.path.slice(1),'index.html');
    if(tenderRoutes.includes(page.path)) {
      const html=await readFile(htmlPath,'utf8');
      assert(!/(?:Proposed £|£149|£2,450|£3,950|tax treatment|VAT-inclusive|VAT-exclusive|initial deposit|checkout totals)/i.test(html),'Resources must not advertise unapproved tender pricing/tax terms');
      assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
      assert(html.includes(page.h1.replaceAll('&','&amp;')));
      assert(html.includes(`name="robots" content="${tendersPreview || !isTenderPublished(page) ? 'noindex,follow' : 'index,follow'}"`));
      assert(html.includes(`rel="canonical" href="https://liontechinnovations.co.uk${page.path}"`));
      assert(html.includes(page.answer.replaceAll('&','&amp;').replaceAll("'",'&#x27;')));
      assert(!html.includes('"@type":"FAQPage"'));
      const schema=JSON.parse(html.match(/id="route-structured-data" type="application\/ld\+json">([^<]+)</)[1]);
      assert(schema.some(s=>s['@type']==='BreadcrumbList'));
      assert(schema.some(s=>s['@type']===(page.type==='guide'?'Article':'WebPage')));
      for(const path of page.related) assert(html.includes(`href="${path}"`));
      assert.match(html,new RegExp(`<a[^>]*href="/tenders\\?source=${page.slug}#enquiry"[^>]*>Request Tender Support</a>`));
      for(const match of html.matchAll(/href="(\/tenders\/[^"?#]+)(?:[?#][^"]*)?"/g)) assert(tenderRoutes.includes(match[1]),'No links to unavailable resources');
      for(const ext of ['csv','md']) {
        const file=await readFile(resolve(root,'dist/downloads/tenders',`${page.slug}.${ext}`),'utf8');
        assert.equal(file,ext==='csv'?tenderCsv(page):tenderWorksheet(page),'Download must exactly match its authored page fields and guidance');
        for(const field of page.utility.fields) assert(file.toLowerCase().includes(field.toLowerCase()));
        assert(file.length > 50); // Detect an empty or placeholder download, not an article word target.
      }
    } else {
      await assert.rejects(access(htmlPath), 'Unreleased HTML must not be emitted for a production build');
      await assert.rejects(access(resolve(root,'dist/downloads/tenders',`${page.slug}.csv`)));
      await assert.rejects(access(resolve(root,'dist/downloads/tenders',`${page.slug}.md`)));
    }
  }
  for(let a=0;a<tenderPages.length;a++) for(let b=a+1;b<tenderPages.length;b++) {
    const text=p=>JSON.stringify({answer:p.answer,steps:p.steps,sections:p.sections,fieldHelp:p.fieldHelp,example:p.example,mistakes:p.mistakes,faqs:p.faqs});
    const first=similarity(text(tenderPages[a])),second=similarity(text(tenderPages[b]));
    const shared=[...first].filter(x=>second.has(x)).length;
    const score=shared/(first.size+second.size-shared);
    if(score>highest.score) highest={score,pair:[tenderPages[a].slug,tenderPages[b].slug]};
  }
  assert(highest.score < .5, 'Main content overlap needs editorial investigation');
  for(const file of (await readdir(resolve(root,'dist'))).filter(f=>/^sitemap.*\.xml$/.test(f))) {
    const xml = await readFile(resolve(root,'dist',file),'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) { const path = new URL(match[1]).pathname; if (path.startsWith('/tenders')) sitemapTenderUrls.add(path); }
  }
  assert.deepEqual([...sitemapTenderUrls].sort(), [...publishedTenderRoutes].sort(), 'Only approved published tender pages belong in the sitemap');
  for(const value of ['=SUM(A1)',' +CMD','@attack','-command']) assert(csvCell(value).startsWith('"\''));
  if(tenderRoutes.includes('/tenders')) {
    const html=await readFile(resolve(root,'dist/tenders/index.html'),'utf8');
    assert.match(html,/Your expertise/);
    assert.match(html,/<a[^>]*href="\/tenders#enquiry"[^>]*>Request Tender Support<\/a>/);
    assert(!/(?:£\s*\d|\bVAT\b|tax treatment|initial deposit|checkout totals|class="lt-tender-offer")/i.test(html),'Initial served HTML must be enquiry-only, without proposed pricing/tax wording');
  }
  else {
    await assert.rejects(access(resolve(root,'dist/tenders/index.html')));
    for (const route of ['index.html','ai-business-readiness/index.html']) {
      const html=await readFile(resolve(root,'dist',route),'utf8');
      assert(!html.includes('href="/tenders"'),'Unreleased discovery links must not appear in production HTML');
    }
    const bundles = await Promise.all((await readdir(resolve(root,'dist/assets'))).filter(file=>file.endsWith('.js')).map(file=>readFile(resolve(root,'dist/assets',file),'utf8')));
    for (const marker of ['Download blank CSV','Tender Fit Review','Your expertise. A stronger tender response.']) assert(!bundles.some(bundle=>bundle.includes(marker)), 'Unreleased tender UI should be removed from the production bundle');
  }
  console.log(JSON.stringify({status:'PASS',preview:tendersPreview,contentRecords:25,reviewed:tenderPages.filter(p=>p.reviewStatus==='approved').length,published:publishedTenderRoutes.length,prerenderedTenderRoutes:tenderRoutes.length,downloads:tenderRoutes.filter(path=>path!=='/tenders').length*2,draftsInSitemap:0,highestContentOverlap:highest,approvedAssetHashes:8},null,2));
} finally { await vite.close(); }
