import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false } });
const originalFetch = globalThis.fetch;
const keys = ['RESEND_API_KEY', 'INTAKE_RECIPIENT_EMAIL', 'INTAKE_FROM_EMAIL'];
const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
let checks = 0;
const sends = [];
try {
  const { default: handler } = await vite.ssrLoadModule('/api/dev-request.ts');
  const { projectTypes, budgets, timescales } = await vite.ssrLoadModule('/src/content/devRequest.ts');
  const { devFixPackageInterests, devFixUrgencies } = await vite.ssrLoadModule('/src/content/devFix.ts');
  process.env.RESEND_API_KEY = 'local-validation-only';
  delete process.env.INTAKE_RECIPIENT_EMAIL;
  delete process.env.INTAKE_FROM_EMAIL;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    sends.push({ ...JSON.parse(options.body), key: options.headers['Idempotency-Key'] });
    return Response.json({ id: 'local-test' });
  };
  const valid = { name: 'Test Reviewer', email: 'reviewer@example.com', company: 'Example Organisation', websiteUrl: '', projectType: projectTypes[0], description: 'A form needs fixing.', budget: budgets[0], timescale: timescales[0], referenceUrl: '', website: '', requestId: crypto.randomUUID(), submittedAt: new Date().toISOString() };
  async function test(body, expected, options = {}) {
    const request = new Request('https://liontechinnovations.co.uk/api/dev-request', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `test-${checks}`, ...options.headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
    const response = await handler(request);
    assert.equal(response.status, expected, `Scenario ${checks}: ${JSON.stringify(body).slice(0,100)}`);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    if (expected === 429) assert.equal(response.headers.get('retry-after'), '600');
    checks++;
    return response.json();
  }
  await test(valid, 200);
  await test(valid, 200);
  assert.deepEqual(sends[0], sends[1], 'Retries must have identical Resend payload and key');
  assert.equal(sends[0].key, `dev-request/${valid.requestId}`);
  assert.equal(sends[0].to, 'admin@liontechinnovations.co.uk');
  assert.equal(sends[0].reply_to, valid.email);
  assert.equal(sends[0].subject, `NEW DEV REQUEST — ${valid.projectType} — ${valid.company}`);
  assert.match(sends[0].text, /Originating page: https:\/\/liontechinnovations.co.uk\/contact/);
  process.env.INTAKE_RECIPIENT_EMAIL = 'enquiries@example.com';
  process.env.INTAKE_FROM_EMAIL = 'sender@example.com';
  await test(valid, 200);
  assert.equal(sends.at(-1).to, 'enquiries@example.com');
  assert.match(sends.at(-1).from, /sender@example.com/);
  for (const projectType of projectTypes) await test({ ...valid, projectType }, 200);
  for (const budget of budgets) await test({ ...valid, budget }, 200);
  for (const timescale of timescales) await test({ ...valid, timescale }, 200);
  for (const field of ['name', 'email', 'company', 'projectType', 'description', 'budget', 'timescale', 'requestId', 'submittedAt']) {
    const missing = { ...valid }; delete missing[field]; await test(missing, 400);
  }
  for (const field of ['websiteUrl', 'referenceUrl']) {
    await test({ ...valid, [field]: 'example.com/app' }, 200);
    for (const url of ['javascript:alert(1)', 'ftp://example.com', 'https://user:pass@example.com', 'not a website']) await test({ ...valid, [field]: url }, 400);
  }
  for (const bad of [{ email: 'bad-email' }, { email: 'hello@example.com\r\nBCC:x@y.com' }, { company: 'bad\r\nsubject' }, { projectType: 'unknown' }, { budget: 'unknown' }, { timescale: 'unknown' }, { description: ' ' }, { description: 'x'.repeat(4001) }, { name: {} }, { password: 'not-allowed' }, { submittedAt: 'yesterday' }, { submittedAt: '2020-01-01T00:00:00.000Z' }]) await test({ ...valid, ...bad }, 400);
  await test('null', 400); await test('[]', 400); await test('broken JSON', 400);
  await test({ ...valid, description: 'x'.repeat(24001) }, 413);
  await test(valid, 415, { headers: { 'Content-Type': 'text/plain' } });
  await test(valid, 403, { headers: { Origin: 'https://unrelated.example' } });
  const before = sends.length;
  await test({ ...valid, website: 'spam' }, 200);
  assert.equal(sends.length, before);
  await test({ ...valid, name: '<img src=x>', description: '<script>alert(1)</script>\nSecond line' }, 200);
  assert.ok(!sends.at(-1).html.includes('<script>'));
  assert.match(sends.at(-1).html, /&lt;script&gt;/);
  assert.match(sends.at(-1).text, /\nSecond line/);
  const desk = { requestType: 'dev-fix', name: 'Production QA', email: 'qa@example.com', phone: '+44 7700 900123', company: 'Example', websiteUrl: 'example.com', description: 'Contact form does not send.', expectedOutcome: 'An email should arrive.', tools: 'React\nVercel\nResend', urgency: '48h', packageInterest: devFixPackageInterests[0], referenceLinks: 'https://example.com/screenshot\nhttps://example.com/repo', consent: 'on', website: '', requestId: crypto.randomUUID(), submittedAt: new Date().toISOString() };
  await test(desk, 200);
  await test(desk, 200);
  assert.deepEqual(sends.at(-1), sends.at(-2), 'Dev Fix retries must preserve payload and idempotency key');
  assert.equal(sends.at(-1).key, `dev-fix/${desk.requestId}`);
  assert.equal(sends.at(-1).to, 'admin@liontechinnovations.co.uk', 'Dev Fix has the explicitly required recipient');
  assert.equal(sends.at(-1).reply_to, desk.email);
  assert.match(sends.at(-1).subject, /^\[DEV FIX REQUEST\]/);
  for (const field of ['name', 'email', 'company', 'description', 'expectedOutcome', 'tools', 'urgency', 'packageInterest', 'referenceLinks', 'phone']) assert.ok(sends.at(-1).text.includes(desk[field]));
  assert.match(sends.at(-1).text, /Source route: \/dev-fix/);
  assert.match(sends.at(-1).text, /Submitted at \(UTC\):/);
  for (const urgency of devFixUrgencies) await test({ ...desk, urgency }, 200);
  for (const packageInterest of devFixPackageInterests) await test({ ...desk, packageInterest }, 200);
  for (const field of ['name', 'email', 'company', 'websiteUrl', 'description', 'expectedOutcome', 'tools', 'urgency', 'packageInterest', 'consent', 'requestId', 'submittedAt']) {
    const missing = { ...desk }; delete missing[field]; await test(missing, 400);
  }
  await test({ ...desk, phone: '', referenceLinks: '' }, 200);
  for (const bad of [{ phone: 'hello' }, { consent: 'no' }, { urgency: 'tomorrow' }, { packageInterest: 'Free' }, { referenceLinks: 'javascript:alert(1)' }, { referenceLinks: 'https://user:password@example.com' }, { expectedOutcome: 'x'.repeat(4001) }, { tools: {} }, { company: 'Header\r\nInjection' }, { sourceRoute: '/contact' }, { requestType: 'other' }]) await test({ ...desk, ...bad }, 400);
  await test({ ...desk, description: '<script>bad</script>', expectedOutcome: '<img src=x onerror=bad>', tools: '<b>React</b>' }, 200);
  assert.ok(!sends.at(-1).html.includes('<script>'));
  assert.match(sends.at(-1).html, /&lt;img/);
  const beforeDeskSpam = sends.length;
  await test({ ...desk, website: 'bot' }, 200);
  assert.equal(sends.length, beforeDeskSpam);
  for (let i = 0; i < 6; i++) await test(valid, i < 5 ? 200 : 429, { headers: { 'x-forwarded-for': 'rate-test' } });
  const method = await handler(new Request('https://liontechinnovations.co.uk/api/dev-request'));
  assert.equal(method.status, 405); assert.equal(method.headers.get('allow'), 'POST'); checks++;
  delete process.env.RESEND_API_KEY;
  await test(valid, 503);
  process.env.RESEND_API_KEY = 'local-validation-only';
  globalThis.fetch = async () => new Response('private upstream error', { status: 500 });
  assert.deepEqual(await test(valid, 502), { ok: false });
  globalThis.fetch = async () => { throw new Error('Timeout'); };
  await test(valid, 502);
  globalThis.fetch = async () => Response.json({});
  await test(valid, 502);
  console.log(`Dev request API: ${checks} scenarios passed. Resend mocked; zero real emails sent.`);
} finally {
  globalThis.fetch = originalFetch;
  for (const key of keys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; }
  await vite.close();
}
