export const config = { runtime: 'edge' };

const SITE_URL = (process.env.SITE_URL || 'https://liontechinnovations.co.uk').replace(/\/$/, '');

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response('STRIPE_SECRET_KEY is missing. Cannot create server-side Checkout Sessions.', { status: 500 });
  }

  const params = new URLSearchParams();
  params.append('mode', 'payment');
  params.append('phone_number_collection[enabled]', 'true');
  params.append('success_url', `${SITE_URL}/roofing-brief?plan=oneoff&session_id={CHECKOUT_SESSION_ID}`);
  params.append('cancel_url', `${SITE_URL}/lead-recovery?checkout=cancelled`);

  params.append('line_items[0][price_data][currency]', 'gbp');
  params.append('line_items[0][price_data][unit_amount]', '199500');
  params.append('line_items[0][price_data][product_data][name]', 'Roofing Lead Recovery — Build & Handoff');
  params.append('line_items[0][price_data][product_data][description]', 'One-off emergency roofing lead website build and handoff.');
  params.append('line_items[0][quantity]', '1');

  params.append('metadata[offer]', 'roofing_oneoff');
  params.append('metadata[amount]', '1995');
  params.append('metadata[page]', 'lead-recovery');

  params.append('custom_fields[0][key]', 'business_name');
  params.append('custom_fields[0][label][type]', 'custom');
  params.append('custom_fields[0][label][custom]', 'Roofing business name');
  params.append('custom_fields[0][type]', 'text');

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const session = await stripeResponse.json();

  if (!stripeResponse.ok || typeof session.url !== 'string') {
    return new Response('Unable to create Stripe Checkout Session.', { status: 502 });
  }

  return Response.redirect(session.url, 303);
}
