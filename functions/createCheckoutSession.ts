import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';
import Stripe from 'npm:stripe@18.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const PRICES = {
  places: {
    annual: 'price_1TD0Pd2Sv2QAKzjT3ED6U3ZB' // £20/year
  },
  premium: {
    annual: 'price_1TD0Sk2Sv2QAKzjTl7IoM1Am', // £59/year
    monthly: 'price_1TD0ds2Sv2QAKzjTFX37OK6t' // £5/month
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier, billing_period, success_url, cancel_url } = await req.json();

    if (!tier || !PRICES[tier]) {
      return Response.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const period = billing_period || 'annual';
    const priceId = typeof PRICES[tier] === 'string' 
      ? PRICES[tier] 
      : PRICES[tier][period];

    if (!priceId) {
      return Response.json({ error: 'Invalid billing period for tier' }, { status: 400 });
    }

    // Create or retrieve Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });

    let customerId = customers.data[0]?.id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name,
        metadata: { app_user_email: user.email }
      });
      customerId = customer.id;
    }

    // Use URLs from frontend, fallback to env var
    const appBase = Deno.env.get('BASE44_APP_URL');
    const finalSuccessUrl = success_url || `${appBase}/Success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancel_url || `${appBase}/Pricing`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        user_email: user.email,
        tier: tier,
        billing_period: period
      }
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return Response.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
});