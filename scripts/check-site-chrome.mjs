import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createServer, preview } from 'vite';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'qa-artifacts/site-chrome', process.env.CHROME_RUN || 'local');
const remote = process.env.CHROME_BASE_URL;
const sizes = [[1440,900],[1280,800],[1024,768],[768,1024],[390,844],[375,812]];
const report = { status: 'RUNNING', routes: [], errors: [], externalWarnings: [] };
await mkdir(out, { recursive: true });
let ssr, server, browser;
try {
  ssr = await createServer({ root, logLevel: 'error', server: { middlewareMode: true, hmr: false, watch: { ignored: ['**/qa-artifacts/**','**/dist/**'] } } });
  const { routeInventory } = await ssr.ssrLoadModule('/src/routes/AppRoutes.tsx');
  const { getActiveNavigationHref } = await ssr.ssrLoadModule('/src/content/navigation.ts');
  const { zimbabwe } = await ssr.ssrLoadModule('/src/content/zimbabwe.ts');
  const paths = [...new Set([...routeInventory.marketing, ...routeInventory.legacy, ...routeInventory.static, ...routeInventory.programmatic])];
  const representatives = new Set([...routeInventory.marketing, ...routeInventory.legacy, ...routeInventory.static, '/industries', ...routeInventory.programmatic.filter(path => path.startsWith('/industries/aesthetics-clinics')), '/zimbabwe/banking-financial-services', '/tenders', '/tenders/cleaning-tender-support']);
  report.inventory = routeInventory;
  if (!remote) {
    const config = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
    const exact = new Map(config.rewrites.filter(rule => !/[(:]/.test(rule.source)).map(rule => [rule.source, rule.destination]));
    for (const path of routeInventory.programmatic) if (path.startsWith('/industries/') || path.startsWith('/zimbabwe/')) exact.set(path, `${path}/index.html`);
    server = await preview({ root, plugins: [{ name: 'public-route-rewrites', configurePreviewServer(vite) {
      vite.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://127.0.0.1');
        if (exact.has(url.pathname)) req.url = exact.get(url.pathname) + url.search;
        next();
      });
    } }], preview: { host: '127.0.0.1', port: 0 } });
  }
  const base = remote || `http://127.0.0.1:${server.httpServer.address().port}`;
  report.base = base;
  browser = await chromium.launch();
  for (const path of paths) {
    for (const [width,height] of (representatives.has(path) ? sizes : [sizes[0], sizes[5]])) {
      // Every route/viewport starts without cached CSS or a previous navigation.
      const context = await browser.newContext({ viewport: { width,height }, reducedMotion: 'reduce' });
      if (process.env.VERCEL_OIDC_TOKEN) await context.route(`${new URL(base).origin}/**`, route => route.continue({ headers: { ...route.request().headers(), 'x-vercel-trusted-oidc-idp-token': process.env.VERCEL_OIDC_TOKEN } }));
      await context.route(`${new URL(base).origin}/api/**`, route => route.abort());
      const page = await context.newPage();
      page.on('pageerror', error => report.errors.push({ path,width,text:error.message }));
      page.on('console', message => {
        if (message.type() !== 'error') return;
        const item = { path,width,text:message.text(),url:message.location().url };
        // Existing Oxford/Accredible embed diagnostics, retained separately in the report.
        if (path === '/about' && (/^https:\/\/(certify\.sbs\.ox\.ac\.uk|eu\.api\.accredible\.com|web-sdk\.aptrinsic\.com|bat\.bing\.com)\//.test(item.url) || (!item.url && item.text.startsWith("Loading the script 'https://sc.lfeeder.com/") && item.text.includes('Content Security Policy')))) report.externalWarnings.push(item);
        else report.errors.push(item);
      });
      try {
        const response = await page.goto(`${base}${path}`, { waitUntil: 'load' });
        assert.equal(response.status(), 200, path);
        await page.evaluate(() => document.fonts.ready);
        const footer = page.locator('.lt-compact-footer');
        await footer.waitFor({ state: 'attached' });
        await page.waitForFunction(() => [...document.querySelectorAll('.lt-compact-footer details')].every(el => el.open === (innerWidth >= 768)));
        assert.equal(await footer.count(), 1, 'One shared footer');
        assert.equal(await page.locator('footer').count(), 1, 'No old duplicate footer');
        const footerHeight = await footer.evaluate(el => el.getBoundingClientRect().height);
        if (width >= 1280) assert(footerHeight <= 225, `${path}: footer ${footerHeight}px at ${width}`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${path}: horizontal overflow at ${width}`);
        const footerStyle = await footer.evaluate(el => ({ overflow: getComputedStyle(el).overflow, transform: getComputedStyle(el).transform }));
        assert(!/hidden|clip/.test(footerStyle.overflow)); assert.equal(footerStyle.transform, 'none');
        const isZimbabwe = path.startsWith('/zimbabwe');
        const solutions = footer.getByRole('navigation', { name: 'Footer solutions' });
        assert.equal(await solutions.locator('a').first().textContent(), isZimbabwe ? 'Corporate Readiness Review' : 'Tender Support');
        assert.equal(await footer.locator('a[href="/privacy-policy"]').count(), 1);
        assert.equal(await footer.locator('a[href="/terms-and-conditions"]').count(), 1);
        if (isZimbabwe) assert.equal(await footer.locator(`a[href="mailto:${zimbabwe.email}"]`).count(), 1);
        for (const details of await footer.locator('details').all()) {
          if (width < 768) { await details.locator('summary').focus(); await page.keyboard.press('Enter'); }
          assert(await details.evaluate(el => el.open));
          for (const link of await details.locator('a').all()) assert(await link.isVisible(), 'Footer destination remains usable');
          if (width < 768) { await details.locator('summary').focus(); await page.keyboard.press('Enter'); }
        }
        const header = page.locator('.lt-site-header');
        if (!routeInventory.static.includes(path)) {
          assert.equal(await header.count(), 1, 'Legacy and marketing routes share the header');
          const nav = header.locator('.lt-desktop-nav');
          assert.equal(await nav.locator('a').first().textContent(), 'Tender Support');
          assert.equal(await nav.locator('a').first().getAttribute('href'), '/tenders');
          assert.equal(await nav.getByRole('link', { name: isZimbabwe ? 'Contact' : 'Build / Fix', exact: true, includeHidden: true }).getAttribute('href'), isZimbabwe ? zimbabwe.enquiryHref : '/contact');
          const active = getActiveNavigationHref(path, '');
          if (active) assert.equal(await nav.locator('a[aria-current="page"]').getAttribute('href'), isZimbabwe && active === '/contact' ? zimbabwe.enquiryHref : active);
          const action = header.locator('.lt-header-action a');
          assert.equal(await action.getAttribute('href'), isZimbabwe ? zimbabwe.enquiryHref : '/tenders#enquiry');
          if (width >= 1280) {
            assert(await nav.isVisible());
            const boxes = await header.locator('.lt-logo-link,.lt-desktop-nav a,.lt-header-action').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().toJSON()));
            for (let index=1; index<boxes.length; index++) assert(boxes[index].x >= boxes[index-1].right - 1, `${path}: overlapping header items`);
            assert(boxes.at(-1).right <= width, 'Header within viewport');
          } else {
            assert(!(await nav.isVisible()));
            const toggle = header.getByRole('button', { name: 'Open navigation' });
            await toggle.focus(); await page.keyboard.press('Enter');
            const mobile = header.locator('#mobile-navigation');
            assert.equal(await mobile.locator('a').first().getAttribute('href'), '/tenders');
            assert.equal(await mobile.locator('.lt-button').getAttribute('href'), isZimbabwe ? zimbabwe.enquiryHref : '/tenders#enquiry');
            await page.keyboard.press('Escape');
            assert.equal(await mobile.count(), 0);
            assert(await toggle.evaluate(el => el === document.activeElement));
            assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
          }
        }
        const slug = path === '/' ? 'home' : path.slice(1).replaceAll('/','--');
        await page.evaluate(() => document.activeElement?.blur());
        await footer.screenshot({ path: join(out, `${slug}-${width}-footer.png`) });
        await page.evaluate(() => scrollTo(0,0));
        if (await header.count()) await header.screenshot({ path: join(out, `${slug}-${width}-header.png`) });
        if (representatives.has(path)) await page.screenshot({ path: join(out, `${slug}-${width}.png`), fullPage: true });
        if (representatives.has(path) && !routeInventory.static.includes(path) && !isZimbabwe) {
          await page.evaluate(() => { window.__siteChromeNavigation = true; });
          if (width < 1280) await header.getByRole('button', { name: 'Open navigation' }).click();
          const cta = width < 1280 ? header.locator('#mobile-navigation .lt-button') : header.locator('.lt-header-action a');
          await cta.focus(); await page.keyboard.press('Enter');
          await page.getByRole('form', { name: 'Tender enquiry' }).waitFor();
          assert.equal(new URL(page.url()).pathname, '/tenders'); assert.equal(new URL(page.url()).hash, '#enquiry');
          await page.waitForFunction(() => { const y = document.getElementById('enquiry').getBoundingClientRect().top; return y >= 0 && y < innerHeight; });
          assert.equal(await page.evaluate(() => window.__siteChromeNavigation), true, 'Header CTA uses History API');
        }
        report.routes.push({ path,width,height,footerHeight,status:'PASS',footerScreenshot:`${slug}-${width}-footer.png` });
        console.log(`PASS ${width} ${path}; footer=${footerHeight.toFixed(2)}px`);
      } finally { await context.close(); }
    }
  }
  for (const path of routeInventory.internal) {
    const page = await browser.newPage(); await page.goto(`${base}${path}`);
    assert.equal(await page.locator('footer').count(), 0, 'Internal screen intentionally has no marketing footer'); await page.close();
  }
  assert.deepEqual(report.errors, []);
  report.status = 'PASS'; report.publicRoutes = paths.length;
} catch (error) { report.status = 'FAIL'; report.failure = error.stack; process.exitCode = 1; }
finally {
  await writeFile(join(out,'report.json'), JSON.stringify(report,null,2));
  await writeFile(join(out,'coverage.md'), ['# Shared header/footer direct-entry coverage','',`Status: ${report.status}`,'','| Route | Viewport | Footer px | Status |','|---|---|---:|---|',...report.routes.map(r=>`| ${r.path} | ${r.width}x${r.height} | ${r.footerHeight.toFixed(2)} | ${r.status} |`),report.failure || ''].join('\n'));
  await browser?.close(); if (server) await new Promise(done=>server.httpServer.close(done)); await ssr?.close();
  console.log(JSON.stringify({ status:report.status,routes:report.publicRoutes,views:report.routes.length,failure:report.failure,errors:report.errors,externalWarnings:report.externalWarnings },null,2));
}
