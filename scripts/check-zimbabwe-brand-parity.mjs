import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { preview } from 'vite';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'artifacts/zimbabwe-page/brand-platform-parity');
await mkdir(output, { recursive: true });
const sitemap = await readFile(resolve(root, 'public/sitemap-zimbabwe.xml'), 'utf8');
const sectorRoutes = [...sitemap.matchAll(/<loc>https:\/\/liontechinnovations.co.uk([^<]+)<\/loc>/g)].map(m => m[1]);
assert.equal(sectorRoutes.length, 26);
const browser = await chromium.launch();
let server;
const errors = [], parity = [], sectors = [];
try {
  // Optional before/after capture: run --baseline against the unmodified build first.
  const parser = await browser.newPage();
  const content = {};
  for (const route of ['/', '/zimbabwe', ...sectorRoutes]) {
    const html = await readFile(resolve(root, 'dist', route.slice(1), 'index.html'), 'utf8');
    content[route] = await parser.evaluate(({ html, route }) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const main = doc.querySelector('main');
      main.querySelectorAll('svg, .lt-zw-gate-number').forEach(e => e.remove());
      const result = {
        title: doc.title,
        meta: [...doc.querySelectorAll('meta[name], meta[property], link[rel="canonical"]')].map(e => e.outerHTML),
        schema: [...doc.querySelectorAll('script[type="application/ld+json"]')].map(e => JSON.parse(e.textContent)),
      };
      if (route === '/zimbabwe') {
        // Only the platform section may change on the pillar.
        result.sections = [...main.querySelectorAll('section:not(#platforms):not(#platform-proof)')].map(e => e.outerHTML);
        result.company = main.querySelector('.lt-zimbabwe-company-record').outerHTML;
      } else {
        result.text = main.textContent.replace(/\s+/g, ' ').trim();
        result.images = [...main.querySelectorAll('picture, img:not(picture img)')].map(e => e.outerHTML);
      }
      return result;
    }, { html, route });
  }
  await parser.close();
  const baselinePath = resolve(output, 'content-baseline.json');
  if (process.argv.includes('--baseline')) {
    await writeFile(baselinePath, JSON.stringify(content, null, 2));
    console.log('Presentation baseline saved: homepage, pillar sections, 26 sector texts/images/metadata/schema.');
  } else {
    let baseline;
    try { baseline = JSON.parse(await readFile(baselinePath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (baseline) assert.deepEqual(content, baseline, 'Content, images, metadata and schema must match the pre-patch build');
    const config = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'));
    const rewrites = new Map(config.rewrites.filter(({ source }) => !/[(:]/.test(source)).map(({ source, destination }) => [source, destination]));
    for (const route of sectorRoutes) rewrites.set(route, `${route}/index.html`);
    server = await preview({ root, plugins: [{ name: 'brand-parity-local-rewrites', configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => { const url = new URL(req.url, 'http://127.0.0.1'); if (rewrites.has(url.pathname)) req.url = rewrites.get(url.pathname) + url.search; next(); });
    } }], preview: { host: '127.0.0.1', port: 4201, strictPort: true } });
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    page.on('console', m => { if (m.type() === 'error') errors.push({ type: 'console', message: m.text(), url: page.url() }); });
    page.on('pageerror', e => errors.push({ type: 'page', message: e.message, url: page.url() }));
    page.on('requestfailed', r => errors.push({ type: 'request', url: r.url(), message: r.failure()?.errorText }));
    page.on('response', r => { if (r.status() >= 400) errors.push({ type: 'http', url: r.url(), status: r.status() }); });
    async function open(route) {
      assert.equal((await page.goto(`http://127.0.0.1:4201${route}`, { waitUntil: 'networkidle' })).status(), 200);
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok((await page.locator('main').innerText()).length > 100);
      assert.equal(await page.locator('vite-error-overlay').count(), 0);
      for (const img of await page.locator('main img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(i => i.decode()); }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false);
    }
    // Skill's immediate server check, before collecting the broader screenshots.
    await open('/zimbabwe');
    console.log('Local browser verified: page loads, content and actions render, no error overlay.');
    async function platformState() {
      return page.locator('#platforms').evaluate(section => {
        const root = section.getBoundingClientRect();
        const properties = ['color','background','font-family','font-size','font-weight','line-height','letter-spacing','text-transform','text-decoration','display','grid-template-columns','gap','align-items','justify-content','flex-direction','flex-grow','width','height','min-height','max-width','padding','margin','border','border-radius','box-shadow','object-fit','object-position','transform','filter','transition'];
        return {
          html: section.outerHTML,
          names: [...section.querySelectorAll('.platform-card h3')].map(e => e.textContent),
          elements: [section, ...section.querySelectorAll('*')].map(e => {
            const rect = e.getBoundingClientRect(), style = getComputedStyle(e);
            const round = n => Math.round(n * 64) / 64;
            return { tag: e.tagName, class: e.getAttribute('class'), box: [round(rect.x-root.x), round(rect.y-root.y), round(rect.width), round(rect.height)], style: Object.fromEntries(properties.map(p => [p, style.getPropertyValue(p)])) };
          }),
        };
      });
    }
    async function capture(selector, file) {
      const target = page.locator(selector);
      // Component-only capture: fixed global navigation is outside the comparison.
      await target.scrollIntoViewIfNeeded();
      return target.screenshot({ path: resolve(output, file), animations: 'disabled', scale: 'css', style: 'header, .lt-skip-link { visibility: hidden !important; }' });
    }
    const comparisons = [];
    for (const width of [320, 360, 390, 412, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const snapshots = [];
      const captures = [];
      for (const [label, route] of [['homepage', '/'], ['zimbabwe', '/zimbabwe']]) {
        await open(route);
        await page.mouse.move(0, 0);
        await page.locator('#platforms').scrollIntoViewIfNeeded();
        const state = await platformState();
        assert.deepEqual(state.names, ['ClearVisa UK', 'CalcFee', 'Lead Recovery', 'CareOps']);
        if (route === '/zimbabwe') assert.equal(await page.locator('.lt-route-platform-card').count(), 0);
        snapshots.push(state);
        if ([390, 1440].includes(width)) {
          await mkdir(resolve(output, label), { recursive: true });
          captures.push(await capture('#platforms', `${label}/${width === 390 ? 'mobile-390' : 'desktop-1440'}-platform-showcase.png`));
        }
        // The homepage also uses .platform-card for its Snapshot offer;
        // target the shared showcase, not that unrelated earlier card.
        const firstCard = page.locator('#platforms .platform-card').first();
        await firstCard.evaluate(e => window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - 150, behavior: 'instant' }));
        await firstCard.hover({ position: { x: 50, y: 130 } });
        await page.waitForFunction(() => document.querySelector('#platforms .platform-card').matches(':hover'));
        await page.waitForTimeout(250);
        snapshots.push(await platformState());
      }
      for (const [state, a, b] of [['rest', 0, 2], ['hover', 1, 3]]) {
        if (JSON.stringify(snapshots[a]) !== JSON.stringify(snapshots[b])) {
          await writeFile(resolve(output, `mismatch-${width}-${state}.json`), JSON.stringify({ homepage: snapshots[a], zimbabwe: snapshots[b] }, null, 2));
          assert.fail(`${width}: ${state} platform mismatch; see saved diagnostic JSON`);
        }
      }
      parity.push({ width, count: 4, structure: 'MATCH', images: 'MATCH', badges: 'MATCH', buttons: 'MATCH', spacing: 'MATCH', borders: 'MATCH', hover: 'MATCH' });
      if (captures.length) comparisons.push({ width, captures });
      console.log(`Platform parity ${width}px: four cards, DOM, geometry, typography, colours and hover MATCH.`);
    }
    const sampleSlugs = ['banking-financial-services','hotels-resorts','construction-companies','property-real-estate','mining-resources','sports-stadiums-organisations','healthcare-hospitals','agriculture-agri-processing'];
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const route of sectorRoutes) {
        await open(route);
        const state = await page.evaluate(() => {
          const style = e => getComputedStyle(e);
          const cards = [...document.querySelectorAll('.lt-zw-editorial-points > div, .lt-zw-gates dl > div, .lt-zw-feature-panel, .lt-zw-review > *, .lt-zw-related-links a')];
          const gold = [...document.querySelectorAll('.lt-kicker, .lt-zw-editorial-points dt, .lt-zw-gates h3, .lt-zw-gates dt, .lt-zw-gate-number')];
          const luminance = rgb => rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
          // Conservative check against the lightest solid navy panel in this template.
          const background = luminance([16, 34, 56]);
          const goldContrast = Math.min(...gold.map(e => (luminance(style(e).color.match(/\d+/g).slice(0, 3).map(Number)) + .05) / (background + .05)));
          return {
            cards: cards.length,
            goldContrast,
            unframed: cards.filter(e => style(e).borderTopColor !== 'rgb(200, 162, 74)' || parseFloat(style(e).borderTopWidth) < 2 || style(e).backgroundColor === 'rgba(0, 0, 0, 0)').map(e => e.className),
            nonGold: gold.filter(e => style(e).color !== 'rgb(200, 162, 74)').map(e => e.textContent),
            numbers: [...document.querySelectorAll('.lt-zw-gate-number')].map(e => e.textContent),
            gateColumns: style(document.querySelector('.lt-zw-gates dl')).gridTemplateColumns.split(' ').length,
            faqCards: [...document.querySelectorAll('#sector-faq details')].every(e => style(e).backgroundColor === 'rgb(11, 26, 43)' && style(e).borderLeftColor === 'rgb(200, 162, 74)'),
            cta: style(document.querySelector('#sector-review .lt-button-primary')).backgroundImage,
            overflow: [...document.querySelectorAll('main *')].filter(e => { if (e instanceof SVGElement) return false; const r = e.getBoundingClientRect(); return r.width > 0 && (r.left < -2 || r.right > innerWidth + 2); }).map(e => e.className),
          };
        });
        assert.ok(state.cards >= 20); assert.deepEqual(state.unframed, []); assert.deepEqual(state.nonGold, []);
        assert.ok(state.goldContrast >= 4.5, 'Gold hierarchy must meet small-text AA contrast against the lightest navy panel');
        assert.deepEqual(state.numbers, ['01','02','03','04','05']); assert.equal(state.gateColumns, width === 390 ? 1 : 5);
        assert.equal(state.faqCards, true); assert.equal(state.cta, 'none'); assert.deepEqual(state.overflow, []);
        sectors.push({ route, width, pass: true, goldContrast: Math.round(state.goldContrast * 100) / 100 });
        const slug = route.split('/').at(-1);
        if (sampleSlugs.includes(slug)) {
          const folder = `sectors/${slug}`;
          await mkdir(resolve(output, folder), { recursive: true });
          const prefix = width === 390 ? 'mobile-390' : 'desktop-1440';
          await page.locator('#sector-faq details').first().evaluate(e => { e.open = true; });
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await page.screenshot({ path: resolve(output, folder, `${prefix}-full.png`), fullPage: true, animations: 'disabled', scale: 'css' });
          for (const [name, selector] of [['editorial','#readiness-problems'],['gates','.lt-zw-gates'],['foundation','#sector-foundations'],['security','#controlled-delivery'],['faq','#sector-faq'],['pricing','#sector-review'],['related','#related-zimbabwe-industries']]) await capture(selector, `${folder}/${prefix}-${name}.png`);
        }
      }
      console.log(`Sector branding ${width}px: 26/26 shared cards, gold hierarchy, FAQ, plain CTA and overflow PASS.`);
    }
    // Side-by-side uses the original component screenshots, not a reconstructed design.
    for (const { width, captures } of comparisons) {
      await page.setViewportSize({ width: width * 2 + 64, height: 900 });
      await page.setContent(`<body style="margin:0;background:#06111f;color:#f2eee5;font:18px Arial"><main style="display:flex;gap:16px;padding:16px">${captures.map((buffer, i) => `<figure style="margin:0;width:${width}px"><figcaption style="padding:12px 0">${i ? '/zimbabwe' : '/'} — ${width}px</figcaption><img style="display:block;width:100%" src="data:image/png;base64,${buffer.toString('base64')}"></figure>`).join('')}</main></body>`);
      await page.locator('img').evaluateAll(images => Promise.all(images.map(i => i.decode())));
      await page.locator('main').screenshot({ path: resolve(output, `${width === 390 ? 'mobile-390' : 'desktop-1440'}-side-by-side.png`), scale: 'css' });
    }
    const screenshotLink = (path, label) => `<a href="${path}">${label}</a>`;
    await writeFile(resolve(output, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Zimbabwe brand and platform parity — Founder review</title><style>body{margin:0;padding:32px;background:#06111f;color:#eef1f3;font:17px/1.6 system-ui}main{max-width:1200px;margin:auto}a{color:#e0bf6d}h2{margin-top:48px}li{margin:12px 0}img{display:block;max-width:100%;height:auto;border:1px solid #c8a24a}section{margin-top:32px}nav{display:flex;gap:24px;flex-wrap:wrap}</style><main><h1>Zimbabwe brand + platform parity</h1><p>Local Founder review only. Not deployed, merged, pushed or submitted for indexing. Component captures omit the fixed global header so the showcase can be compared directly.</p><h2>Exact homepage / Zimbabwe component comparison</h2>${[1440,390].map(width => { const prefix = width === 1440 ? 'desktop-1440' : 'mobile-390'; return `<section><h3>${width}px</h3><nav>${screenshotLink(`homepage/${prefix}-platform-showcase.png`, 'Homepage')}${screenshotLink(`zimbabwe/${prefix}-platform-showcase.png`, 'Zimbabwe')}</nav><a href="${prefix}-side-by-side.png"><img src="${prefix}-side-by-side.png" alt="Homepage and Zimbabwe shared platform showcase side by side at ${width}px"></a></section>`; }).join('')}<h2>Eight sector samples</h2>${sampleSlugs.map(slug => `<section><h3>${slug.replaceAll('-', ' ')}</h3><nav>${['desktop-1440','mobile-390'].map(prefix => screenshotLink(`sectors/${slug}/${prefix}-full.png`, `${prefix} full page`)).join('')}</nav><ul>${['editorial','gates','foundation','security','faq','pricing','related'].map(name => `<li>${name}: ${['desktop-1440','mobile-390'].map(prefix => screenshotLink(`sectors/${slug}/${prefix}-${name}.png`, prefix)).join(' · ')}</li>`).join('')}</ul></section>`).join('')}<h2>QA evidence</h2><p>${screenshotLink('qa.json','Parity, branding, contrast and browser results')}</p><p>Await Founder approval.</p></main></html>`);
    await writeFile(resolve(output, 'qa.json'), JSON.stringify({ baselineCompared: Boolean(baseline), parity, sectors, errors }, null, 2));
    assert.deepEqual(errors, []);
    console.log('Brand/platform parity PASS. Zero console/page/request errors. Founder screenshots captured.');
  }
} finally {
  await browser.close();
  if (server) { server.httpServer.closeAllConnections(); await new Promise(done => server.httpServer.close(done)); }
}
