export const config = { runtime: 'edge' };

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

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) {
    return json({ ok: false, error: 'Missing session_id' }, 400);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return json({ ok: false, error: 'STRIPE_SECRET_KEY is missing' }, 500);
  }

  const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  const session = await stripeResponse.json();
  if (!stripeResponse.ok) {
    return json({ ok: false, error: 'Unable to retrieve checkout session' }, 400);
  }

  return json({
    ok: true,
    customer_email: session.customer_details?.email || session.customer_email || null,
    customer_name: session.customer_details?.name || null,
    customer_phone: session.customer_details?.phone || null,
    customer_id: typeof session.customer === 'string' ? session.customer : null,
    payment_status: session.payment_status || null,
    custom_fields: Array.isArray(session.custom_fields) ? session.custom_fields : [],
    metadata: session.metadata || {},
  });
}
