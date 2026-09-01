import { normalizeWebsiteUrl } from '../src/lib/normalizeWebsiteUrl.js';
import { zimbabweCompanySizes, zimbabweDepartments, zimbabweInterests } from '../src/content/zimbabwe.js';

const allowedFields = new Set(['name', 'email', 'company', 'websiteUrl', 'jobTitle', 'department', 'companySize', 'primaryLocation', 'interest', 'context', 'consent', 'website']);
const limits = { name: 100, email: 180, company: 160, websiteUrl: 500, jobTitle: 160, department: 80, companySize: 20, primaryLocation: 180, interest: 160, context: 2000, website: 100 } as const;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: {
    'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    ...(status === 405 ? { Allow: 'POST' } : {}),
  } });
}
function clean(value: unknown) { return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim() : ''; }
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!)); }

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return json({ ok: false, error: 'JSON required' }, 415);
  const reader = request.body?.getReader();
  if (!reader) return json({ ok: false, error: 'Invalid request' }, 400);
  let body: Record<string, unknown>;
  try {
    let size = 0;
    let raw = '';
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 12_000) { await reader.cancel(); return json({ ok: false, error: 'Request is too large' }, 413); }
      raw += decoder.decode(value, { stream: true });
    }
    const parsed: unknown = JSON.parse(raw + decoder.decode());
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json({ ok: false, error: 'Invalid request' }, 400);
    body = parsed as Record<string, unknown>;
  } catch { return json({ ok: false, error: 'Invalid request' }, 400); }
  finally { reader.releaseLock(); }

  if (Object.keys(body).some((key) => !allowedFields.has(key))) return json({ ok: false, error: 'Unexpected form fields' }, 400);
  if (clean(body.website)) return json({ ok: true });
  for (const [key, maxLength] of Object.entries(limits)) {
    const value = body[key];
    if ((value !== undefined && typeof value !== 'string') || (typeof value === 'string' && value.length > maxLength)) {
      return json({ ok: false, error: 'Check the required fields and try again' }, 400);
    }
  }
  const enquiry = {
    name: clean(body.name), email: clean(body.email).toLowerCase(), company: clean(body.company),
    websiteUrl: normalizeWebsiteUrl(clean(body.websiteUrl)) || '', jobTitle: clean(body.jobTitle),
    department: clean(body.department), companySize: clean(body.companySize), primaryLocation: clean(body.primaryLocation),
    interest: clean(body.interest), context: clean(body.context),
  };
  if (!enquiry.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email) || !enquiry.company || !enquiry.websiteUrl || !enquiry.jobTitle || !enquiry.primaryLocation || body.consent !== true ||
    !(zimbabweDepartments as readonly string[]).includes(enquiry.department) || !(zimbabweCompanySizes as readonly string[]).includes(enquiry.companySize) || !(zimbabweInterests as readonly string[]).includes(enquiry.interest)) {
    return json({ ok: false, error: 'Check the required fields and try again' }, 400);
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ ok: false, error: 'Enquiry service is unavailable' }, 500);
  const recipient = process.env.INTAKE_RECIPIENT_EMAIL || 'admin@liontechinnovations.co.uk';
  const from = process.env.INTAKE_FROM_EMAIL || 'onboarding@resend.dev';
  const rows = [
    ['Market', 'Zimbabwe'], ['Full name', enquiry.name], ['Work email', enquiry.email], ['Company', enquiry.company],
    ['Website', enquiry.websiteUrl], ['Job title / role', enquiry.jobTitle], ['Department', enquiry.department],
    ['Company size', enquiry.companySize], ['Primary operating location', enquiry.primaryLocation], ['Area of interest', enquiry.interest],
    ['Context', enquiry.context || 'Not supplied'], ['Consent', 'Granted for reviewing and responding to this enquiry'],
  ];
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10_000),
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `LionTech Zimbabwe Enquiry <${from}>`, to: recipient, reply_to: enquiry.email,
        subject: `Zimbabwe corporate enquiry: ${enquiry.company}`,
        text: `Zimbabwe Corporate AI & Digital Readiness enquiry\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}`,
        html: `<h1>Zimbabwe Corporate AI &amp; Digital Readiness enquiry</h1><table>${rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join('')}</table>`,
      }),
    });
    if (!response.ok) return json({ ok: false, error: 'Enquiry service is unavailable' }, 502);
    return json({ ok: true });
  } catch { return json({ ok: false, error: 'Enquiry service is unavailable' }, 502); }
}

export const config = { runtime: 'edge' };
