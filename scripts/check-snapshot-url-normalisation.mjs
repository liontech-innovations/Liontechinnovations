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
      body: JSON.stringify({
        name: 'Snapshot URL Test',
        email: 'test@example.com',
        company: 'LionTech Test',
        websiteUrl: input,
        primaryService: 'AI visibility testing',
        primaryLocation: 'Manchester',
        consent: true,
      }),
    }));
    assert.equal(response.status, 200);
    assert.match(sentEmail.html, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const input of rejected) {
    sentEmail = undefined;
    const response = await snapshotEnquiryHandler(new Request('http://localhost/api/snapshot-enquiry', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Snapshot URL Test',
        email: 'test@example.com',
        company: 'LionTech Test',
        websiteUrl: input,
        primaryService: 'AI visibility testing',
        primaryLocation: 'Manchester',
        consent: true,
      }),
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
    await page.getByLabel('Name').fill('Snapshot URL Test');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Company').fill('LionTech Test');
    await page.getByLabel('Website or domain').fill(input);
    await page.getByLabel('Primary service').fill('AI visibility testing');
    await page.getByLabel('Primary location').fill('Manchester');
    await page.getByLabel(/I agree that LionTech/).check();
    await page.getByRole('button', { name: 'Request a Founding Snapshot' }).click();
    await page.getByRole('heading', { name: 'Request received.' }).waitFor();
    assert.equal(submittedBody.websiteUrl, expected);
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
    await page.getByLabel('Name').fill('Snapshot URL Test');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Company').fill('LionTech Test');
    await page.getByLabel('Website or domain').fill(input);
    await page.getByLabel('Primary service').fill('AI visibility testing');
    await page.getByLabel('Primary location').fill('Manchester');
    await page.getByLabel(/I agree that LionTech/).check();
    await page.getByRole('button', { name: 'Request a Founding Snapshot' }).click();
    await page.getByText('Enter a valid website or domain, such as example.co.uk.').waitFor();
    assert.equal(requestCount, 0);
    process.stdout.write(`Snapshot form rejected ${input} PASS\n`);
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
