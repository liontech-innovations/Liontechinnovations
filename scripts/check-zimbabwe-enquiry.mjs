import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false } });
const originalFetch = globalThis.fetch;
const envKeys = ['RESEND_API_KEY', 'INTAKE_RECIPIENT_EMAIL', 'INTAKE_FROM_EMAIL'];
const previous = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
let sends = [];
let checks = 0;
try {
  const { default: handler } = await vite.ssrLoadModule('/api/zimbabwe-enquiry.ts');
  const { zimbabweInterests } = await vite.ssrLoadModule('/src/content/zimbabwe.ts');
  process.env.RESEND_API_KEY = 'local-validation-only';
  delete process.env.INTAKE_RECIPIENT_EMAIL;
  delete process.env.INTAKE_FROM_EMAIL;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    sends.push(JSON.parse(options.body));
    return new Response('{"id":"local-test"}', { status: 200 });
  };
  const valid = { name: 'Test Reviewer', email: 'REVIEWER@example.com', company: 'Example Organisation', websiteUrl: 'example.co.zw', jobTitle: 'Operations Director', department: 'Operations', companySize: '101-250', primaryLocation: 'Harare', interest: zimbabweInterests[0], context: '', consent: true, website: '' };
  async function test(body, expected, options = {}) {
    const request = new Request('https://liontechinnovations.co.uk/api/zimbabwe-enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body), ...options });
    const response = await handler(request);
    assert.equal(response.status, expected);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    checks++;
    return response.json();
  }
  for (const websiteUrl of ['example.co.zw', 'www.example.co.zw', 'https://example.co.zw']) {
    await test({ ...valid, websiteUrl }, 200);
    assert.match(sends.at(-1).text, /Website: https:\/\/(www\.)?example\.co\.zw\/?/);
  }
  assert.equal(sends[0].to, 'admin@liontechinnovations.co.uk');
  assert.equal(sends[0].reply_to, 'reviewer@example.com');
  assert.equal(sends[0].subject, 'Zimbabwe corporate enquiry: Example Organisation');
  assert.match(sends[0].text, /Market: Zimbabwe/);
  for (const interest of zimbabweInterests) await test({ ...valid, interest }, 200);
  for (const key of ['name', 'email', 'company', 'websiteUrl', 'jobTitle', 'department', 'companySize', 'primaryLocation', 'interest', 'consent']) {
    const missing = { ...valid }; delete missing[key]; await test(missing, 400);
  }
  for (const websiteUrl of ['javascript:alert(1)', 'just invalid text', 'ftp://example.com', 'https://user:password@example.com']) await test({ ...valid, websiteUrl }, 400);
  for (const bad of [{ consent: 'true' }, { department: 'Unknown' }, { companySize: 'Unknown' }, { interest: 'Unknown' }, { email: 'not-an-email' }, { context: 'x'.repeat(2001) }, { name: { value: 'Test' } }, { apiKey: 'not-allowed' }, { password: 'not-allowed' }, { market: 'Other' }]) await test({ ...valid, ...bad }, 400);
  await test('[]', 400); await test('null', 400); await test('broken json', 400);
  await test({ ...valid, context: 'x'.repeat(12_001) }, 413);
  await test({ ...valid, context: '界'.repeat(4200) }, 413);
  await test(valid, 415, { headers: { 'Content-Type': 'text/plain' } });
  const beforeHoneypot = sends.length;
  await test({ ...valid, website: 'spam' }, 200);
  assert.equal(sends.length, beforeHoneypot);
  await test({ ...valid, name: '<img src=x onerror=alert(1)>', context: '<script>alert(1)</script>', company: 'Example\r\nCompany' }, 200);
  assert.ok(!sends.at(-1).html.includes('<script>'));
  assert.ok(!sends.at(-1).html.includes('<img'));
  assert.match(sends.at(-1).html, /&lt;script&gt;/);
  assert.ok(!sends.at(-1).subject.includes('\n'));
  const method = await handler(new Request('https://liontechinnovations.co.uk/api/zimbabwe-enquiry'));
  assert.equal(method.status, 405); assert.equal(method.headers.get('allow'), 'POST'); checks++;
  delete process.env.RESEND_API_KEY;
  await test(valid, 500);
  process.env.RESEND_API_KEY = 'local-validation-only';
  globalThis.fetch = async () => new Response('upstream failure detail', { status: 429 });
  const failure = await test(valid, 502);
  assert.equal(failure.error, 'Enquiry service is unavailable');
  globalThis.fetch = async () => { throw new Error('simulated network failure'); };
  await test(valid, 502);
  process.stdout.write(`Zimbabwe enquiry API: ${checks} scenarios passed. Resend mocked; zero real emails sent.\n`);
} finally {
  globalThis.fetch = originalFetch;
  for (const key of envKeys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; }
  await vite.close();
}
