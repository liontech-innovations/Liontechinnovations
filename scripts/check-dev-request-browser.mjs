import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { preview } from 'vite';
import { chromium } from 'playwright';

const external = process.env.DEV_REQUEST_BASE_URL?.replace(/\/$/, '');
let server;
let browser;
const errors = [];
try {
  if (!external) {
    const config = JSON.parse(await readFile('vercel.json', 'utf8'));
    const rewrites = new Map(config.rewrites.filter(({ source }) => !source.includes('(') && !source.includes(':')).map(({ source, destination }) => [source, destination]));
    server = await preview({ configFile: false, plugins: [{ name: 'test-vercel-rewrites', configurePreviewServer(instance) {
      instance.middlewares.use((req, _res, next) => { const path = new URL(req.url, 'http://localhost').pathname; if (rewrites.has(path)) req.url = rewrites.get(path); next(); });
    } }], preview: { host: '127.0.0.1', port: 4198, strictPort: true } });
  }
  const base = external || 'http://127.0.0.1:4198';
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await mkdir('qa-artifacts/dev-request', { recursive: true });
  for (const width of [375, 390, 430, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/contact`);
    await page.getByRole('heading', { name: 'Need Something Built or Fixed?' }).waitFor();
    assert.equal(await page.title(), 'Dev & Automation Services | LionTech Innovations');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://liontechinnovations.co.uk/contact');
    const geometry = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, fields: Array.from(document.querySelectorAll('.lt-dev-form input:not([name="website"]), .lt-dev-form select, .lt-dev-form textarea')).map((el) => { const rect = el.getBoundingClientRect(); return { left: rect.left, right: rect.right, width: rect.width, size: parseFloat(getComputedStyle(el).fontSize) }; }) }));
    assert.equal(geometry.overflow, false, `Page overflow at ${width}`);
    for (const field of geometry.fields) assert.ok(field.left >= 0 && field.right <= width && field.width > 100 && field.size >= 16, `Clipped/small field at ${width}: ${JSON.stringify(field)}`);
    await page.screenshot({ path: `qa-artifacts/dev-request/contact-${width}.png`, fullPage: true });
  }
  let requests = [];
  let failFirst = true;
  await page.route('**/api/dev-request', async (route) => {
    requests.push(route.request().postDataJSON());
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (failFirst) { failFirst = false; await route.abort('failed'); }
    else await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  const form = page.getByRole('form', { name: 'Development request' });
  const submit = form.getByRole('button', { name: 'REQUEST A DEV FIX' });
  await submit.click();
  assert.equal(requests.length, 0);
  await form.getByLabel('Name', { exact: true }).fill('QA Reviewer');
  await form.getByLabel('Email', { exact: true }).fill('invalid-email');
  await form.getByLabel('Business / organisation name').fill('Example Organisation');
  await form.getByLabel('What do you need?').selectOption('Fix my existing app');
  await form.getByLabel('Describe what you need built or fixed').fill('A form needs fixing.');
  await form.getByLabel('Budget range').selectOption('£300–£750');
  await form.getByLabel('Desired timescale').selectOption('Within 1 week');
  await submit.click();
  assert.equal(requests.length, 0, 'Invalid email submitted');
  await form.getByLabel('Email', { exact: true }).fill('qa@example.com');
  await form.getByLabel('Website or existing app URL').fill('javascript:alert(1)');
  await submit.click();
  assert.equal(requests.length, 0, 'Invalid URL submitted');
  await form.getByLabel('Website or existing app URL').fill('example.com');
  await form.evaluate((el) => { el.requestSubmit(); el.requestSubmit(); });
  await form.getByRole('alert').waitFor();
  assert.equal(requests.length, 1, 'Duplicate rapid submit not blocked');
  await submit.click();
  await page.getByRole('heading', { name: 'Request received.' }).waitFor();
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[0], requests[1], 'Retry changed email idempotency payload');
  await page.unroute('**/api/dev-request');
  // The simulated network error above is intentional; all route/layout checks must be clean.
  const unexpected = errors.filter((error) => !error.includes('net::ERR_FAILED'));
  assert.deepEqual(unexpected, []);
  errors.length = 0;
  await page.goto(`${base}/contact`);
  await page.locator('.lt-dev-form').getByRole('link', { name: 'Privacy Policy' }).click();
  await page.waitForURL('**/privacy-policy');
  await page.getByRole('heading', { name: 'Privacy Policy', exact: true }).waitFor();
  await page.goto(`${base}/contact`);
  await page.locator('.lt-dev-aside').getByRole('link', { name: 'Request a Founding Snapshot' }).click();
  await page.locator('#snapshot-enquiry form').waitFor();
  await page.getByRole('heading', { name: 'Tell us which business AI should understand.' }).waitFor();
  await page.goBack();
  await page.getByRole('form', { name: 'Development request' }).waitFor();
  await page.goto(`${base}/contact#snapshot-enquiry`);
  await page.locator('#snapshot-enquiry form').waitFor();
  await page.goto(`${base}/ai-visibility-snapshot`);
  await page.getByRole('heading', { name: 'See what AI says. Know what to fix.' }).waitFor();
  await page.goto(base);
  await page.locator('.lt-hero-actions').getByRole('link', { name: 'Request a Dev Fix' }).click();
  await page.waitForURL('**/dev-fix');
  await page.getByRole('form', { name: 'Dev Fix request' }).waitFor();
  const paymentLinks = [
    'https://buy.stripe.com/dRm14pajb1605ZEgfH5wI0h', 'https://buy.stripe.com/5kQeVf4YR2a4afUbZr5wI0i',
    'https://buy.stripe.com/9B64gBdvn3e89bQ8Nf5wI0j', 'https://buy.stripe.com/fZu5kF9f73e873I5B35wI0k',
  ];
  for (const width of [375, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const geometry = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, fields: Array.from(document.querySelectorAll('.lt-dev-form input:not([type="checkbox"]):not([name="website"]), .lt-dev-form select, .lt-dev-form textarea')).map((el) => { const rect = el.getBoundingClientRect(); return { left: rect.left, right: rect.right, width: rect.width, size: parseFloat(getComputedStyle(el).fontSize) }; }) }));
    assert.equal(geometry.overflow, false, `Dev Fix overflow at ${width}`);
    for (const field of geometry.fields) assert.ok(field.left >= 0 && field.right <= width && field.width > 100 && field.size >= 16, `Clipped Dev Fix field: ${JSON.stringify(field)}`);
    await page.screenshot({ path: `qa-artifacts/dev-request/dev-fix-${width}.png`, fullPage: true });
  }
  assert.equal(await page.title(), 'LionTech Dev Fix Desk | Fast Website, App, Stripe & AI MVP Fixes');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://liontechinnovations.co.uk/dev-fix');
  assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), 'LionTech Dev Fix Desk');
  assert.equal(await page.locator('#packages article').count(), 4);
  assert.deepEqual(await page.locator('#packages .lt-dev-fix-price').allTextContents(), ['£150', '£750', '£1,500', '£2,500']);
  const payButtons = page.locator('#packages .lt-button');
  for (let i = 0; i < 4; i++) {
    assert.equal(await payButtons.nth(i).getAttribute('href'), paymentLinks[i]);
    assert.equal(await payButtons.nth(i).getAttribute('target'), '_blank');
    assert.equal(await payButtons.nth(i).getAttribute('rel'), 'noopener noreferrer');
  }
  await page.locator('.lt-route-hero').getByRole('link', { name: 'Request a Dev Fix' }).click();
  await page.waitForURL('**/dev-fix#request');
  const deskForm = page.getByRole('form', { name: 'Dev Fix request' });
  const deskSubmit = deskForm.getByRole('button', { name: 'REQUEST A DEV FIX' });
  requests = [];
  await page.route('**/api/dev-request', async (route) => {
    requests.push(route.request().postDataJSON());
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await deskForm.getByLabel('Name', { exact: true }).fill('Dev Fix QA');
  await deskForm.getByLabel('Email', { exact: true }).fill('qa@example.com');
  await deskForm.getByLabel('Business name', { exact: true }).fill('Example');
  await deskForm.getByLabel('Website or app URL', { exact: true }).fill('example.com');
  await deskForm.getByLabel('What is broken?', { exact: true }).fill('The form does not send.');
  await deskForm.getByLabel('What should happen instead?', { exact: true }).fill('The email should arrive.');
  await deskForm.getByLabel('What tools/stack are involved?', { exact: true }).fill('React and Resend');
  await deskForm.getByRole('combobox', { name: 'Urgency' }).selectOption('48h');
  await deskForm.getByRole('combobox', { name: 'Package interest' }).selectOption('48h Single Fix £750');
  await deskSubmit.click();
  assert.equal(requests.length, 0, 'Consent required before submitting');
  await deskForm.getByRole('checkbox').check();
  await deskForm.getByLabel('Links to screenshots, Loom, repo, or error logs').fill('javascript:alert(1)');
  await deskSubmit.click();
  assert.equal(requests.length, 0, 'Unsafe reference link must be blocked');
  await deskForm.getByLabel('Links to screenshots, Loom, repo, or error logs').fill('example.com/screenshot\nhttps://example.com/repo');
  await deskSubmit.click();
  await page.getByRole('heading', { name: 'Request received.' }).waitFor();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].requestType, 'dev-fix');
  assert.equal(requests[0].consent, 'on');
  assert.equal(requests[0].referenceLinks, 'https://example.com/screenshot\nhttps://example.com/repo');
  assert.ok(await page.getByText('LionTech will review the issue and reply with the next step.', { exact: true }).isVisible());
  await page.unroute('**/api/dev-request');
  await page.goto(base);
  await page.setViewportSize({ width: 375, height: 812 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.equal(await page.locator('#packages article').count(), 4);
  await page.locator('.lt-hero-actions').getByRole('link', { name: 'View Packages' }).click();
  await page.waitForURL('**/#packages');
  await page.waitForFunction(() => Math.abs(document.querySelector('#packages').getBoundingClientRect().top) < 130);
  await page.screenshot({ path: 'qa-artifacts/dev-request/home-packages-mobile.png', fullPage: false });
  await page.goto(base);
  await page.locator('.lt-hero-actions').getByRole('link', { name: 'Request a Dev Fix' }).click();
  await page.waitForURL('**/dev-fix');
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.ok(await page.locator('header').getByRole('link', { name: 'Build / Fix', exact: true }).count());
  assert.ok(await page.locator('footer').count());
  assert.deepEqual(errors, [], 'Unexpected console/hydration errors');
  console.log('Dev request browser: contact + Dev Fix responsive layouts, validation, consent, duplicate/retry, Stripe links, metadata, homepage/nav, anchors and Snapshot regression checks passed. Email responses mocked.');
} finally {
  await browser?.close();
  await new Promise((resolve) => server ? server.httpServer.close(resolve) : resolve());
}
