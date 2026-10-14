import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createServer, resolveConfig } from 'vite';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..');
const remote = process.env.TENDERS_BASE_URL;
const out = join(root, 'qa-artifacts/resource-parity', process.env.TENDERS_RUN || 'catalogue');
const widths = process.env.TENDERS_ALL_WIDTHS === 'true' ? [1440,1280,1024,768,390,375] : [1440,375];
const report = { status: 'RUNNING', mode: remote ? 'published routes' : 'isolated full catalogue', routes: [], errors: [] };
await mkdir(out, { recursive: true });
let server, browser;
try {
  // The private review must never become a deployable artefact, even by accident.
  await assert.rejects(resolveConfig({ root, mode: 'tender-catalogue-review' }, 'build'), /local-only/);
  const previousEnvironment = process.env.VERCEL_ENV;
  try {
    process.env.VERCEL_ENV = 'production';
    await assert.rejects(resolveConfig({ root, mode: 'tender-catalogue-review' }, 'serve'), /local-only/);
  } finally {
    if (previousEnvironment === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousEnvironment;
  }
  server = await createServer({
    root, mode: remote ? undefined : 'tender-catalogue-review', logLevel: 'error',
    server: { host: '127.0.0.1', port: 0, hmr: false, watch: { ignored: ['**/qa-artifacts/**', '**/dist/**'] }, ...(remote ? { middlewareMode: true } : {}) },
    plugins: remote ? [] : [{ name: 'private-catalogue-worksheets', configureServer(vite) {
      vite.middlewares.use(async (req, res, next) => {
        const match = new URL(req.url, 'http://127.0.0.1').pathname.match(/^\/downloads\/tenders\/([a-z0-9-]+)\.(csv|md)$/);
        if (!match) return next();
        const { tenderPages } = await vite.ssrLoadModule('/src/content/tenders/index.ts');
        const record = tenderPages.find(page => page.slug === match[1]);
        if (!record) return next();
        const { tenderCsv, tenderWorksheet } = await vite.ssrLoadModule('/src/content/tenders/downloads.ts');
        res.setHeader('Content-Type', match[2] === 'csv' ? 'text/csv; charset=utf-8' : 'text/markdown; charset=utf-8');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.setHeader('Cache-Control', 'no-store');
        res.end(match[2] === 'csv' ? tenderCsv(record) : tenderWorksheet(record));
      });
    } }],
  });
  const { tenderPages, publishedTenderPages, tenderVisiblePages } = await server.ssrLoadModule('/src/content/tenders/index.ts');
  const { tenderCsv, tenderWorksheet } = await server.ssrLoadModule('/src/content/tenders/downloads.ts');
  const records = remote ? publishedTenderPages : tenderVisiblePages;
  assert.equal(records.length, remote ? 5 : 25);
  assert.equal(tenderPages.filter(page => page.publishStatus === 'draft').length, 20, 'Review mode must not publish drafts');
  if (!remote) await server.listen();
  const base = remote || `http://127.0.0.1:${server.httpServer.address().port}`;
  report.base = base;
  const headers = process.env.VERCEL_OIDC_TOKEN ? { 'x-vercel-trusted-oidc-idp-token': process.env.VERCEL_OIDC_TOKEN } : {};
  browser = await chromium.launch();
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: ({1440:900,1280:800,1024:768,768:1024,390:844,375:812})[width] }, reducedMotion: 'reduce' });
    if (Object.keys(headers).length) await context.route(`${new URL(base).origin}/**`, route => route.continue({ headers: { ...route.request().headers(), ...headers } }));
    // Do not send real enquiries in a visual test.
    await context.route('**/api/tender-enquiry', route => route.abort());
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
    for (const record of [null, ...records]) {
      const path = record?.path || '/tenders';
      const slug = record?.slug || 'hub';
      const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, path);
      if (!remote) assert.equal(response.headers()['x-robots-tag'], 'noindex, nofollow');
      const surface = page.locator(record ? `[data-tender-page="${slug}"]` : '.lt-tender-hub');
      await surface.waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1, path);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${path} at ${width}: overflow`);
      const text = await surface.innerText();
      await page.screenshot({ path: join(out, `${slug}-${width}.png`), fullPage: true });
      assert(!/Publication review:|Editorial review pending|not a photograph of LionTech|embedded promotional wording|this is not editorial approval/.test(text));
      const footer = page.locator('.lt-compact-footer');
      assert.equal(await footer.count(), 1, `${path}: compact footer required`);
      const footerHeight = await footer.evaluate(el => el.getBoundingClientRect().height);
      assert(footerHeight <= (width >= 1280 ? 225 : 470), `${path}: footer ${footerHeight}px at ${width}`);
      if (width < 768) for (const details of await footer.locator('details').all()) {
        assert.equal(await details.evaluate(el => el.open), false);
        await details.locator('summary').focus(); await page.keyboard.press('Enter');
        assert(await details.evaluate(el => el.open));
        for (const link of await details.locator('a').all()) assert(await link.isVisible());
        await details.locator('summary').focus(); await page.keyboard.press('Enter');
      }
      if (record) {
        assert.equal(await page.locator('h1').innerText(), record.h1);
        for (const copy of [record.answer, ...record.steps, ...record.sections.flatMap(section => [...section.paragraphs, ...(section.points || [])]), record.example, ...record.mistakes, ...record.fieldHelp]) assert(text.includes(copy), `${path}: missing authored guidance`);
        assert(text.includes('not personalised legal advice'));
        assert.equal(await page.locator('.lt-tender-utility tbody tr').count(), record.utility.fields.length);
        assert.equal(await page.locator('.lt-tender-step-grid > li').count(), record.steps.length);
        assert.equal(await page.locator('.lt-tender-related-grid a').count(), record.related.filter(path => records.some(item => item.path === path)).length);
        const visuals = await surface.evaluate(el => {
          const css = selector => getComputedStyle(el.querySelector(selector));
          return { background: getComputedStyle(el).backgroundColor, heading: css('h1').color, body: css('.lt-tender-answer').color, font: css('.lt-tender-answer').fontFamily, bodySize: css('.lt-tender-answer').fontSize, cardBorder: css('.lt-standard-card').borderTopWidth, cardGold: css('.lt-standard-card').borderTopColor, table: css('thead').backgroundColor, sectionCount: el.querySelectorAll('.lt-tender-resource-section.section-dark-connected, .lt-tender-resource-section.section-light-connected').length };
        });
        assert.equal(visuals.background, 'rgb(6, 17, 31)');
        assert.equal(visuals.heading, 'rgb(238, 241, 243)', 'Headings use the homepage connected-section text colour');
        assert.equal(visuals.body, 'rgb(184, 194, 203)');
        assert.equal(visuals.bodySize, '18px');
        assert.equal(visuals.cardBorder, '3px'); assert.equal(visuals.cardGold, 'rgb(200, 162, 74)');
        assert.equal(visuals.table, 'rgb(16, 34, 56)');
        assert.equal(visuals.sectionCount, record.sections.length + 8);
        const clipped = await surface.locator('h1,h2,p,th,td,.lt-standard-card').evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.textContent.slice(0,80)));
        assert.deepEqual(clipped, [], `${path}: clipped text`);
        for (const [index, detail] of (await page.locator('.lt-tender-faq details').all()).entries()) {
          await detail.locator('summary').focus(); await page.keyboard.press('Enter');
          assert(await detail.evaluate(el => el.open));
          assert.equal(await detail.locator('p').innerText(), record.faqs[index].answer);
          await page.keyboard.press('Enter');
        }
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://liontechinnovations.co.uk${path}`);
        assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), remote && process.env.TENDERS_EXPECT_PUBLISHED === 'true' ? 'index,follow' : 'noindex,follow');
        assert.equal(await surface.getByRole('link', { name: 'Request Tender Support', exact: true }).getAttribute('href'), `/tenders?source=${slug}#enquiry`);
        if (width === widths[0]) for (const ext of ['csv','md']) {
          const download = await context.request.get(`${base}/downloads/tenders/${slug}.${ext}`, { headers });
          assert.equal(download.status(), 200);
          assert.equal(await download.text(), ext === 'csv' ? tenderCsv(record) : tenderWorksheet(record));
        }
      }
      await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
      await page.screenshot({ path: join(out, `${slug}-${width}.png`), fullPage: true });
      await footer.screenshot({ path: join(out, `${slug}-footer-${width}.png`) });
      if (!record) await page.locator('.lt-tender-hero').screenshot({ path: join(out, `hub-hero-${width}.png`) });
      report.routes.push({ path, width, status: 'PASS', publication: record?.publishStatus || 'published', footerHeight, screenshot: `${slug}-${width}.png`, footerScreenshot: `${slug}-footer-${width}.png` });
      if (record && width === 375) {
        await page.evaluate(() => { window.__tenderResourceProbe = true; });
        await surface.getByRole('link', { name: 'Request Tender Support', exact: true }).focus();
        await page.keyboard.press('Enter');
        await page.getByRole('form', { name: 'Tender enquiry' }).waitFor();
        assert.equal(new URL(page.url()).pathname, '/tenders');
        assert.equal(new URL(page.url()).hash, '#enquiry');
        assert.equal(new URL(page.url()).searchParams.get('source'), slug);
        assert.equal(await page.evaluate(() => window.__tenderResourceProbe), true, 'CTA uses History API without reload');
        assert.equal(await page.locator('input[type="file"]').count(), 0);
        report.routes.at(-1).enquiryNavigation = 'Keyboard activation; source retained; no reload; no submission';
      }
      console.log(`PASS ${width} ${path}; footer ${footerHeight.toFixed(2)}px`);
    }
    await context.close();
  }
  assert.deepEqual(report.errors, []);
  report.status = 'PASS';
  report.resources = records.length;
  report.draftsUnchanged = 20;
  const lines = ['# Tender resource visual coverage', '', `Result: ${report.status}. ${records.length} resources plus hub. ${report.mode}.`, '', '| Route | Width | Footer px | Result | Full-page screenshot |', '|---|---:|---:|---|---|', ...report.routes.map(item => `| ${item.path} | ${item.width} | ${item.footerHeight.toFixed(2)} | ${item.status} | [Screenshot](${item.screenshot}) |`)];
  await writeFile(join(out, 'coverage.md'), lines.join('\n') + '\n');
} catch (error) {
  report.status = 'FAIL'; report.failure = error.stack; throw error;
} finally {
  await writeFile(join(out, 'report.json'), JSON.stringify(report, null, 2));
  await browser?.close(); await server?.close();
}
