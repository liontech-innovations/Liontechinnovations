import assert from 'node:assert/strict';
import { createServer } from 'vite';
const vite = await createServer({ configFile: false, appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
const originalFetch = globalThis.fetch;
const keys = ['RESEND_API_KEY', 'INTAKE_FROM_EMAIL', 'VERCEL_ENV', 'VITE_TENDERS_PREVIEW'];
const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
let checks = 0;
const sends = [];
try {
  const { default: handler } = await vite.ssrLoadModule('/api/tender-enquiry.ts');
  const { tenderCatalog } = await vite.ssrLoadModule('/src/content/tenders/catalog.ts');
  const { tenderPreviewCohorts } = await vite.ssrLoadModule('/src/content/tenders/release.ts');
  const { tenderEnquiryLimits } = await vite.ssrLoadModule('/src/content/tenders/enquiry.ts');
  const { tenderPricing, tenderCheckoutAvailable } = await vite.ssrLoadModule('/src/content/tenders/pricing.ts');
  assert.equal(tenderCheckoutAvailable(), false);
  assert.equal(tenderPricing.taxBasis, null);
  assert.deepEqual(tenderPricing.offers.map(o => [o.fullFee, o.initialPayment, o.fullFee - o.initialPayment]), [[14900,14900,0], [245000,122500,122500], [395000,197500,197500]]);
  for (const offer of tenderPricing.offers) assert(offer.productId === null && offer.priceId === null && offer.paymentLink === null);
  process.env.VERCEL_ENV = 'preview';
  process.env.RESEND_API_KEY = 'local-validation-only';
  process.env.INTAKE_FROM_EMAIL = 'sender@example.com';
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails', 'Submitted URL must never be fetched');
    sends.push({ payload: JSON.parse(options.body), key: options.headers['Idempotency-Key'] });
    return Response.json({ id: 'local-qa' });
  };
  const valid = { name: 'Test Reviewer', email: 'qa@example.com', company: 'Fictional QA Company', publicTenderUrl: '', deadline: '2026-12-15T15:00', timezone: 'Europe/London', sector: 'Cleaning', support: 'Tender Fit Review', message: 'Labelled local test; no real enquiry.', source: '/tenders', consent: 'on', website: '', requestId: crypto.randomUUID(), submittedAt: new Date().toISOString() };
  async function check(body, expected, headers = {}) {
    const response = await handler(new Request('https://liontechinnovations.co.uk/api/tender-enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `qa-${checks}`, ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) }));
    assert.equal(response.status, expected, `Scenario ${checks}`);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    checks++;
    return response.json();
  }
  await check(valid, 200); await check(valid, 200);
  assert.deepEqual(sends[0], sends[1], 'Retry must preserve exact payload and provider idempotency key');
  assert.equal(sends[0].key, `tender-enquiry/${valid.requestId}`);
  assert.equal(sends[0].payload.to, 'admin@liontechinnovations.co.uk');
  assert.equal(sends[0].payload.reply_to, valid.email);
  for (const page of tenderCatalog) await check({ ...valid, source: page.path }, tenderPreviewCohorts.includes(page.cohort) ? 200 : 400);
  for (const key of Object.keys(tenderEnquiryLimits)) await check({ ...valid, [key]: 'x'.repeat(tenderEnquiryLimits[key]+1) }, 400);
  for (const key of ['name','email','company','deadline','timezone','sector','support','message','source','consent','requestId','submittedAt']) {
    const missing = { ...valid }; delete missing[key]; await check(missing, 400);
  }
  for (const bad of [{ email: 'bad' }, { email: 'hello@example.com\r\nBcc:other@example.com' }, { company: 'Header\nInjection' }, { name: {} }, { source: '/tenders/unknown' }, { source: 'https://private.invalid/' }, { deadline: '2026-02-30T15:00' }, { deadline: '2026-12-01T25:00' }, { timezone: 'Mars/Unknown' }, { sector: 'invalid' }, { support: 'guaranteed award' }, { consent: 'no' }, { submittedAt: '2020-01-01T00:00:00Z' }, { requestId: 'invalid' }, { unexpected: 'field' }]) await check({ ...valid, ...bad }, 400);
  for (const link of ['javascript:alert(1)', 'ftp://example.com/', 'https://user:password@example.com/', 'http://127.0.0.1:3000/', 'http://169.254.169.254/', 'https://example.com/?token=private']) await check({ ...valid, publicTenderUrl: link }, 400);
  await check({ ...valid, publicTenderUrl: 'https://www.find-tender.service.gov.uk/Notice/example' }, 200);
  await check({ ...valid, name: '<b>QA</b>', message: '<script>bad</script>\nNext line' }, 200);
  assert.match(sends.at(-1).payload.html, /&lt;script&gt;/); assert(!sends.at(-1).payload.html.includes('<script>'));
  const before = sends.length; await check({ ...valid, website: 'spam' }, 200); assert.equal(sends.length, before);
  await check('null', 400); await check('[]', 400); await check('broken', 400); await check('x'.repeat(16001), 413);
  await check(valid, 415, { 'Content-Type': 'text/plain' }); await check(valid, 403, { Origin: 'https://unrelated.example' });
  for (let i=0; i<6; i++) await check(valid, i<5 ? 200 : 429, { 'x-forwarded-for': 'rate-test' });
  assert.equal((await handler(new Request('https://liontechinnovations.co.uk/api/tender-enquiry'))).status, 405);
  delete process.env.RESEND_API_KEY; await check(valid, 503); process.env.RESEND_API_KEY = 'local-validation-only';
  globalThis.fetch = async () => new Response('private error', { status: 500 }); assert.deepEqual(await check(valid, 502), { ok: false });
  globalThis.fetch = async () => { throw new Error('private upstream error'); }; await check(valid, 502);
  globalThis.fetch = async () => Response.json({}); await check(valid, 502);
  process.env.VERCEL_ENV = 'production'; delete process.env.VITE_TENDERS_PREVIEW; await check(valid, 503);
  process.env.VITE_TENDERS_PREVIEW = 'true'; await check(valid, 503);
  const { default: notFound } = await vite.ssrLoadModule('/api/tender-not-found.ts'); assert.equal(notFound().status, 404);
  console.log(`Tender enquiry: ${checks} scenarios pass. Email mocked; production gate closed; proposed totals/deposits/balances correct; all Stripe IDs/URLs null; no real emails, payment or AI calls.`);
} finally {
  globalThis.fetch = originalFetch;
  for (const key of keys) { if (original[key] === undefined) delete process.env[key]; else process.env[key] = original[key]; }
  await vite.close();
}
