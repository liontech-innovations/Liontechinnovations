import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { preview } from 'vite';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'artifacts/zimbabwe-page/refinement');
const baselineMode = process.argv.includes('--baseline');
await mkdir(output, { recursive: true });
const protectedPaths = ['src/content/zimbabwe.ts', 'src/components/ZimbabweEnquiryForm.tsx', 'api/zimbabwe-enquiry.ts', 'src/styles/marketing.css', 'src/content/navigation.ts', 'src/content/routeSeo.ts', 'src/lib/schema.ts', 'src/components/layout/SiteHeader.tsx', 'src/components/layout/SiteFooter.tsx'];
for (const file of await readdir(resolve(root, 'public/assets/zimbabwe'))) {
  if (/^harare-hero-(desktop|mobile)/.test(file)) protectedPaths.push(`public/assets/zimbabwe/${file}`);
}
const fingerprints = Object.fromEntries(await Promise.all(protectedPaths.map(async path => [path, createHash('sha256').update(await readFile(resolve(root, path))).digest('hex')])));
const baseline = baselineMode ? null : JSON.parse(await readFile(resolve(output, 'baseline.json'), 'utf8'));
if (baseline) assert.deepEqual(fingerprints, baseline.fingerprints, 'Protected copy, flow, global styling and Harare assets must not change');
const errors = [], results = [];
const server = await preview({ root, plugins: [{ name: 'zimbabwe-refinement-preview', configurePreviewServer(server) {
  server.middlewares.use((request, _response, next) => {
    if (request.url?.split('?')[0] === '/zimbabwe') request.url = '/zimbabwe/index.html';
    next();
  });
} }], preview: { host: '127.0.0.1', port: 4197, strictPort: true } });
const browser = await chromium.launch({ headless: true });
try {
  for (const [width, height] of [[320,568], [390,844], [430,932], [768,1024], [1024,768], [1440,900], [1920,1080]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    page.on('console', message => { if (message.type() === 'error') errors.push({ width, type: 'console', message: message.text() }); });
    page.on('pageerror', error => errors.push({ width, type: 'page', message: error.message }));
    page.on('requestfailed', request => errors.push({ width, type: 'request', url: request.url() }));
    page.on('response', response => { if (response.status() >= 400) errors.push({ width, type: 'response', status: response.status(), url: response.url() }); });
    assert.equal((await page.goto('http://127.0.0.1:4197/zimbabwe', { waitUntil: 'networkidle' })).status(), 200);
    for (const img of await page.locator('main img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(image => image.decode()); }
    await page.evaluate(() => { document.querySelectorAll('details').forEach(details => { details.open = true; }); });
    const copy = (await page.locator('main').innerText()).replace(/\s+/g, ' ').trim();
    await page.evaluate(() => { document.querySelectorAll('details').forEach(details => { details.open = false; }); window.scrollTo(0,0); });
    const result = await page.evaluate(() => {
      const box = selector => { const rect = document.querySelector(selector).getBoundingClientRect(); return { x:rect.x, y:rect.y, width:rect.width, height:rect.height, bottom:rect.bottom }; };
      const image = document.querySelector('.lt-zimbabwe-hero img');
      const field = document.querySelector('input[name="name"]');
      const overflow = [...document.querySelectorAll('main *')].filter(element => {
        if (element.closest('.lt-honeypot') || element instanceof SVGElement) return false;
        const rect = element.getBoundingClientRect(); return rect.width && (rect.left < -2 || rect.right > innerWidth + 2);
      }).map(element => `${element.tagName}.${element.className}`);
      return { width:innerWidth, page:box('.lt-zimbabwe-page'), hero:box('.lt-zimbabwe-hero'), heading:box('#zw-title'), marker:box('.lt-zimbabwe-market .lt-zimbabwe-map'), form:box('.lt-zimbabwe-form'), lower:box('.lt-zimbabwe-closing'), field:box('input[name="name"]'),
        inputFont: getComputedStyle(field).fontSize, heroSource:new URL(image.currentSrc).pathname,
        lowerSource:new URL(document.querySelector('.lt-zimbabwe-closing picture img').currentSrc).pathname,
        markerSource:new URL(document.querySelector('.lt-zimbabwe-map').currentSrc).pathname,
        imageStyle:{fit:getComputedStyle(image).objectFit, position:getComputedStyle(image).objectPosition, filter:getComputedStyle(image).filter, opacity:getComputedStyle(image).opacity},
        links:[...document.querySelectorAll('main a')].map(a => [a.textContent, a.getAttribute('href')]),
        fields:[...document.querySelectorAll('.lt-zimbabwe-form input,.lt-zimbabwe-form select,.lt-zimbabwe-form textarea')].map(e => [e.name,e.type,e.required]),
        canonical:document.querySelector('link[rel="canonical"]').href,
        schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)),
        overflow, documentOverflow:document.documentElement.scrollWidth > innerWidth + 2,
        brokenImages:[...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src),
        sectionHeights:[...document.querySelectorAll('.lt-zimbabwe-page > section')].map(s => Math.round(s.getBoundingClientRect().height)) };
    });
    assert.deepEqual(result.overflow, []); assert.equal(result.documentOverflow, false); assert.deepEqual(result.brokenImages, []);
    assert.ok(parseFloat(result.inputFont) >= 16); assert.ok(result.field.height >= 44);
    assert.ok(result.heroSource.includes('harare-hero-')); assert.equal(result.imageStyle.filter, 'none'); assert.equal(result.imageStyle.opacity, '1');
    if (baseline) {
      const before = baseline.results.find(item => item.width === width);
      assert.equal(copy, before.copy, 'Visible copy must be unchanged');
      for (const key of ['links', 'fields', 'canonical', 'schema']) assert.deepEqual(result[key], before[key], `${key} must be unchanged`);
      result.pageRatio = result.page.height / before.page.height;
      result.formRatio = result.form.height / before.form.height;
      assert.ok(result.pageRatio < .94, `Page must be tighter at ${width}`);
      assert.ok(result.formRatio < .86, `Form must be materially tighter at ${width}`);
      assert.ok(result.marker.width > before.marker.width, `Marker must be larger at ${width}`);
      assert.ok(result.hero.height < before.hero.height, `Hero must be shorter at ${width}`);
      assert.ok(result.heading.y < before.heading.y, `Hero heading must move upward at ${width}`);
      assert.ok(result.lowerSource.includes('victoria-falls'));
      assert.ok(result.markerSource.includes('zimbabwe-market-marker'));
    }
    results.push({ ...result, copy });
    if (!baselineMode) {
      const prefix = width < 768 ? `mobile-${width}` : width < 1280 ? `tablet-${width}` : `desktop-${width}`;
      await page.screenshot({ path:resolve(output, `${prefix}-hero.png`) });
      async function capture(selector, suffix) {
        const section = page.locator(selector);
        const sectionHeight = Math.ceil(await section.evaluate(e => e.getBoundingClientRect().height));
        await page.setViewportSize({ width, height:sectionHeight });
        await section.evaluate(e => window.scrollTo(0,e.getBoundingClientRect().top + window.scrollY));
        await page.screenshot({ path:resolve(output, `${prefix}-${suffix}.png`) });
        await page.setViewportSize({ width,height });
      }
      if ([390,768,1440].includes(width)) {
        await capture('#zimbabwe-final-cta','victoria-falls');
        await capture('#zimbabwe-enquiry','form');
        await capture('#platform-proof','platforms');
      }
      if ([430,1440].includes(width)) await capture('#zimbabwe-offers','offers');
    }
    await page.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(resolve(output, baselineMode ? 'baseline.json' : 'qa-results.json'), JSON.stringify({ fingerprints, results, errors }, null, 2));
  console.log(JSON.stringify(results.map(({ width,page,hero,heading,marker,form,field,pageRatio,formRatio }) => ({ width,pageHeight:page.height,heroHeight:hero.height,headingY:heading.y,markerWidth:marker.width,formHeight:form.height,fieldHeight:field.height,pageRatio,formRatio })), null, 2));
  console.log(`${baselineMode ? 'Baseline captured' : 'Zimbabwe refinement QA PASS'}: 7 viewports; console/page/broken requests/overflow=0.`);
} finally { await browser.close(); server.httpServer.closeAllConnections(); await new Promise(done => server.httpServer.close(done)); }
