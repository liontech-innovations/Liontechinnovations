export const config = { runtime: 'edge' };

const SITE_URL = 'https://liontechinnovations.co.uk';

function appendMetadata(params: URLSearchParams, key: string, value: string) {
  params.append(`subscription_data[metadata][${key}]`, value);
  params.append(`metadata[${key}]`, value);
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response('STRIPE_SECRET_KEY is missing. Cannot create server-side Checkout Sessions.', { status: 500 });
  }

  const monthlyPriceId = process.env.MANAGED_MONTHLY_PRICE_ID;
  if (!monthlyPriceId) {
    return new Response('MANAGED_MONTHLY_PRICE_ID is missing. Cannot automate the £199/month subscription.', { status: 500 });
  }

  const params = new URLSearchParams();

  params.append('mode', 'subscription');
  params.append('payment_method_collection', 'always');
  params.append('phone_number_collection[enabled]', 'true');
  params.append('success_url', `${SITE_URL}/lead-recovery?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
  params.append('cancel_url', `${SITE_URL}/lead-recovery?checkout=cancelled`);

  params.append('line_items[0][price_data][currency]', 'gbp');
  params.append('line_items[0][price_data][unit_amount]', '49500');
  params.append('line_items[0][price_data][product_data][name]', 'Roofing Lead Recovery — Managed Setup Deposit');
  params.append('line_items[0][quantity]', '1');

  params.append('line_items[1][price]', monthlyPriceId);
  params.append('line_items[1][quantity]', '1');

  params.append('subscription_data[trial_period_days]', '5');
  appendMetadata(params, 'offer', 'roofing_managed');
  appendMetadata(params, 'setup_fee', '495');
  appendMetadata(params, 'monthly', '199');
  appendMetadata(params, 'page', 'lead-recovery');

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
