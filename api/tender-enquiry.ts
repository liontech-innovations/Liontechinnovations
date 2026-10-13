import { tenderEnquiryLimits, tenderSectors, tenderSupport } from '../src/content/tenders/enquiry.js';
import { tenderCatalog } from '../src/content/tenders/catalog.js';
import { tenderHubReview, tenderReviews, isTenderPublished, tenderReleaseEnabled } from '../src/content/tenders/release.js';
import { normalizeWebsiteUrl } from '../src/lib/normalizeWebsiteUrl.js';
export const config = { runtime: 'edge' };
// Best-effort bounded per-instance limiter, as in dev-request; not distributed protection.
const attempts = new Map<string, { count: number; expires: number }>();
function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...(status === 405 ? { Allow: 'POST' } : {}), ...(status === 429 ? { 'Retry-After': '600' } : {}) } }); }
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
async function limited(request: Request) {
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  const key = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  const previous = attempts.get(key);
  if (previous) return ++previous.count > 5;
  if (attempts.size >= 1000) return true;
  attempts.set(key, { count: 1, expires: now + 600_000 });
  return false;
}
function validDeadline(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day, hour, minute] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return year >= 2000 && date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day && date.getUTCHours() === hour && date.getUTCMinutes() === minute;
}
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false }, 405);
  const preview = process.env.VERCEL_ENV !== 'production' && (process.env.VERCEL_ENV === 'preview' || process.env.VITE_TENDERS_PREVIEW === 'true');
  if (!preview && !(tenderReleaseEnabled && isTenderPublished(tenderHubReview))) return json({ ok: false, error: 'Tender enquiries are not released.' }, 503);
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return json({ ok: false }, 415);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ ok: false }, 403);
  if (await limited(request)) return json({ ok: false, error: 'Too many requests. Try again in 10 minutes.' }, 429);
  const reader = request.body?.getReader();
  if (!reader) return json({ ok: false }, 400);
  let body: Record<string, unknown>;
  try {
    let raw = '', bytes = 0;
    const decoder = new TextDecoder();
    while (true) { const { done, value } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > 16_000) { await reader.cancel(); return json({ ok: false }, 413); } raw += decoder.decode(value, { stream: true }); }
    const parsed = JSON.parse(raw + decoder.decode());
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json({ ok: false }, 400);
    body = parsed;
  } catch { return json({ ok: false }, 400); }
  finally { reader.releaseLock(); }
  if (Object.keys(body).some(key => !Object.hasOwn(tenderEnquiryLimits, key))) return json({ ok: false }, 400);
  const fields: Record<string, string> = {};
  for (const [key, max] of Object.entries(tenderEnquiryLimits)) {
    const value = body[key] ?? '';
    if (typeof value !== 'string' || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value) || (key !== 'message' && /[\r\n\t]/.test(value))) return json({ ok: false }, 400);
    fields[key] = value.trim();
  }
  if (fields.website) return json({ ok: true });
  const sources = new Set(['/tenders', ...tenderCatalog.filter(page => preview || (tenderReviews[page.slug] && isTenderPublished(tenderReviews[page.slug]))).map(page => page.path)]);
  if (!fields.name || !fields.company || !fields.message || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fields.email) || fields.consent !== 'on' ||
    !(tenderSectors as readonly string[]).includes(fields.sector) || !(tenderSupport as readonly string[]).includes(fields.support) || !sources.has(fields.source) || !validDeadline(fields.deadline) ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(fields.requestId)) return json({ ok: false }, 400);
  try { new Intl.DateTimeFormat('en-GB', { timeZone: fields.timezone }); } catch { return json({ ok: false }, 400); }
  const timestamp = Date.parse(fields.submittedAt);
  if (!Number.isFinite(timestamp) || timestamp < Date.now() - 23 * 3_600_000 || timestamp > Date.now() + 60_000) return json({ ok: false }, 400);
  if (fields.publicTenderUrl) {
    const url = normalizeWebsiteUrl(fields.publicTenderUrl);
    if (!url) return json({ ok: false }, 400);
    const parsed = new URL(url);
    if ([...parsed.searchParams.keys()].some(key => /^(token|access_token|secret|password|signature|sig)$/i.test(key))) return json({ ok: false }, 400);
    fields.publicTenderUrl = url;
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INTAKE_FROM_EMAIL;
  if (!apiKey || !from) return json({ ok: false }, 503);
  const rows = [['Name', fields.name], ['Work email', fields.email], ['Company', fields.company], ['Public tender URL', fields.publicTenderUrl || 'Not supplied'], ['Deadline (as provided)', `${fields.deadline} ${fields.timezone}`], ['Sector', fields.sector], ['Support needed', fields.support], ['Message', fields.message], ['Source page', fields.source], ['Consent', 'Contact about this enquiry'], ['Submitted at (UTC)', new Date(timestamp).toISOString()]];
  try {
    // Store the link as text only. Never fetch the submitted tender URL or trigger an AI job.
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', signal: AbortSignal.timeout(10_000), headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `tender-enquiry/${fields.requestId}` }, body: JSON.stringify({ from: `LionTech Tender Enquiry <${from}>`, to: 'admin@liontechinnovations.co.uk', reply_to: fields.email, subject: `TENDER ENQUIRY - ${fields.company}`, text: rows.map(([label, value]) => `${label}: ${value}`).join('\n\n'), html: `<h1>Tender enquiry</h1><table>${rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('')}</table>` }) });
    if (!response.ok) return json({ ok: false }, 502);
    const result = await response.json();
    if (typeof result?.id !== 'string' || !result.id) return json({ ok: false }, 502);
    return json({ ok: true });
  } catch { return json({ ok: false }, 502); }
}
