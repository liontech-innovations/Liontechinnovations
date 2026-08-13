type SnapshotEnquiry = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  websiteUrl?: unknown;
  primaryService?: unknown;
  primaryLocation?: unknown;
  competitor?: unknown;
  consent?: unknown;
  website?: unknown;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function clean(value: unknown, maxLength = 300) {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength)
    : '';
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character]!));
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPublicHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  let body: SnapshotEnquiry;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 12_000) return json({ ok: false, error: 'Request is too large' }, 413);
    body = JSON.parse(rawBody) as SnapshotEnquiry;
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400);
  }

  if (clean(body.website, 100)) return json({ ok: true });

  const enquiry = {
    name: clean(body.name, 100),
    email: clean(body.email, 180).toLowerCase(),
    company: clean(body.company, 160),
    websiteUrl: clean(body.websiteUrl, 500),
    primaryService: clean(body.primaryService, 220),
    primaryLocation: clean(body.primaryLocation, 180),
    competitor: clean(body.competitor, 220),
  };

  if (
    !enquiry.name ||
    !isEmail(enquiry.email) ||
    !enquiry.company ||
    !isPublicHttpUrl(enquiry.websiteUrl) ||
    !enquiry.primaryService ||
    !enquiry.primaryLocation ||
    body.consent !== true
  ) {
    return json({ ok: false, error: 'Check the required fields and try again' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.INTAKE_RECIPIENT_EMAIL || 'admin@liontechinnovations.co.uk';
  const from = process.env.INTAKE_FROM_EMAIL || 'onboarding@resend.dev';
  if (!apiKey) return json({ ok: false, error: 'Enquiry service is unavailable' }, 500);

  const rows = [
    ['Name', enquiry.name],
    ['Email', enquiry.email],
    ['Company', enquiry.company],
    ['Website', enquiry.websiteUrl],
    ['Primary service', enquiry.primaryService],
    ['Primary location', enquiry.primaryLocation],
    ['Optional competitor', enquiry.competitor || 'Not supplied'],
  ].map(([label, value]) => `<tr><th align="left" style="padding:8px;border-bottom:1px solid #d9dee3">${escapeHtml(label)}</th><td style="padding:8px;border-bottom:1px solid #d9dee3">${escapeHtml(value)}</td></tr>`).join('');

  let response: Response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `LionTech Snapshot Enquiry <${from}>`,
        to: recipient,
        reply_to: enquiry.email,
        subject: `Founding Snapshot request: ${enquiry.company}`,
        html: `<h1>Founding AI Visibility Snapshot request</h1><table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${rows}</table>`,
      }),
    });
  } catch {
    return json({ ok: false, error: 'Enquiry service is unavailable' }, 502);
  }

  if (!response.ok) return json({ ok: false, error: 'Enquiry service is unavailable' }, 502);
  return json({ ok: true });
}

export const config = { runtime: 'edge' };
