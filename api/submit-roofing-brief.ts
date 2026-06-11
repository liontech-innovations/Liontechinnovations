export const config = { runtime: 'edge' };

type BriefBody = Record<string, unknown>;

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

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]!));
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Not provided';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined || value === '') return 'Not provided';
  return String(value);
}

function isEmail(value: unknown) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function section(title: string, fields: Array<[string, unknown]>) {
  return `
    <h3>${escapeHtml(title)}</h3>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px">
      ${fields.map(([label, value]) => `
        <tr>
          <td style="vertical-align:top;font-weight:700;width:220px;border-bottom:1px solid #e5e7eb">${escapeHtml(label)}</td>
          <td style="vertical-align:top;border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(formatValue(value))}</td>
        </tr>
      `).join('')}
    </table>
  `;
}

async function sendEmail(apiKey: string, payload: { from: string; to: string | string[]; reply_to?: string; subject: string; html: string }) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INTAKE_FROM_EMAIL;
  const recipient = process.env.INTAKE_RECIPIENT_EMAIL;
  const missing = [
    !apiKey ? 'RESEND_API_KEY' : null,
    !from ? 'INTAKE_FROM_EMAIL' : null,
    !recipient ? 'INTAKE_RECIPIENT_EMAIL' : null,
  ].filter(Boolean);

  if (missing.length) {
    return json({ ok: false, error: 'Missing required email environment variables', missing }, 500);
  }

  let body: BriefBody;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  if (!body.contactName || !isEmail(body.email) || !body.mobileNumber || !body.roofingBusinessName || !body.mainWebsitePhone || !body.mainTownCity || !body.areasCovered || body.confirmAccurate !== true) {
    return json({ ok: false, error: 'Missing required brief fields' }, 400);
  }

  const planLabel = body.plan === 'oneoff' ? 'One-off' : 'Managed';
  const businessName = String(body.roofingBusinessName || 'Unknown business');
  const subject = `New Roofing Build Brief — ${businessName} — ${planLabel}`;

  const html = `
    <h2 style="font-family:system-ui,-apple-system,Segoe UI,sans-serif">${escapeHtml(subject)}</h2>
    <p><strong>Build clock:</strong> Your 5-working-day build starts once payment and the build brief are both complete.</p>
    ${section('Checkout', [
      ['Plan', planLabel],
      ['Checkout session ID', body.sessionId],
    ])}
    ${section('Contact details', [
      ['Contact name', body.contactName],
      ['Email', body.email],
      ['Mobile number', body.mobileNumber],
      ['Roofing business name', body.roofingBusinessName],
      ['Trading name if different', body.tradingName],
    ])}
    ${section('Website contact details', [
      ['Main phone number to show on website', body.mainWebsitePhone],
      ['WhatsApp same as main phone', body.whatsappSameAsMain],
      ['WhatsApp number', body.whatsappNumber],
      ['Business email to show on website', body.businessEmail],
    ])}
    ${section('Service areas', [
      ['Main town/city', body.mainTownCity],
      ['Areas/postcodes covered', body.areasCovered],
      ['Areas not covered', body.areasNotCovered],
    ])}
    ${section('Roofing services', [
      ['Selected services', body.services],
      ['Other services', body.otherServices],
    ])}
    ${section('Existing online presence', [
      ['Current website URL', body.currentWebsiteUrl],
      ['Google Business Profile link', body.googleBusinessProfile],
      ['Facebook page link', body.facebookPage],
      ['Instagram link', body.instagramLink],
      ['Trade profile links', body.tradeProfileLinks],
    ])}
    ${section('Branding', [
      ['Logo link', body.logoLink],
      ['Logo/photo upload link', body.logoPhotoUploadLink],
      ['Job photos upload link', body.jobPhotosUploadLink],
      ['Brand colours', body.brandColours],
      ['Look and feel notes', body.siteLookNotes],
    ])}
    ${section('Reviews / trust', [
      ['Review links', body.reviewLinks],
      ['Short testimonials', body.testimonials],
      ['Accreditations', body.accreditations],
      ['Insurance / guarantees', body.insuranceGuarantees],
    ])}
    ${section('Domain', [
      ['Domain status', body.domainStatus],
      ['Domain name', body.domainName],
      ['Preferred domain ideas', body.preferredDomainIdeas],
    ])}
    ${section('Urgency / notes', [
      ['Anything important', body.importantNotes],
      ['Best time to contact', body.bestTimeToContact],
      ['Confirmed accurate enough to start', body.confirmAccurate],
    ])}
  `;

  const internal = await sendEmail(apiKey!, {
    from: `LionTech Roofing Brief <${from}>`,
    to: recipient!,
    reply_to: String(body.email),
    subject,
    html,
  });

  if (!internal.ok) {
    return json({ ok: false, error: 'Brief email failed' }, 502);
  }

  if (isEmail(body.email)) {
    const confirmationHtml = `
      <p>Thanks — we've received your build brief.</p>
      <p>Your 5-working-day build starts once payment and the build brief are both complete.</p>
      <p>We'll review your details and contact you if anything is missing.</p>
    `;

    await sendEmail(apiKey!, {
      from: `LionTech Innovations <${from}>`,
      to: String(body.email),
      subject: 'We received your roofing website brief',
      html: confirmationHtml,
    });
  }

  return json({ ok: true });
}
