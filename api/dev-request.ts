import { normalizeWebsiteUrl } from '../src/lib/normalizeWebsiteUrl.js';
import { budgets, devRequestLimits, projectTypes, timescales } from '../src/content/devRequest.js';

export const config = { runtime: 'edge' };
const windowMs = 10 * 60_000;
// Best-effort per-instance protection; not a distributed rate limiter.
const attempts = new Map<string, { count: number; expires: number }>();
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: {
    'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    ...(status === 405 ? { Allow: 'POST' } : {}), ...(status === 429 ? { 'Retry-After': '600' } : {}),
  } });
}
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)); }
async function limited(request: Request) {
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  const key = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  const previous = attempts.get(key);
  if (previous) { previous.count += 1; return previous.count > 5; }
  if (attempts.size >= 1000) return true;
  attempts.set(key, { count: 1, expires: now + windowMs });
  return false;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false }, 405);
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return json({ ok: false }, 415);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ ok: false }, 403);
  if (await limited(request)) return json({ ok: false, error: 'Too many requests. Please try again in 10 minutes.' }, 429);
  const reader = request.body?.getReader();
  if (!reader) return json({ ok: false }, 400);
  let parsed: unknown;
  try {
    let raw = '';
    let size = 0;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 24_000) { await reader.cancel(); return json({ ok: false }, 413); }
      raw += decoder.decode(value, { stream: true });
    }
    parsed = JSON.parse(raw + decoder.decode());
  } catch { return json({ ok: false }, 400); }
  finally { reader.releaseLock(); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json({ ok: false }, 400);
  const body = parsed as Record<string, unknown>;
  if (Object.keys(body).some((key) => !Object.hasOwn(devRequestLimits, key))) return json({ ok: false }, 400);
  const fields = {} as Record<keyof typeof devRequestLimits, string>;
  for (const [key, max] of Object.entries(devRequestLimits)) {
    const value = body[key] ?? '';
    if (typeof value !== 'string' || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value) || (key !== 'description' && /[\r\n\t]/.test(value))) return json({ ok: false }, 400);
    fields[key as keyof typeof fields] = value.trim();
  }
  if (fields.website) return json({ ok: true });
  if (!fields.name || !fields.company || !fields.description || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fields.email) ||
    !(projectTypes as readonly string[]).includes(fields.projectType) || !(budgets as readonly string[]).includes(fields.budget) || !(timescales as readonly string[]).includes(fields.timescale) ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(fields.requestId)) return json({ ok: false }, 400);
  const timestamp = Date.parse(fields.submittedAt);
  if (!Number.isFinite(timestamp) || timestamp < Date.now() - 23 * 60 * 60_000 || timestamp > Date.now() + 60_000) return json({ ok: false }, 400);
  for (const key of ['websiteUrl', 'referenceUrl'] as const) {
    if (!fields[key]) continue;
    const url = normalizeWebsiteUrl(fields[key]);
    if (!url) return json({ ok: false }, 400);
    fields[key] = url;
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ ok: false }, 503);
  const recipient = process.env.INTAKE_RECIPIENT_EMAIL || 'admin@liontechinnovations.co.uk';
  const from = process.env.INTAKE_FROM_EMAIL || 'onboarding@resend.dev';
  const rows = [
    ['Name', fields.name], ['Email', fields.email], ['Business', fields.company], ['Project type', fields.projectType],
    ['Description', fields.description], ['Website / app', fields.websiteUrl || 'Not supplied'], ['Reference URL', fields.referenceUrl || 'Not supplied'],
    ['Budget', fields.budget], ['Timescale', fields.timescale], ['Submitted at (UTC)', new Date(timestamp).toISOString()],
    ['Originating page', 'https://liontechinnovations.co.uk/contact'], ['Privacy notice', 'Submitted for review and response to this enquiry'],
  ];
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10_000),
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `dev-request/${fields.requestId}` },
      body: JSON.stringify({
        from: `LionTech Dev Request <${from}>`, to: recipient, reply_to: fields.email,
        subject: `NEW DEV REQUEST — ${fields.projectType} — ${fields.company}`,
        text: rows.map(([label, value]) => `${label}: ${value}`).join('\n\n'),
        html: `<h1>New development request</h1><table>${rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('')}</table>`,
      }),
    });
    if (!response.ok) return json({ ok: false }, 502);
    const result = await response.json();
    if (typeof result?.id !== 'string' || !result.id) return json({ ok: false }, 502);
    return json({ ok: true });
  } catch { return json({ ok: false }, 502); }
}
