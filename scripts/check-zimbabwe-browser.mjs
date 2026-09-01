import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { preview } from 'vite';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'artifacts/zimbabwe-page');
await mkdir(output, { recursive: true });
const config = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'));
const rewrites = new Map(config.rewrites.filter(({ source }) => !/[(:]/.test(source)).map(({ source, destination }) => [source, destination]));
const server = await preview({ plugins: [{ name: 'zimbabwe-vercel-rewrite-preview', configurePreviewServer(server) {
  server.middlewares.use((request, _response, next) => {
    const url = new URL(request.url || '/', 'http://127.0.0.1');
    if (rewrites.has(url.pathname)) request.url = rewrites.get(url.pathname) + url.search;
    next();
  });
} }], preview: { host: '127.0.0.1', port: 4195, strictPort: true } });
const browser = await chromium.launch({ headless: true });
const results = [];
const consoleErrors = [], pageErrors = [], brokenRequests = [];
const base = 'http://127.0.0.1:4195';
try {
  for (const [width, height] of [[320,568], [360,800], [390,844], [412,915], [430,932], [1280,720], [1440,900], [1920,1080]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push({ width, message: message.text() }); });
    page.on('pageerror', (error) => pageErrors.push({ width, message: error.message }));
    page.on('requestfailed', (request) => brokenRequests.push({ width, url: request.url(), failure: request.failure() }));
    page.on('response', (response) => { if (response.status() >= 400) brokenRequests.push({ width, url: response.url(), status: response.status() }); });
    await page.addInitScript(() => { window.__unhandledRejections = []; window.addEventListener('unhandledrejection', (event) => window.__unhandledRejections.push(String(event.reason))); });
    const response = await page.goto(`${base}/zimbabwe`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    assert.match(await response.text(), /Built in the UK/);
    assert.equal(await page.locator('h1').count(), 1);
    assert.ok(!await page.locator('vite-error-overlay').count());
    for (const img of await page.locator('main img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate((image) => image.decode()); }
    await page.evaluate(() => window.scrollTo(0, 0));
    const measurement = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      const overflow = [...document.querySelectorAll('main *')].filter((element) => {
        if (element.closest('.lt-honeypot') || element instanceof SVGElement) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && (rect.right > width + 2 || rect.left < -2);
      }).map((element) => `${element.tagName}.${element.className}`);
      return {
        documentOverflow: document.documentElement.scrollWidth > width + 2, overflow,
        brokenImages: [...document.images].filter((image) => image.complete && !image.naturalWidth).map((image) => image.src),
        fontSize: getComputedStyle(document.querySelector('input[name="name"]')).fontSize,
        nav: [...document.querySelectorAll('.lt-desktop-nav a')].filter((element) => element.getBoundingClientRect().width > 0).map((element) => ({ y: element.getBoundingClientRect().y, text: element.textContent })),
        unhandledRejections: window.__unhandledRejections,
      };
    });
    assert.equal(measurement.documentOverflow, false, `Document overflow at ${width}`);
    assert.deepEqual(measurement.overflow, [], `Element overflow at ${width}`);
    assert.deepEqual(measurement.brokenImages, []);
    assert.deepEqual(measurement.unhandledRejections, []);
    assert.ok(parseFloat(measurement.fontSize) >= 16);
    if (width >= 1280) { assert.equal(measurement.nav.length, 8); assert.equal(new Set(measurement.nav.map((item) => item.y)).size, 1); }
    assert.equal(await page.locator('.lt-desktop-nav a[aria-current="page"]').textContent(), 'Zimbabwe');

    // Keyboard-accessible native accordion.
    const summary = page.locator('#zimbabwe-faq summary').first();
    await summary.focus(); await page.keyboard.press('Enter');
    assert.ok(await summary.evaluate((element) => getComputedStyle(element).outlineStyle !== 'none'));
    assert.equal(await page.locator('#zimbabwe-faq details').first().getAttribute('open'), '');
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#zimbabwe-faq details').first().getAttribute('open'), null);

    if (width === 390 || width === 1440) {
      const prefix = width === 390 ? 'mobile-390' : 'desktop-1440';
      await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); window.scrollTo(0, 0); });
      assert.ok(await page.locator('.lt-skip-link').evaluate((element) => element.getBoundingClientRect().bottom <= 0), 'Unfocused skip link must stay off-screen');
      await page.screenshot({ path: resolve(output, `${prefix}-hero.png`) });
      async function captureSection(selector, filename) {
        const section = page.locator(selector);
        const sectionHeight = Math.ceil(await section.evaluate((element) => element.getBoundingClientRect().height));
        // Capture a real viewport rather than an off-viewport element clip, which
        // can incorrectly include fixed off-screen controls in tall screenshots.
        await page.setViewportSize({ width, height: sectionHeight });
        await section.evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY));
        await page.screenshot({ path: resolve(output, filename) });
        await page.setViewportSize({ width, height });
      }
      for (const [suffix, selector] of [['business', '#business-today'], ['offers', '#zimbabwe-offers'], ['foundation', '#digital-foundation'], ['security', '#delivery'], ['faq', '#zimbabwe-faq'], ['final-cta', '#zimbabwe-final-cta'], ['footer', '.lt-unified-footer']]) {
        if (suffix === 'faq') await page.locator('#zimbabwe-faq details').first().evaluate((details) => { details.open = true; });
        await captureSection(selector, `${prefix}-${suffix}.png`);
      }
      if (width === 390) await captureSection('#zimbabwe-enquiry', 'mobile-390-form.png');
      if (width === 1440) {
        await page.locator('#zimbabwe-faq details').evaluateAll((details) => details.forEach((item) => { item.open = true; }));
        await writeFile(resolve(output, 'visible-copy.txt'), await page.locator('body').innerText(), 'utf8');
      }
      await page.locator('#zimbabwe-faq details').evaluateAll((details) => details.forEach((item) => { item.open = false; }));
    }
    // All conversion actions remain on the Zimbabwe page.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('.lt-zimbabwe-hero .lt-button-primary').click();
    await page.waitForFunction(() => { const y = document.getElementById('zimbabwe-enquiry').getBoundingClientRect().y; return y >= 0 && y < 110; });
    assert.ok(page.url().endsWith('/zimbabwe#zimbabwe-enquiry'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.getElementById('zimbabwe-enquiry').getBoundingClientRect().y < 110);

    if (width === 390) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await page.locator('#mobile-navigation').getByRole('link', { name: 'Zimbabwe', exact: true }).click();
      assert.equal(await page.locator('#mobile-navigation').count(), 0);
    }
    assert.deepEqual(await page.evaluate(() => window.__unhandledRejections), []);
    results.push({ width, height, status: 'PASS', ...measurement });
    await page.close();
  }

  // Browser form states are isolated from email delivery; API behaviour has its own test.
  const formPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  formPage.on('console', (message) => { if (message.type() === 'error') consoleErrors.push({ form: true, message: message.text() }); });
  formPage.on('pageerror', (error) => pageErrors.push({ form: true, message: error.message }));
  await formPage.addInitScript(() => { window.__unhandledRejections = []; window.addEventListener('unhandledrejection', (event) => window.__unhandledRejections.push(String(event.reason))); });
  let submissions = [];
  let success = true;
  await formPage.route('**/api/zimbabwe-enquiry', async (route) => {
    submissions.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: success }) });
  });
  await formPage.goto(`${base}/zimbabwe#zimbabwe-enquiry`, { waitUntil: 'networkidle' });
  async function fillForm() {
    for (const [name, value] of Object.entries({ name: 'Test Reviewer', email: 'reviewer@example.com', company: 'Example Organisation', websiteUrl: 'example.co.zw', jobTitle: 'Director', primaryLocation: 'Harare', context: 'Local browser validation only.' })) await formPage.locator(`[name="${name}"]`).fill(value);
    await formPage.selectOption('[name="department"]', 'Operations');
    await formPage.selectOption('[name="companySize"]', '101-250');
    await formPage.selectOption('[name="interest"]', { index: 1 });
    await formPage.check('[name="consent"]');
  }
  await fillForm();
  await formPage.fill('[name="websiteUrl"]', 'javascript:alert(1)');
  await formPage.locator('form button[type="submit"]').click();
  assert.equal(await formPage.getByRole('alert').count(), 1); assert.equal(submissions.length, 0);
  await formPage.fill('[name="websiteUrl"]', 'example.co.zw');
  await formPage.locator('form button[type="submit"]').click();
  await formPage.getByRole('heading', { name: 'Request received.' }).waitFor();
  assert.match(submissions[0].websiteUrl, /^https:\/\/example\.co\.zw\/?$/);
  assert.ok(submissions[0].consent);
  assert.ok(!('apiKey' in submissions[0]));
  await formPage.getByRole('button', { name: 'Send another request' }).click();
  await fillForm(); success = false;
  await formPage.locator('form button[type="submit"]').click();
  await formPage.getByRole('alert').waitFor();
  assert.match(await formPage.getByRole('alert').innerText(), /admin@liontechinnovations.co.uk/);
  assert.equal(await formPage.locator('[name="company"]').inputValue(), 'Example Organisation');

  // SPA navigation restores the global UK metadata and form on return.
  await formPage.locator('.lt-logo-link').click();
  await formPage.waitForFunction(() => document.querySelector('meta[property="og:image"]').content.endsWith('/assets/ogliontech.png'));
  assert.equal(await formPage.locator('.lt-header-action a').textContent(), 'Get AI Snapshot');
  assert.ok((await formPage.locator('.lt-unified-footer').innerText()).includes('contact@liontechinnovations.co.uk'));
  await formPage.locator('.lt-desktop-nav').getByRole('link', { name: 'Zimbabwe', exact: true }).click();
  await formPage.waitForFunction(() => document.querySelector('meta[property="og:image"]').content.endsWith('/assets/zimbabwe/zimbabwe-og.png'));
  assert.ok(!(await formPage.locator('body').innerText()).includes('£395'));
  assert.ok(!(await formPage.locator('body').innerText()).includes('contact@liontechinnovations.co.uk'));
  assert.deepEqual(await formPage.evaluate(() => window.__unhandledRejections), []);
  await formPage.close();
  assert.deepEqual(consoleErrors, []); assert.deepEqual(pageErrors, []); assert.deepEqual(brokenRequests, []);
  await writeFile(resolve(output, 'qa-results.json'), JSON.stringify({ results, consoleErrors, pageErrors, brokenRequests, form: 'Validation/success/error passed with mocked delivery; no real email sent.' }, null, 2));
  console.log(`Zimbabwe browser QA: PASS (${results.length} viewports). Console=0, page=0, unhandled=0, broken requests=0, overflow=0. Form/FAQ/hash/navigation checks passed.`);
} finally { await browser.close(); await server.httpServer.close(); }
