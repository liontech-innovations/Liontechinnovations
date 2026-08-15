import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { preview } from 'vite';
import snapshotEnquiryHandler from '../api/snapshot-enquiry.ts';
import { normalizeWebsiteUrl } from '../src/lib/normalizeWebsiteUrl.js';

const accepted = [
  ['https://getcareops.co.uk', 'https://getcareops.co.uk'],
  ['http://getcareops.co.uk', 'http://getcareops.co.uk'],
  ['getcareops.co.uk', 'https://getcareops.co.uk'],
  ['www.getcareops.co.uk', 'https://www.getcareops.co.uk'],
  [' https://getcareops.co.uk/some-page?source=test ', 'https://getcareops.co.uk/some-page?source=test'],
];
const rejected = ['javascript:alert(1)', 'data:text/plain,test', 'file:///tmp/test', 'mailto:test@example.com', 'ftp://getcareops.co.uk', 'not a real website'];
const validPayload = {
  name: 'Snapshot Qualification Test',
  email: 'founder@gmail.com',
  company: 'LionTech Test',
  websiteUrl: 'getcareops.co.uk',
  jobTitle: 'Founder',
  department: 'Founder / Leadership',
  companySize: '2–5',
  primaryService: 'AI visibility testing',
  primaryLocation: 'Manchester',
  competitor: 'Example competitor',
  consent: true,
};

for (const [input, expected] of accepted) assert.equal(normalizeWebsiteUrl(input), expected);
for (const input of rejected) assert.equal(normalizeWebsiteUrl(input), null);
process.stdout.write('Snapshot URL normaliser unit cases PASS\n');

const originalFetch = globalThis.fetch;
const originalApiKey = process.env.RESEND_API_KEY;
let sentEmail;
process.env.RESEND_API_KEY = 'snapshot-url-test-key';
globalThis.fetch = async (_url, init) => {
  sentEmail = JSON.parse(String(init?.body));
  return new Response(JSON.stringify({ id: 'test-email' }), { status: 200 });
};

try {
  for (const [input, expected] of accepted.slice(0, 4)) {
    sentEmail = undefined;
    const response = await snapshotEnquiryHandler(new Request('http://localhost/api/snapshot-enquiry', {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, websiteUrl: input }),
    }));
    assert.equal(response.status, 200);
    assert.match(sentEmail.html, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    let previousRowIndex = -1;
    for (const [label, value] of [
      ['Full name', validPayload.name], ['Work email', validPayload.email], ['Company', validPayload.company],
      ['Website', expected], ['Job title / role', validPayload.jobTitle], ['Department', validPayload.department],
      ['Company size', validPayload.companySize], ['Primary service', validPayload.primaryService],
      ['Primary location', validPayload.primaryLocation], ['Optional competitor', validPayload.competitor],
    ]) {
      const rowIndex = sentEmail.html.indexOf(`>${label}</th>`);
      assert.ok(rowIndex > previousRowIndex);
      assert.ok(sentEmail.html.includes(`>${value}</td>`));
      previousRowIndex = rowIndex;
    }
  }

  for (const invalidPayload of [{ department: 'Invalid department' }, { companySize: '1000+' }]) {
    sentEmail = undefined;
    const response = await snapshotEnquiryHandler(new Request('http://localhost/api/snapshot-enquiry', {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, ...invalidPayload }),
    }));
    assert.equal(response.status, 400);
    assert.equal(sentEmail, undefined);
  }

  for (const field of ['jobTitle', 'department', 'companySize']) {
    sentEmail = undefined;
    const response = await snapshotEnquiryHandler(new Request('http://localhost/api/snapshot-enquiry', {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, [field]: '' }),
    }));
    assert.equal(response.status, 400);
    assert.equal(sentEmail, undefined);
  }

  sentEmail = undefined;
  const noConsentResponse = await snapshotEnquiryHandler(new Request('http://localhost/api/snapshot-enquiry', {
    method: 'POST',
    body: JSON.stringify({ ...validPayload, consent: false }),
  }));
  assert.equal(noConsentResponse.status, 400);
  assert.equal(sentEmail, undefined);

  const honeypotResponse = await snapshotEnquiryHandler(new Request('http://localhost/api/snapshot-enquiry', {
    method: 'POST',
    body: JSON.stringify({ ...validPayload, website: 'filled' }),
  }));
  assert.equal(honeypotResponse.status, 200);
  assert.equal(sentEmail, undefined);

  for (const input of rejected) {
    sentEmail = undefined;
    const response = await snapshotEnquiryHandler(new Request('http://localhost/api/snapshot-enquiry', {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, websiteUrl: input }),
    }));
    assert.equal(response.status, 400);
    assert.equal(sentEmail, undefined);
  }
} finally {
  globalThis.fetch = originalFetch;
  if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = originalApiKey;
}
process.stdout.write('Snapshot URL API validation cases PASS\n');

const server = await preview({ preview: { host: '127.0.0.1', port: 4191, strictPort: true } });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();

async function fillSnapshotForm(page, websiteUrl) {
  await page.getByLabel('Full name').fill(validPayload.name);
  await page.getByLabel('Work email').fill(validPayload.email);
  await page.getByLabel('Company name').fill(validPayload.company);
  await page.getByLabel('Website or domain').fill(websiteUrl);
  await page.getByLabel('Job title / role').fill(validPayload.jobTitle);
  await page.getByLabel('Department').selectOption(validPayload.department);
  await page.getByLabel('Company size').selectOption(validPayload.companySize);
  await page.getByLabel('Primary service').fill(validPayload.primaryService);
  await page.getByLabel('Primary location').fill(validPayload.primaryLocation);
  await page.getByLabel('Optional competitor').fill(validPayload.competitor);
  await page.getByLabel(/I agree that LionTech/).check();
}

try {
  for (const [input, expected] of [...accepted.slice(0, 1), ...accepted.slice(2, 4)]) {
    const page = await context.newPage();
    page.setDefaultTimeout(10_000);
    let submittedBody;
    await page.route('**/api/snapshot-enquiry', async (route) => {
      submittedBody = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });
    await page.goto('http://127.0.0.1:4191/contact#snapshot-enquiry');
    await fillSnapshotForm(page, input);
    await page.getByRole('button', { name: 'Request a Founding Snapshot' }).click();
    await page.getByRole('heading', { name: 'Request received.' }).waitFor();
    assert.equal(submittedBody.websiteUrl, expected);
    assert.equal(submittedBody.jobTitle, validPayload.jobTitle);
    assert.equal(submittedBody.department, validPayload.department);
    assert.equal(submittedBody.companySize, validPayload.companySize);
    process.stdout.write(`Snapshot form accepted ${input} PASS\n`);
    await page.close();
  }

  for (const input of ['javascript:alert(1)', 'not a real website']) {
    const page = await context.newPage();
    page.setDefaultTimeout(10_000);
    let requestCount = 0;
    await page.route('**/api/snapshot-enquiry', async (route) => {
      requestCount += 1;
      await route.fulfill({ status: 200, body: '{"ok":true}' });
    });
    await page.goto('http://127.0.0.1:4191/contact#snapshot-enquiry');
    await fillSnapshotForm(page, input);
    await page.getByRole('button', { name: 'Request a Founding Snapshot' }).click();
    await page.getByText('Enter a valid website or domain, such as example.co.uk.').waitFor();
    assert.equal(requestCount, 0);
    process.stdout.write(`Snapshot form rejected ${input} PASS\n`);
    await page.close();
  }

  for (const viewport of [{ width: 1440, height: 900, columns: 2 }, { width: 390, height: 844, columns: 1 }]) {
    const page = await context.newPage();
    await page.setViewportSize(viewport);
    await page.goto('http://127.0.0.1:4191/contact#snapshot-enquiry');
    const state = await page.evaluate(() => ({
      anchorTop: document.querySelector('#snapshot-enquiry')?.getBoundingClientRect().top ?? null,
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length,
      formVisible: Boolean(document.querySelector('#snapshot-enquiry form')),
      gridColumns: [...document.querySelectorAll('.lt-form-grid')].map((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      sections: [...document.querySelectorAll('.lt-form-section legend')].map((legend) => legend.textContent?.trim()),
      selectHeights: [...document.querySelectorAll('.lt-enquiry-form select')].map((select) => select.getBoundingClientRect().height),
    }));
    const screenshot = await page.screenshot({ fullPage: true });
    assert.equal(state.brokenImages, 0);
    assert.equal(state.formVisible, true);
    assert.ok(state.anchorTop !== null && state.anchorTop >= 0 && state.anchorTop < viewport.height);
    assert.equal(state.horizontalOverflow, false);
    assert.deepEqual(state.sections, ['Your details', 'Company', 'Snapshot context']);
    assert.ok(state.gridColumns.every((columns) => columns === viewport.columns));
    assert.ok(state.selectHeights.every((height) => height >= 48));
    assert.ok(screenshot.byteLength > 10_000);
    process.stdout.write(`Snapshot qualification layout ${viewport.width}x${viewport.height} PASS\n`);
    await page.close();
  }
} finally {
  process.stdout.write('Closing Snapshot URL browser test...\n');
  await context.close();
  await browser.close();
  process.stdout.write('Snapshot URL browser closed.\n');
  server.httpServer.closeAllConnections();
  await new Promise((resolve, reject) => server.httpServer.close((error) => error ? reject(error) : resolve()));
  process.stdout.write('Snapshot URL preview closed.\n');
}

process.stdout.write('Snapshot URL normalisation: accepted browser and API cases PASS\n');
process.stdout.write('Snapshot URL normalisation: unsafe and invalid cases rejected PASS\n');
